package handlers

import (
	"net/http"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type DashboardHandler struct {
	db *database.DB
}

func NewDashboardHandler(db *database.DB) *DashboardHandler {
	return &DashboardHandler{db: db}
}

func (h *DashboardHandler) GetMetrics(w http.ResponseWriter, r *http.Request) {
	var metrics models.DashboardMetrics

	// 1. Alunos Ativos
	_ = h.db.QueryRow("SELECT COUNT(*) FROM members WHERE status = 'active'").Scan(&metrics.TotalActiveMembers)

	// 2. Alunos Inadimplentes
	_ = h.db.QueryRow("SELECT COUNT(*) FROM members WHERE status = 'overdue'").Scan(&metrics.TotalOverdueMembers)

	// 3. Check-ins de Hoje
	_ = h.db.QueryRow("SELECT COUNT(*) FROM checkins WHERE DATE(checked_in_at) = CURRENT_DATE").Scan(&metrics.CheckinsToday)

	// 4. Receita do Mês Atual (Faturas Pagas)
	_ = h.db.QueryRow(`
		SELECT COALESCE(SUM(amount), 0) 
		FROM invoices 
		WHERE status = 'paid' 
		  AND EXTRACT(MONTH FROM paid_at) = EXTRACT(MONTH FROM CURRENT_DATE)
		  AND EXTRACT(YEAR FROM paid_at) = EXTRACT(YEAR FROM CURRENT_DATE)
	`).Scan(&metrics.MonthlyRevenue)

	// Se não houver faturas pagas ainda no mês de teste, calcula a receita estimada das assinaturas ativas
	if metrics.MonthlyRevenue == 0 {
		_ = h.db.QueryRow(`
			SELECT COALESCE(SUM(p.price), 0)
			FROM subscriptions s
			JOIN plans p ON p.id = s.plan_id
			WHERE s.status = 'active'
		`).Scan(&metrics.MonthlyRevenue)
	}

	// 5. Novos Alunos no Mês
	_ = h.db.QueryRow(`
		SELECT COUNT(*) 
		FROM members 
		WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
		  AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
	`).Scan(&metrics.NewMembersThisMonth)

	// 6. Taxa de Retenção Estimada
	totalMembers := metrics.TotalActiveMembers + metrics.TotalOverdueMembers
	if totalMembers > 0 {
		metrics.RetentionRatePct = float64(metrics.TotalActiveMembers) / float64(totalMembers) * 100.0
	} else {
		metrics.RetentionRatePct = 100.0
	}

	// 7. Últimos Check-ins em Tempo Real
	rows, err := h.db.Query(`
		SELECT c.id, c.member_id, m.name, m.code, COALESCE(p.name, 'Plano Avulso'), COALESCE(m.photo_url, ''), c.status, COALESCE(c.reason, ''), c.checked_in_at
		FROM checkins c
		JOIN members m ON m.id = c.member_id
		LEFT JOIN subscriptions s ON s.member_id = m.id AND s.status = 'active'
		LEFT JOIN plans p ON p.id = s.plan_id
		ORDER BY c.checked_in_at DESC
		LIMIT 8
	`)

	metrics.RecentCheckIns = []models.CheckIn{}
	if err == nil {
		defer rows.Close()
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
				metrics.RecentCheckIns = append(metrics.RecentCheckIns, ci)
			}
		}
	}

	utils.JSON(w, http.StatusOK, metrics)
}
