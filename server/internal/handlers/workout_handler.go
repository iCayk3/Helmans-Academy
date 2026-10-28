package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/middleware"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type WorkoutHandler struct {
	db *database.DB
}

func NewWorkoutHandler(db *database.DB) *WorkoutHandler {
	return &WorkoutHandler{db: db}
}

func (h *WorkoutHandler) ListExercises(w http.ResponseWriter, r *http.Request) {
	muscle := strings.TrimSpace(r.URL.Query().Get("muscle"))

	query := "SELECT id, name, muscle_group, COALESCE(equipment, ''), COALESCE(instructions, ''), COALESCE(video_url, ''), created_at FROM exercises WHERE 1=1"
	var args []interface{}
	if muscle != "" {
		query += " AND muscle_group ILIKE $1"
		args = append(args, "%"+muscle+"%")
	}
	query += " ORDER BY muscle_group ASC, name ASC"

	rows, err := h.db.Query(query, args...)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao listar exercícios.", err)
		return
	}
	defer rows.Close()

	exercises := []models.Exercise{}
	for rows.Next() {
		var e models.Exercise
		if err := rows.Scan(&e.ID, &e.Name, &e.MuscleGroup, &e.Equipment, &e.Instructions, &e.VideoURL, &e.CreatedAt); err == nil {
			exercises = append(exercises, e)
		}
	}

	utils.JSON(w, http.StatusOK, exercises)
}

func (h *WorkoutHandler) GetByMember(w http.ResponseWriter, r *http.Request) {
	memberIDStr := chi.URLParam(r, "memberId")
	memberID, err := uuid.Parse(memberIDStr)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "ID de aluno inválido.", err)
		return
	}

	rows, err := h.db.Query(`
		SELECT w.id, w.member_id, m.name, w.instructor_id, u.name, w.title, w.goal, w.level, w.valid_until, w.is_active, w.created_at
		FROM workouts w
		JOIN members m ON m.id = w.member_id
		JOIN users u ON u.id = w.instructor_id
		WHERE w.member_id = $1
		ORDER BY w.created_at DESC
	`, memberID)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao buscar fichas de treino.", err)
		return
	}
	defer rows.Close()

	workouts := []models.Workout{}
	for rows.Next() {
		var wkt models.Workout
		if err := rows.Scan(
			&wkt.ID,
			&wkt.MemberID,
			&wkt.MemberName,
			&wkt.InstructorID,
			&wkt.InstructorName,
			&wkt.Title,
			&wkt.Goal,
			&wkt.Level,
			&wkt.ValidUntil,
			&wkt.IsActive,
			&wkt.CreatedAt,
		); err == nil {
			// Carrega itens da ficha
			itemRows, itemErr := h.db.Query(`
				SELECT wi.id, wi.workout_id, wi.division, wi.exercise_id, e.name, e.muscle_group, wi.sets, wi.reps, wi.weight_kg, wi.rest_seconds, COALESCE(wi.notes, ''), wi.order_index
				FROM workout_items wi
				JOIN exercises e ON e.id = wi.exercise_id
				WHERE wi.workout_id = $1
				ORDER BY wi.division ASC, wi.order_index ASC
			`, wkt.ID)

			if itemErr == nil {
				wkt.Items = []models.WorkoutItem{}
				for itemRows.Next() {
					var item models.WorkoutItem
					var exName, exMuscle string
					if err := itemRows.Scan(
						&item.ID,
						&item.WorkoutID,
						&item.Division,
						&item.ExerciseID,
						&exName,
						&exMuscle,
						&item.Sets,
						&item.Reps,
						&item.WeightKg,
						&item.RestSeconds,
						&item.Notes,
						&item.OrderIndex,
					); err == nil {
						item.Exercise = &models.Exercise{
							ID:          item.ExerciseID,
							Name:        exName,
							MuscleGroup: exMuscle,
						}
						wkt.Items = append(wkt.Items, item)
					}
				}
				itemRows.Close()
			}

			workouts = append(workouts, wkt)
		}
	}

	utils.JSON(w, http.StatusOK, workouts)
}

type CreateWorkoutItemRequest struct {
	Division    string  `json:"division"` // "A", "B", "C"
	ExerciseID  string  `json:"exercise_id"`
	Sets        int     `json:"sets"`
	Reps        string  `json:"reps"`
	WeightKg    float64 `json:"weight_kg"`
	RestSeconds int     `json:"rest_seconds"`
	Notes       string  `json:"notes"`
	OrderIndex  int     `json:"order_index"`
}

type CreateWorkoutRequest struct {
	MemberID   string                     `json:"member_id"`
	Title      string                     `json:"title"`
	Goal       string                     `json:"goal"`
	Level      string                     `json:"level"`
	ValidUntil string                     `json:"valid_until"`
	Items      []CreateWorkoutItemRequest `json:"items"`
}

func (h *WorkoutHandler) Create(w http.ResponseWriter, r *http.Request) {
	authUser, ok := middleware.GetUser(r)
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "Sessão expirada.", nil)
		return
	}

	var req CreateWorkoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Dados inválidos.", err)
		return
	}

	memberUUID, err := uuid.Parse(req.MemberID)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, "ID de aluno inválido.", err)
		return
	}

	validDate := time.Now().AddDate(0, 3, 0) // 3 meses de validade padrão
	if req.ValidUntil != "" {
		if t, err := time.Parse("2006-01-02", req.ValidUntil); err == nil {
			validDate = t
		}
	}

	// Desativa fichas anteriores do aluno
	_, _ = h.db.Exec("UPDATE workouts SET is_active = false WHERE member_id = $1", memberUUID)

	var workoutID uuid.UUID
	err = h.db.QueryRow(`
		INSERT INTO workouts (member_id, instructor_id, title, goal, level, valid_until, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, true)
		RETURNING id
	`, memberUUID, authUser.ID, req.Title, req.Goal, req.Level, validDate).Scan(&workoutID)

	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Erro ao criar ficha de treino.", err)
		return
	}

	// Insere itens do treino
	for _, item := range req.Items {
		exUUID, err := uuid.Parse(item.ExerciseID)
		if err != nil {
			continue
		}
		if item.Sets <= 0 {
			item.Sets = 3
		}
		if item.Reps == "" {
			item.Reps = "10-12"
		}
		if item.RestSeconds <= 0 {
			item.RestSeconds = 60
		}

		_, _ = h.db.Exec(`
			INSERT INTO workout_items (workout_id, division, exercise_id, sets, reps, weight_kg, rest_seconds, notes, order_index)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`, workoutID, item.Division, exUUID, item.Sets, item.Reps, item.WeightKg, item.RestSeconds, item.Notes, item.OrderIndex)
	}

	utils.Success(w, http.StatusCreated, "Ficha de treino prescrita com sucesso!", map[string]interface{}{
		"id":         workoutID,
		"title":      req.Title,
		"member_id":  memberUUID,
		"item_count": len(req.Items),
	})
}
