package middleware

import (
	"net/http"

	"helmans-academy/server/internal/utils"
)

// MaxBytes limita o tamanho máximo do payload JSON (padrão 2MB)
// Diretriz de Segurança Mandatória #33 contra DoS e exaustão de memória
func MaxBytes(maxBytes int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.ContentLength > maxBytes {
				utils.Error(w, http.StatusRequestEntityTooLarge, "Payload excede o tamanho máximo permitido (2MB).", nil)
				return
			}
			r.Body = http.MaxBytesReader(w, r.Body, maxBytes)
			next.ServeHTTP(w, r)
		})
	}
}
