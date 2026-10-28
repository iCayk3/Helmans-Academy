package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/services"
	"helmans-academy/server/internal/utils"
)

type CheckInHandler struct {
	db  *database.DB
	hub *services.Hub
}

func NewCheckInHandler(db *database.DB, hub *services.Hub) *CheckInHandler {
	return &CheckInHandler{
		db:  db,
		hub: hub,
	}
}

type CheckInRequest struct {
	Identifier string `json:"identifier"` // Matrícula (ex: HA-1001), CPF ou UUID
}

func (h *CheckInHandler) ProcessCheckIn(w http.ResponseWriter, r *http.Request) {
	var req CheckInRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Requisição inválida.", err)
		return
	}

	identifier := strings.TrimSpace(req.Identifier)
	if identifier == "" {
		utils.Error(w, http.StatusBadRequest, "Código da matrícula ou CPF é obrigatório.", nil)
		return
	}

	// 1. Busca aluno por code, cpf ou id
	var member models.Member
	var photoURL sql.NullString
	query := `
		SELECT id, code, name, email, phone, cpf, status, COALESCE(photo_url, '')
		FROM members
		WHERE code ILIKE $1 OR cpf = $1 OR id::text = $1
		LIMIT 1
	`
	err := h.db.QueryRow(query, identifier).Scan(
		&member.ID,
		&member.Code,
		&member.Name,
		&member.Email,
		&member.Phone,
		&member.CPF,
		&member.Status,
		&photoURL,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.Error(w, http.StatusNotFound, "Aluno não localizado com o identificador informado.", nil)
			return
		}
		utils.Error(w, http.StatusInternalServerError, "Erro ao consultar dados da catraca.", err)
		return
	}
	member.PhotoURL = photoURL.String

	// 2. Busca plano ativo
	var planName string
	_ = h.db.QueryRow(`
		SELECT p.name
		FROM subscriptions s
		JOIN plans p ON p.id = s.plan_id
		WHERE s.member_id = $1 AND s.status = 'active'
		LIMIT 1
	`, member.ID).Scan(&planName)
	if planName == "" {
		planName = "Sem plano ativo"
	}

	// 3. Regra de Validação de Acesso
	status := "authorized"
	reason := "Acesso liberado - Bom treino!"

	if member.Status == models.MemberInactive {
		status = "denied"
		reason = "Acesso negado: Matrícula inativa. Procure a recepção."
	} else if member.Status == models.MemberLocked {
		status = "denied"
		reason = "Acesso negado: Matrícula trancada temporariamente."
	} else if member.Status == models.MemberOverdue {
		status = "denied"
		reason = "Acesso negado: Mensalidade pendente de pagamento."
	} else {
		// Checa se há alguma fatura vencida no banco
		var overdueCount int
		_ = h.db.QueryRow(`
			SELECT COUNT(*) 
			FROM invoices 
			WHERE member_id = $1 AND status = 'overdue'
		`, member.ID).Scan(&overdueCount)

		if overdueCount > 0 {
			status = "denied"
			reason = "Acesso negado: Consta fatura em atraso. Procure a recepção."
			// Atualiza status do aluno para overdue
			_, _ = h.db.Exec("UPDATE members SET status = 'overdue' WHERE id = $1", member.ID)
		}
	}

	// 4. Grava Check-in
	now := time.Now()
	var checkInID uuid.UUID
	_ = h.db.QueryRow(`
		INSERT INTO checkins (member_id, status, reason, checked_in_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`, member.ID, status, reason, now).Scan(&checkInID)

	checkInRecord := models.CheckIn{
		ID:          checkInID,
		MemberID:    member.ID,
		MemberName:  member.Name,
		MemberCode:  member.Code,
		PlanName:    planName,
		PhotoURL:    member.PhotoURL,
		Status:      status,
		Reason:      reason,
		CheckedInAt: now,
	}

	// 5. Broadcast em Tempo Real via WebSocket para o Painel da Recepção
	h.hub.BroadcastJSON("new_checkin", checkInRecord)

	if status == "authorized" {
		utils.Success(w, http.StatusOK, "Catraca liberada com sucesso!", checkInRecord)
	} else {
		utils.Success(w, http.StatusForbidden, "Acesso bloqueado na catraca.", checkInRecord)
	}
}

func (h *CheckInHandler) ListRecent(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(`
		SELECT c.id, c.member_id, m.name, m.code, COALESCE(p.name, 'Plano Avulso'), COALESCE(m.photo_url, ''), c.status, COALESCE(c.reason, ''), c.checked_in_at
		FROM checkins c
		JOIN members m ON m.id = c.member_id
		LEFT JOIN subscriptions s ON s.member_id = m.id AND s.status = 'active'
		LEFT JOIN plans p ON p.id = s.plan_id
		ORDER BY c.checked_in_at DESC
		LIMIT 20
	`)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao listar check-ins.", err)
		return
	}
	defer rows.Close()

	list := []models.CheckIn{}
	for rows.Next() {
		var ci models.CheckIn
		if err := rows.Scan(
			&ci.ID,
			&ci.MemberID,
			&ci.MemberName,
			&ci.MemberCode,
			&ci.PlanName,
			&ci.PhotoURL,
			&ci.Status,
			&ci.Reason,
			&ci.CheckedInAt,
		); err == nil {
			list = append(list, ci)
		}
	}

	utils.JSON(w, http.StatusOK, list)
}
