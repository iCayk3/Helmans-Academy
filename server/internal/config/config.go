package config

import (
	"crypto/rand"
	"encoding/hex"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	CORSOrigins []string
	Environment string
}

var knownInsecureSecrets = []string{
	"secret",
	"change-me",
	"changeme",
	"jwt-secret",
	"solcrm-jwt-secret-key-change-in-production",
	"helmans-academy-secret",
	"123456",
	"password",
}

func Load() *Config {
	// Carrega .env se existir
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8088"
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://helmans_admin:helmans_secure_pass_2026@localhost:5434/helmans_academy?sslmode=disable"
	}

	jwtSecret := os.Getenv("JWT_SECRET")

	// Diretriz de Segurança Mandatória #20: Proibição Absoluta de Segredos JWT Padrão
	if jwtSecret == "" {
		if env == "production" {
			log.Fatalf("FATAL: JWT_SECRET não configurado em ambiente de produção!")
		}
		// Gera chave criptográfica temporária segura no boot para ambiente local de desenvolvimento
		bytes := make([]byte, 32)
		if _, err := rand.Read(bytes); err != nil {
			log.Fatalf("FATAL: Falha ao gerar chave criptográfica segura para JWT: %v", err)
		}
		jwtSecret = hex.EncodeToString(bytes)
		log.Printf("🔒 AVISO: JWT_SECRET não informado. Gerada chave efêmera de 256 bits para desenvolvimento local.")
	} else {
		// Valida se o segredo não é um valor padrão conhecido
		lowerSecret := strings.ToLower(jwtSecret)
		for _, insecure := range knownInsecureSecrets {
			if lowerSecret == insecure || len(jwtSecret) < 16 {
				if env == "production" {
					log.Fatalf("FATAL: JWT_SECRET configurado com valor inseguro ou inferior a 16 caracteres!")
				}
				log.Printf("⚠️ ALERTA DE SEGURANÇA: JWT_SECRET muito fraco detectado. Substituindo por chave efêmera segura de 256 bits.")
				bytes := make([]byte, 32)
				_, _ = rand.Read(bytes)
				jwtSecret = hex.EncodeToString(bytes)
				break
			}
		}
	}

	corsRaw := os.Getenv("CORS_ORIGINS")
	var origins []string
	if corsRaw != "" {
		for _, o := range strings.Split(corsRaw, ",") {
			trimmed := strings.TrimSpace(o)
			if trimmed != "" {
				origins = append(origins, trimmed)
			}
		}
	}
	if len(origins) == 0 {
		origins = []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"}
	}

	return &Config{
		Port:        port,
		DatabaseURL: dbURL,
		JWTSecret:   jwtSecret,
		CORSOrigins: origins,
		Environment: env,
	}
}
