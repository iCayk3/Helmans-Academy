package database

import (
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func (db *DB) RunMigrations() error {
	schema := `
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

	-- Tabela de Usuários (Staff / Gestores / Instrutores)
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		role VARCHAR(50) NOT NULL DEFAULT 'recepcao',
		active BOOLEAN NOT NULL DEFAULT true,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Tabela de Alunos / Membros
	CREATE TABLE IF NOT EXISTS members (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		code VARCHAR(50) UNIQUE NOT NULL,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		phone VARCHAR(50) NOT NULL,
		cpf VARCHAR(20) UNIQUE NOT NULL,
		birth_date DATE,
		gender VARCHAR(20),
		address TEXT,
		photo_url TEXT,
		status VARCHAR(50) NOT NULL DEFAULT 'active',
		emergency_contact VARCHAR(255),
		notes TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Tabela de Planos de Adesão
	CREATE TABLE IF NOT EXISTS plans (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		name VARCHAR(255) NOT NULL,
		description TEXT,
		duration_months INT NOT NULL DEFAULT 1,
		price NUMERIC(10,2) NOT NULL,
		active BOOLEAN NOT NULL DEFAULT true,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Assinaturas de Alunos
	CREATE TABLE IF NOT EXISTS subscriptions (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
		plan_id UUID NOT NULL REFERENCES plans(id),
		start_date DATE NOT NULL,
		end_date DATE NOT NULL,
		status VARCHAR(50) NOT NULL DEFAULT 'active',
		auto_renew BOOLEAN NOT NULL DEFAULT true,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Cobranças e Faturas Financeiras
	CREATE TABLE IF NOT EXISTS invoices (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
		subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
		amount NUMERIC(10,2) NOT NULL,
		due_date DATE NOT NULL,
		paid_at TIMESTAMP WITH TIME ZONE,
		payment_method VARCHAR(50),
		status VARCHAR(50) NOT NULL DEFAULT 'pending',
		pix_copy_paste TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Biblioteca de Exercícios
	CREATE TABLE IF NOT EXISTS exercises (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		name VARCHAR(255) NOT NULL,
		muscle_group VARCHAR(100) NOT NULL,
		equipment VARCHAR(100),
		instructions TEXT,
		video_url TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Fichas / Prescrições de Treino
	CREATE TABLE IF NOT EXISTS workouts (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
		instructor_id UUID NOT NULL REFERENCES users(id),
		title VARCHAR(255) NOT NULL,
		goal VARCHAR(100) NOT NULL,
		level VARCHAR(50) NOT NULL,
		valid_until DATE NOT NULL,
		is_active BOOLEAN NOT NULL DEFAULT true,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Itens da Ficha de Treino (Divisões A, B, C...)
	CREATE TABLE IF NOT EXISTS workout_items (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
		division VARCHAR(10) NOT NULL,
		exercise_id UUID NOT NULL REFERENCES exercises(id),
		sets INT NOT NULL DEFAULT 3,
		reps VARCHAR(50) NOT NULL DEFAULT '10-12',
		weight_kg NUMERIC(6,2) NOT NULL DEFAULT 0,
		rest_seconds INT NOT NULL DEFAULT 60,
		notes TEXT,
		order_index INT NOT NULL DEFAULT 0
	);

	-- Avaliações Físicas e Composição Corporal
	CREATE TABLE IF NOT EXISTS physical_assessments (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
		evaluator_id UUID NOT NULL REFERENCES users(id),
		weight_kg NUMERIC(5,2) NOT NULL,
		height_cm NUMERIC(5,2) NOT NULL,
		body_fat_pct NUMERIC(4,2) NOT NULL,
		muscle_mass_kg NUMERIC(5,2) NOT NULL,
		chest_cm NUMERIC(5,2),
		waist_cm NUMERIC(5,2),
		abdomen_cm NUMERIC(5,2),
		hips_cm NUMERIC(5,2),
		right_arm_cm NUMERIC(5,2),
		left_arm_cm NUMERIC(5,2),
		right_thigh_cm NUMERIC(5,2),
		left_thigh_cm NUMERIC(5,2),
		notes TEXT,
		assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Registro de Check-in em Tempo Real (Catraca / Acesso)
	CREATE TABLE IF NOT EXISTS checkins (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
		status VARCHAR(50) NOT NULL DEFAULT 'authorized',
		reason TEXT,
		checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Auditoria Imutável (LGPD - Mandatório Diretriz #11 e #12)
	CREATE TABLE IF NOT EXISTS audit_logs (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		user_id UUID,
		action VARCHAR(100) NOT NULL,
		target_type VARCHAR(100) NOT NULL,
		target_id UUID,
		ip_address VARCHAR(45),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	-- Índices de Performance
	CREATE INDEX IF NOT EXISTS idx_members_cpf ON members(cpf);
	CREATE INDEX IF NOT EXISTS idx_members_code ON members(code);
	CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
	CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
	CREATE INDEX IF NOT EXISTS idx_checkins_checked_in_at ON checkins(checked_in_at DESC);
	`

	if _, err := db.Exec(schema); err != nil {
		return fmt.Errorf("erro ao executar migrações de banco: %w", err)
	}

	log.Println("✅ Tabelas e índices do PostgreSQL verificados com sucesso.")

	// Executa Seed de Dados Iniciais (Admin, Planos e Exercícios)
	if err := db.seedInitialData(); err != nil {
		return fmt.Errorf("erro ao popular dados iniciais: %w", err)
	}

	return nil
}

func (db *DB) seedInitialData() error {
	// 1. Cria Admin Padrão se não existir
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM users WHERE email = $1", "admin@helmansacademy.com").Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		hash, err := bcrypt.GenerateFromPassword([]byte("HelmansAdmin2026!"), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		_, err = db.Exec(`
			INSERT INTO users (name, email, password_hash, role, active)
			VALUES ($1, $2, $3, $4, true)
		`, "Administrador Helmans", "admin@helmansacademy.com", string(hash), "admin")
		if err != nil {
			return err
		}
		log.Println("👤 Usuário Administrador inicial criado: admin@helmansacademy.com")
	}

	// 2. Planos padrão
	var planCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM plans").Scan(&planCount)
	if planCount == 0 {
		_, _ = db.Exec(`
			INSERT INTO plans (name, description, duration_months, price, active) VALUES
			('Mensal Standard', 'Acesso livre a musculação e aparelhos', 1, 129.90, true),
			('Trimestral Performance', 'Musculação livre + avaliação física bimestral', 3, 329.90, true),
			('Semestral Elite', 'Musculação + bioimpedância mensal + ficha personalizada', 6, 599.90, true),
			('Anual Black VIP', 'Acesso total irrestrito + acompanhamento VIP e brindes', 12, 1079.90, true);
		`)
		log.Println("🏷️ Planos de assinatura padrão populados.")
	}

	// 3. Biblioteca básica de exercícios
	var exerciseCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM exercises").Scan(&exerciseCount)
	if exerciseCount == 0 {
		_, _ = db.Exec(`
			INSERT INTO exercises (name, muscle_group, equipment, instructions) VALUES
			('Supino Reto com Barra', 'Peito', 'Barra Olímpica e Banco', 'Mantenha os cotovelos a 45 graus e toque a barra suavemente no esterno.'),
			('Supino Inclinado com Halteres', 'Peito', 'Halteres e Banco 30°', 'Foco no feixe clavicular, amplitude total.'),
			('Crucifixo na Polia (Crossover)', 'Peito', 'Polia Dupla', 'Concentre o pico de contração no final do movimento.'),
			('Puxada Frontal Aberta', 'Costas', 'Máquina Puxador', 'Puxe a barra em direção à parte superior do peito mantendo a escápula retraída.'),
			('Remada Curvada com Barra', 'Costas', 'Barra Olímpica', 'Tronco inclinado a 45°, core ativado, puxar rente ao quadril.'),
			('Levantamento Terra', 'Costas', 'Barra e Anilhas', 'Pés alinhados com o quadril, coluna neutra, empurre o chão com as pernas.'),
			('Agachamento Livre', 'Quadríceps', 'Gaiola e Barra', 'Desça quebrando o paralelo mantendo a base estável e joelhos apontando na direção dos pés.'),
			('Leg Press 45°', 'Quadríceps', 'Aparelho Leg Press', 'Mantenha a lombar colada no encosto, amplitude controlada.'),
			('Cadeira Extensora', 'Quadríceps', 'Máquina Extensora', 'Extensão completa com pausa isométrica de 1s no pico.'),
			('Mesa Flexora', 'Posterior de Coxa', 'Máquina Mesa Flexora', 'Contraia os isquiotibiais sem elevar a região lombar.'),
			('Desenvolvimento com Halteres', 'Ombros', 'Halteres e Banco 80°', 'Empurre os halteres para cima sem tocar um no outro no topo.'),
			('Elevação Lateral', 'Ombros', 'Halteres', 'Membros superiores em leve rotação interna até a linha dos ombros.'),
			('Rosca Direta com Barra W', 'Bíceps', 'Barra W', 'Cotovelos fixos ao lado do tronco, sem balanço corporal.'),
			('Rosca Martelo', 'Bíceps', 'Halteres', 'Pegada neutra trabalhando braquial e braquiorradial.'),
			('Tríceps Corda na Polia', 'Tríceps', 'Polia Alta e Corda', 'Abra as pontas da corda na fase final concêntrica.'),
			('Tríceps Testa com Barra W', 'Tríceps', 'Barra W e Banco Reto', 'Desça a barra controladamente em direção à testa mantendo cotovelos fechados.');
		`)
		log.Println("🏋️ Biblioteca de exercícios fundamentais populada.")
	}

	// 4. Cria membros de demonstração se a academia ainda não tiver alunos
	var memberCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM members").Scan(&memberCount)
	if memberCount == 0 {
		var annualPlanID, monthlyPlanID string
		_ = db.QueryRow("SELECT id FROM plans WHERE duration_months = 12 LIMIT 1").Scan(&annualPlanID)
		_ = db.QueryRow("SELECT id FROM plans WHERE duration_months = 1 LIMIT 1").Scan(&monthlyPlanID)

		// Aluno 1: Lucas Gabriel (Ativo)
		var m1ID string
		_ = db.QueryRow(`
			INSERT INTO members (code, name, email, phone, cpf, birth_date, gender, status, notes)
			VALUES ('HA-1001', 'Lucas Gabriel Silveira', 'lucas.silveira@email.com', '(11) 98765-4321', '123.456.789-01', '1995-04-12', 'Masculino', 'active', 'Foco em hipertrofia e força')
			RETURNING id
		`).Scan(&m1ID)

		// Aluno 2: Mariana Fontes (Ativo)
		var m2ID string
		_ = db.QueryRow(`
			INSERT INTO members (code, name, email, phone, cpf, birth_date, gender, status, notes)
			VALUES ('HA-1002', 'Mariana Fontes Andrade', 'mariana.andrade@email.com', '(11) 97654-3210', '234.567.890-12', '1998-08-25', 'Feminino', 'active', 'Treino funcional e musculação')
			RETURNING id
		`).Scan(&m2ID)

		// Aluno 3: Rodrigo Helmans (Ativo - Atleta)
		var m3ID string
		_ = db.QueryRow(`
			INSERT INTO members (code, name, email, phone, cpf, birth_date, gender, status, notes)
			VALUES ('HA-1003', 'Rodrigo Helmans', 'rodrigo@helmansacademy.com', '(11) 99123-8899', '345.678.901-23', '1992-11-03', 'Masculino', 'active', 'Atleta de fisiculturismo categoria Classic')
			RETURNING id
		`).Scan(&m3ID)

		// Aluno 4: Camila Barros (Inadimplente para demonstrar o controle de catraca e financeiro)
		var m4ID string
		_ = db.QueryRow(`
			INSERT INTO members (code, name, email, phone, cpf, birth_date, gender, status, notes)
			VALUES ('HA-1004', 'Camila Barros Dias', 'camila.barros@email.com', '(11) 96543-2109', '456.789.012-34', '2001-02-14', 'Feminino', 'overdue', 'Aguardando renovação do plano mensal')
			RETURNING id
		`).Scan(&m4ID)

		if annualPlanID != "" {
			_, _ = db.Exec(`
				INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status, auto_renew)
				VALUES ($1, $2, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', 'active', true)
			`, m1ID, annualPlanID)

			_, _ = db.Exec(`
				INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status, auto_renew)
				VALUES ($1, $2, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '350 days', 'active', true)
			`, m3ID, annualPlanID)
		}

		if monthlyPlanID != "" {
			_, _ = db.Exec(`
				INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status, auto_renew)
				VALUES ($1, $2, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'active', true)
			`, m2ID, monthlyPlanID)

			_, _ = db.Exec(`
				INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status, auto_renew)
				VALUES ($1, $2, CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'expired', false)
			`, m4ID, monthlyPlanID)

			// Fatura pendente vencida de Camila
			_, _ = db.Exec(`
				INSERT INTO invoices (member_id, amount, due_date, status, payment_method)
				VALUES ($1, 129.90, CURRENT_DATE - INTERVAL '10 days', 'overdue', 'pix')
			`, m4ID)
		}

		// Check-ins recentes de hoje
		_, _ = db.Exec(`
			INSERT INTO checkins (member_id, status, reason, checked_in_at) VALUES
			($1, 'authorized', 'Acesso liberado - Plano Ativo', NOW() - INTERVAL '1 hour'),
			($2, 'authorized', 'Acesso liberado - Plano Ativo', NOW() - INTERVAL '35 minutes'),
			($3, 'authorized', 'Acesso liberado - Plano VIP Ativo', NOW() - INTERVAL '10 minutes'),
			($4, 'denied', 'Acesso bloqueado: Mensalidade vencida há 10 dias', NOW() - INTERVAL '5 minutes');
		`, m1ID, m2ID, m3ID, m4ID)

		log.Println("👥 Alunos de demonstração e registros de catraca populados.")
	}

	return nil
}
