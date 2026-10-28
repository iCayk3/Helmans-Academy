package middleware

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/utils"
)

type contextKey string

const (
	UserContextKey contextKey = "authUser"
)

type AuthUser struct {
	ID    uuid.UUID
	Email string
	Role  models.UserRole
}

func Auth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				utils.Error(w, http.StatusUnauthorized, "Token de autorização não informado.", nil)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				utils.Error(w, http.StatusUnauthorized, "Formato do token inválido. Utilize 'Bearer <token>'.", nil)
				return
			}

			tokenString := parts[1]
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("método de assinatura inválido")
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				utils.Error(w, http.StatusUnauthorized, "Token de autenticação expirado ou inválido.", err)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				utils.Error(w, http.StatusUnauthorized, "Estrutura do token inválida.", nil)
				return
			}

			userIDStr, _ := claims["sub"].(string)
			email, _ := claims["email"].(string)
			roleStr, _ := claims["role"].(string)

			userID, err := uuid.Parse(userIDStr)
			if err != nil {
				utils.Error(w, http.StatusUnauthorized, "Identificador de usuário inválido no token.", err)
				return
			}

			authUser := &AuthUser{
				ID:    userID,
				Email: email,
				Role:  models.UserRole(roleStr),
			}

			ctx := context.WithValue(r.Context(), UserContextKey, authUser)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUser extrai o usuário autenticado do contexto da requisição
func GetUser(r *http.Request) (*AuthUser, bool) {
	u, ok := r.Context().Value(UserContextKey).(*AuthUser)
	return u, ok
}

// RequireRole impõe verificação estrita de papéis no backend (RBAC Mandatório #13)
func RequireRole(allowedRoles ...models.UserRole) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, ok := GetUser(r)
			if !ok {
				utils.Error(w, http.StatusUnauthorized, "Sessão não identificada.", nil)
				return
			}

			for _, role := range allowedRoles {
				if user.Role == role || user.Role == models.RoleAdmin {
					// Admin possui acesso a todas as rotas
					next.ServeHTTP(w, r)
					return
				}
			}

			utils.Error(w, http.StatusForbidden, "Acesso negado: privilégios insuficientes para esta operação.", nil)
		})
	}
}
