package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type PlanHandler struct {
	db *database.DB
}

func NewPlanHandler(db *database.DB) *PlanHandler {
	return &PlanHandler{db: db}
}

func (h *PlanHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query("SELECT id, name, COALESCE(description, ''), duration_months, price, active, created_at FROM plans WHERE active = true ORDER BY duration_months ASC")
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao listar planos.", err)
		return
	}
	defer rows.Close()

	plans := []models.Plan{}
	for rows.Next() {
		var p models.Plan
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.DurationMonths, &p.Price, &p.Active, &p.CreatedAt); err == nil {
			plans = append(plans, p)
		}
	}

	utils.JSON(w, http.StatusOK, plans)
}

type CreatePlanRequest struct {
	Name           string  `json:"name"`
	Description    string  `json:"description"`
	DurationMonths int     `json:"duration_months"`
	Price          float64 `json:"price"`
}

func (h *PlanHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreatePlanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Dados inválidos.", err)
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" || req.DurationMonths <= 0 || req.Price <= 0 {
		utils.Error(w, http.StatusBadRequest, "Nome, duração (meses > 0) e preço válido são obrigatórios.", nil)
		return
	}

	var plan models.Plan
	err := h.db.QueryRow(`
		INSERT INTO plans (name, description, duration_months, price, active)
		VALUES ($1, $2, $3, $4, true)
		RETURNING id, name, description, duration_months, price, active, created_at
	`, req.Name, req.Description, req.DurationMonths, req.Price).Scan(
		&plan.ID,
		&plan.Name,
		&plan.Description,
		&plan.DurationMonths,
		&plan.Price,
		&plan.Active,
		&plan.CreatedAt,
	)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao criar plano.", err)
		return
	}

	utils.Success(w, http.StatusCreated, "Plano cadastrado com sucesso.", plan)
}
