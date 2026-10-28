package handlers

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type InvoiceHandler struct {
	db *database.DB
}

func NewInvoiceHandler(db *database.DB) *InvoiceHandler {
	return &InvoiceHandler{db: db}
}

func (h *InvoiceHandler) List(w http.ResponseWriter, r *http.Request) {
	status := strings.TrimSpace(r.URL.Query().Get("status"))

	query := `
		SELECT i.id, i.member_id, m.name, i.subscription_id, i.amount, i.due_date, i.paid_at, 
		       COALESCE(i.payment_method, ''), i.status, COALESCE(i.pix_copy_paste, ''), i.created_at
		FROM invoices i
		JOIN members m ON m.id = i.member_id
		WHERE 1=1
	`
	var args []interface{}
	if status != "" {
		query += " AND i.status = $1"
		args = append(args, status)
	}
	query += " ORDER BY i.due_date DESC LIMIT 100"

	rows, err := h.db.Query(query, args...)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao listar faturas.", err)
		return
	}
	defer rows.Close()

	invoices := []models.Invoice{}
	for rows.Next() {
		var inv models.Invoice
		var paidAt sql.NullTime
		var subID uuid.NullUUID
		var payMethod, pix string

		if err := rows.Scan(
			&inv.ID,
			&inv.MemberID,
			&inv.MemberName,
			&subID,
			&inv.Amount,
			&inv.DueDate,
			&paidAt,
			&payMethod,
			&inv.Status,
			&pix,
			&inv.CreatedAt,
		); err == nil {
			if paidAt.Valid {
				inv.PaidAt = &paidAt.Time
			}
			if subID.Valid {
				inv.SubscriptionID = &subID.UUID
			}
			inv.PaymentMethod = payMethod
			inv.PixCopyPaste = pix
			invoices = append(invoices, inv)
		}
	}

	utils.JSON(w, http.StatusOK, invoices)
}

func (h *InvoiceHandler) Pay(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	invoiceID, err := uuid.Parse(idStr)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "ID de fatura inválido.", err)
		return
	}

	var memberID uuid.UUID
	var currentStatus string
	err = h.db.QueryRow("SELECT member_id, status FROM invoices WHERE id = $1", invoiceID).Scan(&memberID, &currentStatus)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Error(w, http.StatusNotFound, "Fatura não encontrada.", nil)
			return
		}
		utils.Error(w, http.StatusInternalServerError, "Erro ao buscar fatura.", err)
		return
	}

	if currentStatus == "paid" {
		utils.Error(w, http.StatusBadRequest, "Esta fatura já está liquidada.", nil)
		return
	}

	now := time.Now()
	_, err = h.db.Exec(`
		UPDATE invoices 
		SET status = 'paid', paid_at = $1 
		WHERE id = $2
	`, now, invoiceID)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao processar baixa de fatura.", err)
		return
	}

	// Se o aluno estava com status 'overdue', reativa o aluno para 'active'
	_, _ = h.db.Exec(`
		UPDATE members 
		SET status = 'active', updated_at = NOW() 
		WHERE id = $1 AND status = 'overdue'
	`, memberID)

	utils.Success(w, http.StatusOK, "Baixa registrada com sucesso! Aluno liberado.", map[string]interface{}{
		"invoice_id": invoiceID,
		"paid_at":    now,
		"status":     "paid",
	})
}
