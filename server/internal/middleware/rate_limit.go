package middleware

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"helmans-academy/server/internal/utils"
)

type clientLimit struct {
	tokens     int
	lastRefill time.Time
}

type RateLimiter struct {
	mu      sync.Mutex
	clients map[string]*clientLimit
	rate    int           // tokens adicionados por intervalo
	max     int           // capacidade máxima do bucket
	window  time.Duration // intervalo
}

func NewRateLimiter(rate, max int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		clients: make(map[string]*clientLimit),
		rate:    rate,
		max:     max,
		window:  window,
	}

	// Limpeza periódica de clientes inativos a cada 10 minutos
	go func() {
		for {
			time.Sleep(10 * time.Minute)
			rl.mu.Lock()
			now := time.Now()
			for ip, cl := range rl.clients {
				if now.Sub(cl.lastRefill) > 15*time.Minute {
					delete(rl.clients, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()

	return rl
}

// GetClientIP obtém o IP real de forma segura (Diretriz Mandatória #35 anti-spoofing)
func GetClientIP(r *http.Request) string {
	remoteIP, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		remoteIP = r.RemoteAddr
	}

	// Se for requisição direta (não vinda de proxy confiável local), usa o remoteIP
	parsed := net.ParseIP(remoteIP)
	if parsed != nil && (parsed.IsLoopback() || parsed.IsPrivate()) {
		// Apenas confia em X-Forwarded-For ou X-Real-IP se a conexão direta veio de proxy privado
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			parts := strings.Split(xff, ",")
			if len(parts) > 0 {
				clientIP := strings.TrimSpace(parts[0])
				if net.ParseIP(clientIP) != nil {
					return clientIP
				}
			}
		}
		if xrip := r.Header.Get("X-Real-IP"); xrip != "" {
			if net.ParseIP(xrip) != nil {
				return xrip
			}
		}
	}

	return remoteIP
}

func (rl *RateLimiter) Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := GetClientIP(r)

			rl.mu.Lock()
			cl, exists := rl.clients[ip]
			now := time.Now()

			if !exists {
				cl = &clientLimit{
					tokens:     rl.max - 1,
					lastRefill: now,
				}
				rl.clients[ip] = cl
				rl.mu.Unlock()
				next.ServeHTTP(w, r)
				return
			}

			// Refill tokens
			elapsed := now.Sub(cl.lastRefill)
			refill := int(elapsed / rl.window) * rl.rate
			if refill > 0 {
				cl.tokens = min(rl.max, cl.tokens+refill)
				cl.lastRefill = now
			}

			if cl.tokens > 0 {
				cl.tokens--
				rl.mu.Unlock()
				next.ServeHTTP(w, r)
				return
			}

			rl.mu.Unlock()
			utils.Error(w, http.StatusTooManyRequests, "Limite de requisições excedido. Aguarde alguns instantes.", nil)
		})
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
