package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/middleware"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type AssessmentHandler struct {
	db *database.DB
}

func NewAssessmentHandler(db *database.DB) *AssessmentHandler {
	return &AssessmentHandler{db: db}
}

func (h *AssessmentHandler) GetByMember(w http.ResponseWriter, r *http.Request) {
	memberIDStr := chi.URLParam(r, "memberId")
	memberID, err := uuid.Parse(memberIDStr)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "ID de aluno inválido.", err)
		return
	}

	rows, err := h.db.Query(`
		SELECT a.id, a.member_id, m.name, a.evaluator_id, a.weight_kg, a.height_cm, a.body_fat_pct, a.muscle_mass_kg,
		       COALESCE(a.chest_cm, 0), COALESCE(a.waist_cm, 0), COALESCE(a.abdomen_cm, 0), COALESCE(a.hips_cm, 0),
		       COALESCE(a.right_arm_cm, 0), COALESCE(a.left_arm_cm, 0), COALESCE(a.right_thigh_cm, 0), COALESCE(a.left_thigh_cm, 0),
		       COALESCE(a.notes, ''), a.assessed_at
		FROM physical_assessments a
		JOIN members m ON m.id = a.member_id
		WHERE a.member_id = $1
		ORDER BY a.assessed_at DESC
	`, memberID)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao buscar avaliações físicas.", err)
		return
	}
	defer rows.Close()

	assessments := []models.PhysicalAssessment{}
	for rows.Next() {
		var a models.PhysicalAssessment
		if err := rows.Scan(
			&a.ID,
			&a.MemberID,
			&a.MemberName,
			&a.EvaluatorID,
			&a.WeightKg,
			&a.HeightCm,
			&a.BodyFatPct,
			&a.MuscleMassKg,
			&a.ChestCm,
			&a.WaistCm,
			&a.AbdomenCm,
			&a.HipsCm,
			&a.RightArmCm,
			&a.LeftArmCm,
			&a.RightThighCm,
			&a.LeftThighCm,
			&a.Notes,
			&a.AssessedAt,
		); err == nil {
			assessments = append(assessments, a)
		}
	}

	utils.JSON(w, http.StatusOK, assessments)
}

type CreateAssessmentRequest struct {
	MemberID     string  `json:"member_id"`
	WeightKg     float64 `json:"weight_kg"`
	HeightCm     float64 `json:"height_cm"`
	BodyFatPct   float64 `json:"body_fat_pct"`
	MuscleMassKg float64 `json:"muscle_mass_kg"`
	ChestCm      float64 `json:"chest_cm"`
	WaistCm      float64 `json:"waist_cm"`
	AbdomenCm    float64 `json:"abdomen_cm"`
	HipsCm       float64 `json:"hips_cm"`
	RightArmCm   float64 `json:"right_arm_cm"`
	LeftArmCm    float64 `json:"left_arm_cm"`
	RightThighCm float64 `json:"right_thigh_cm"`
	LeftThighCm  float64 `json:"left_thigh_cm"`
	Notes        string  `json:"notes"`
}

func (h *AssessmentHandler) Create(w http.ResponseWriter, r *http.Request) {
	authUser, ok := middleware.GetUser(r)
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "Sessão expirada.", nil)
		return
	}

	var req CreateAssessmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Dados inválidos.", err)
		return
	}

	memberUUID, err := uuid.Parse(req.MemberID)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "ID de aluno inválido.", err)
		return
	}

	if req.WeightKg <= 20 || req.HeightCm <= 50 {
		utils.Error(w, http.StatusBadRequest, "Peso e altura válidos são obrigatórios.", nil)
		return
	}

	var assessmentID uuid.UUID
	err = h.db.QueryRow(`
		INSERT INTO physical_assessments (
			member_id, evaluator_id, weight_kg, height_cm, body_fat_pct, muscle_mass_kg,
			chest_cm, waist_cm, abdomen_cm, hips_cm, right_arm_cm, left_arm_cm,
			right_thigh_cm, left_thigh_cm, notes, assessed_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
		RETURNING id
	`, memberUUID, authUser.ID, req.WeightKg, req.HeightCm, req.BodyFatPct, req.MuscleMassKg,
		req.ChestCm, req.WaistCm, req.AbdomenCm, req.HipsCm, req.RightArmCm, req.LeftArmCm,
		req.RightThighCm, req.LeftThighCm, req.Notes, time.Now()).Scan(&assessmentID)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao salvar avaliação física.", err)
		return
	}

	utils.Success(w, http.StatusCreated, "Avaliação física registrada com sucesso!", map[string]interface{}{
		"id":         assessmentID,
		"member_id":  memberUUID,
		"weight_kg":  req.WeightKg,
		"fat_pct":    req.BodyFatPct,
	})
}
