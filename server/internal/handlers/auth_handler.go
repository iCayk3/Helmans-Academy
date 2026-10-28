package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/middleware"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type AuthHandler struct {
	db        *database.DB
	jwtSecret string
}

func NewAuthHandler(db *database.DB, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		db:        db,
		jwtSecret: jwtSecret,
	}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Corpo da requisição inválido.", err)
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		utils.Error(w, http.StatusBadRequest, "E-mail e senha são obrigatórios.", nil)
		return
	}

	var user models.User
	var passwordHash string
	query := `
		SELECT id, name, email, password_hash, role, active, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	err := h.db.QueryRow(query, req.Email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&passwordHash,
		&user.Role,
		&user.Active,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.Error(w, http.StatusUnauthorized, "Credenciais inválidas.", nil)
			return
		}
		utils.Error(w, http.StatusInternalServerError, "Erro interno ao processar autenticação.", err)
		return
	}

	if !user.Active {
		utils.Error(w, http.StatusForbidden, "Conta de usuário desativada. Contate o administrador.", nil)
		return
	}

	// Compara senha usando bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		utils.Error(w, http.StatusUnauthorized, "Credenciais inválidas.", nil)
		return
	}

	// Gera Token JWT
	now := time.Now()
	claims := jwt.MapClaims{
		"sub":   user.ID.String(),
		"email": user.Email,
		"role":  string(user.Role),
		"iat":   now.Unix(),
		"exp":   now.Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "Falha ao emitir token de sessão.", err)
		return
	}

	// Registra auditoria
	ip := middleware.GetClientIP(r)
	_, _ = h.db.Exec(`
		INSERT INTO audit_logs (user_id, action, target_type, target_id, ip_address)
		VALUES ($1, 'user_login', 'users', $2, $3)
	`, user.ID, user.ID, ip)

	utils.Success(w, http.StatusOK, "Login realizado com sucesso.", LoginResponse{
		Token: tokenString,
		User:  user,
	})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	authUser, ok := middleware.GetUser(r)
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "Não autenticado.", nil)
		return
	}

	var user models.User
	query := `
		SELECT id, name, email, role, active, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	err := h.db.QueryRow(query, authUser.ID).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Role,
		&user.Active,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		utils.Error(w, http.StatusNotFound, "Usuário não encontrado.", err)
		return
	}

	utils.JSON(w, http.StatusOK, user)
}
