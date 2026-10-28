package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type MemberHandler struct {
	db *database.DB
}

func NewMemberHandler(db *database.DB) *MemberHandler {
	return &MemberHandler{db: db}
}

func (h *MemberHandler) List(w http.ResponseWriter, r *http.Request) {
	search := strings.TrimSpace(r.URL.Query().Get("q"))
	status := strings.TrimSpace(r.URL.Query().Get("status"))

	query := `
		SELECT id, code, name, email, phone, cpf, birth_date, gender, address, COALESCE(photo_url, ''), status, emergency_contact, notes, created_at, updated_at
		FROM members
		WHERE 1=1
	`
	var args []interface{}
	argIdx := 1

	if search != "" {
		query += fmt.Sprintf(" AND (name ILIKE $%d OR code ILIKE $%d OR cpf ILIKE $%d OR email ILIKE $%d)", argIdx, argIdx, argIdx, argIdx)
		args = append(args, "%"+search+"%")
		argIdx++
	}

	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argIdx)
		args = append(args, status)
		argIdx++
	}

	query += " ORDER BY name ASC"

	rows, err := h.db.Query(query, args...)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao buscar alunos.", err)
		return
	}
	defer rows.Close()

	members := []models.Member{}
	for rows.Next() {
		var m models.Member
		var birthDate sql.NullTime
		var gender, address, photoURL, emerg, notes sql.NullString

		if err := rows.Scan(
			&m.ID,
			&m.Code,
			&m.Name,
			&m.Email,
			&m.Phone,
			&m.CPF,
			&birthDate,
			&gender,
			&address,
			&photoURL,
			&m.Status,
			&emerg,
			&notes,
			&m.CreatedAt,
			&m.UpdatedAt,
		); err != nil {
			continue
		}

		if birthDate.Valid {
			m.BirthDate = &birthDate.Time
		}
		m.Gender = gender.String
		m.Address = address.String
		m.PhotoURL = photoURL.String
		m.EmergencyContact = emerg.String
		m.Notes = notes.String

		members = append(members, m)
	}

	utils.JSON(w, http.StatusOK, members)
}

func (h *MemberHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	memberID, err := uuid.Parse(idStr)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "ID de aluno inválido.", err)
		return
	}

	var m models.Member
	var birthDate sql.NullTime
	var gender, address, photoURL, emerg, notes sql.NullString

	query := `
		SELECT id, code, name, email, phone, cpf, birth_date, gender, address, COALESCE(photo_url, ''), status, emergency_contact, notes, created_at, updated_at
		FROM members
		WHERE id = $1
	`
	err = h.db.QueryRow(query, memberID).Scan(
		&m.ID,
		&m.Code,
		&m.Name,
		&m.Email,
		&m.Phone,
		&m.CPF,
		&birthDate,
		&gender,
		&address,
		&photoURL,
		&m.Status,
		&emerg,
		&notes,
		&m.CreatedAt,
		&m.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.Error(w, http.StatusNotFound, "Aluno não encontrado.", nil)
			return
		}
		utils.Error(w, http.StatusInternalServerError, "Erro ao buscar dados do aluno.", err)
		return
	}

	if birthDate.Valid {
		m.BirthDate = &birthDate.Time
	}
	m.Gender = gender.String
	m.Address = address.String
	m.PhotoURL = photoURL.String
	m.EmergencyContact = emerg.String
	m.Notes = notes.String

	utils.JSON(w, http.StatusOK, m)
}

type CreateMemberRequest struct {
	Name             string `json:"name"`
	Email            string `json:"email"`
	Phone            string `json:"phone"`
	CPF              string `json:"cpf"`
	BirthDate        string `json:"birth_date,omitempty"`
	Gender           string `json:"gender,omitempty"`
	Address          string `json:"address,omitempty"`
	EmergencyContact string `json:"emergency_contact,omitempty"`
	Notes            string `json:"notes,omitempty"`
	PlanID           string `json:"plan_id,omitempty"`
}

func (h *MemberHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateMemberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Dados inválidos.", err)
		return
	}

	// Validação Estrita no Servidor (Diretriz Mandatória #1)
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Phone = strings.TrimSpace(req.Phone)
	req.CPF = strings.TrimSpace(req.CPF)

	if req.Name == "" || len(req.Name) < 3 {
		utils.Error(w, http.StatusBadRequest, "Nome completo é obrigatório (mínimo 3 caracteres).", nil)
		return
	}
	if req.Email == "" || !strings.Contains(req.Email, "@") {
		utils.Error(w, http.StatusBadRequest, "E-mail válido é obrigatório.", nil)
		return
	}
	if req.CPF == "" || len(req.CPF) < 11 {
		utils.Error(w, http.StatusBadRequest, "CPF válido é obrigatório.", nil)
		return
	}
	if req.Phone == "" {
		utils.Error(w, http.StatusBadRequest, "Telefone para contato é obrigatório.", nil)
		return
	}

	// Gera código sequencial da matrícula (ex: HA-1005)
	var nextNum int
	_ = h.db.QueryRow("SELECT COALESCE(MAX(SUBSTRING(code, 4)::int), 1000) + 1 FROM members WHERE code LIKE 'HA-%'").Scan(&nextNum)
	code := fmt.Sprintf("HA-%d", nextNum)

	var birthDateVal *time.Time
	if req.BirthDate != "" {
		if t, err := time.Parse("2006-01-02", req.BirthDate); err == nil {
			birthDateVal = &t
		}
	}

	var newID uuid.UUID
	insertQuery := `
		INSERT INTO members (code, name, email, phone, cpf, birth_date, gender, address, status, emergency_contact, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', $9, $10)
		RETURNING id
	`
	err := h.db.QueryRow(insertQuery,
		code,
		req.Name,
		req.Email,
		req.Phone,
		req.CPF,
		birthDateVal,
		req.Gender,
		req.Address,
		req.EmergencyContact,
		req.Notes,
	).Scan(&newID)

	if err != nil {
		if strings.Contains(err.Error(), "unique") {
			utils.Error(w, http.StatusConflict, "Já existe um aluno cadastrado com este e-mail ou CPF.", err)
			return
		}
		utils.Error(w, http.StatusInternalServerError, "Erro ao cadastrar aluno.", err)
		return
	}

	// Se um plano foi selecionado na matrícula, cria a assinatura e a fatura automaticamente
	if req.PlanID != "" {
		if planUUID, err := uuid.Parse(req.PlanID); err == nil {
			var durationMonths int
			var price float64
			err := h.db.QueryRow("SELECT duration_months, price FROM plans WHERE id = $1 AND active = true", planUUID).Scan(&durationMonths, &price)
			if err == nil {
				startDate := time.Now()
				endDate := startDate.AddDate(0, durationMonths, 0)

				var subID uuid.UUID
				_ = h.db.QueryRow(`
					INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status, auto_renew)
					VALUES ($1, $2, $3, $4, 'active', true)
					RETURNING id
				`, newID, planUUID, startDate, endDate).Scan(&subID)

				// Fatura correspondente
				_, _ = h.db.Exec(`
					INSERT INTO invoices (member_id, subscription_id, amount, due_date, status, payment_method)
					VALUES ($1, $2, $3, $4, 'pending', 'pix')
				`, newID, subID, price, startDate.AddDate(0, 0, 5))
			}
		}
	}

	utils.Success(w, http.StatusCreated, "Aluno cadastrado com sucesso!", map[string]interface{}{
		"id":   newID,
		"code": code,
		"name": req.Name,
	})
}
