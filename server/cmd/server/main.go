package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"

	"helmans-academy/server/internal/config"
	"helmans-academy/server/internal/database"
	"helmans-academy/server/internal/handlers"
	"helmans-academy/server/internal/middleware"
	"helmans-academy/server/internal/models"
	"helmans-academy/server/internal/services"
	"helmans-academy/server/internal/utils"
)

func main() {
	log.Println("🚀 Iniciando Helmans Academy SaaS Backend...")

	// 1. Carrega configurações e valida segredos de segurança
	cfg := config.Load()

	// 2. Conecta ao PostgreSQL
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("FATAL: Não foi possível conectar ao banco de dados: %v", err)
	}
	defer db.Close()

	// 3. Executa migrações de schema e seeding
	if err := db.RunMigrations(); err != nil {
		log.Fatalf("FATAL: Falha ao rodar migrações do banco: %v", err)
	}

	// 4. Inicializa WebSocket Hub
	hub := services.NewHub()
	go hub.Run()

	// 5. Instancia Handlers
	authHandler := handlers.NewAuthHandler(db, cfg.JWTSecret)
	dashHandler := handlers.NewDashboardHandler(db)
	memberHandler := handlers.NewMemberHandler(db)
	planHandler := handlers.NewPlanHandler(db)
	invoiceHandler := handlers.NewInvoiceHandler(db)
	workoutHandler := handlers.NewWorkoutHandler(db)
	assessHandler := handlers.NewAssessmentHandler(db)
	checkInHandler := handlers.NewCheckInHandler(db, hub)

	// 6. Router principal Chi
	r := chi.NewRouter()

	// Middlewares essenciais e de segurança
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(middleware.CORS(cfg.CORSOrigins))
	r.Use(middleware.MaxBytes(2 << 20)) // 2MB Max Payload (Diretriz #33)

	// Rate Limiter: 100 requisições por minuto com burst de 150
	rateLimiter := middleware.NewRateLimiter(100, 150, time.Minute)
	r.Use(rateLimiter.Middleware())

	// Health Check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		utils.JSON(w, http.StatusOK, map[string]string{
			"status":  "healthy",
			"system":  "Helmans Academy SaaS API",
			"version": "1.0.0",
		})
	})

	// WebSocket para eventos em tempo real (Catraca, Avisos)
	r.Get("/ws", hub.HandleWebSocket)

	// Rotas da API v1
	r.Route("/api/v1", func(api chi.Router) {
		// Rotas Públicas
		api.Post("/auth/login", authHandler.Login)
		api.Post("/checkin", checkInHandler.ProcessCheckIn) // Terminal de Catraca

		// Rotas Protegidas por Autenticação JWT (Diretriz Mandatória #2)
		api.Group(func(protected chi.Router) {
			protected.Use(middleware.Auth(cfg.JWTSecret))

			// Perfil e Sessão
			protected.Get("/auth/me", authHandler.Me)

			// Dashboard & Analytics
			protected.Get("/dashboard/metrics", dashHandler.GetMetrics)

			// Gestão de Alunos (Matrículas)
			protected.Get("/members", memberHandler.List)
			protected.Post("/members", memberHandler.Create)
			protected.Get("/members/{id}", memberHandler.GetByID)

			// Planos de Treino e Mensalidades
			protected.Get("/plans", planHandler.List)
			protected.With(middleware.RequireRole(models.RoleAdmin)).Post("/plans", planHandler.Create)

			// Financeiro & Faturas
			protected.Get("/invoices", invoiceHandler.List)
			protected.Post("/invoices/{id}/pay", invoiceHandler.Pay)

			// Prescrição de Treinos & Exercícios
			protected.Get("/exercises", workoutHandler.ListExercises)
			protected.Get("/workouts/member/{memberId}", workoutHandler.GetByMember)
			protected.Post("/workouts", workoutHandler.Create)

			// Avaliação Física & Composição Corporal
			protected.Get("/assessments/member/{memberId}", assessHandler.GetByMember)
			protected.Post("/assessments", assessHandler.Create)

			// Feed de Check-ins Recentes
			protected.Get("/checkin/recent", checkInHandler.ListRecent)
		})
	})

	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("⚡ Servidor Helmans Academy SaaS escutando em http://localhost%s", serverAddr)
	if err := http.ListenAndServe(serverAddr, r); err != nil {
		log.Fatalf("FATAL: Erro ao iniciar servidor HTTP: %v", err)
	}
}
