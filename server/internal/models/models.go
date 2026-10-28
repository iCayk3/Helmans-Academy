package models

import (
	"time"

	"github.com/google/uuid"
)

type UserRole string

const (
	RoleAdmin     UserRole = "admin"
	RoleGestor    UserRole = "gestor"
	RoleRecepcao  UserRole = "recepcao"
	RolePersonal  UserRole = "personal"
	RoleAvaliador UserRole = "avaliador"
)

type User struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Proteção Mandatória de Segurança: nunca expor senha/hash
	Role         UserRole  `json:"role"`
	Active       bool      `json:"active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type MemberStatus string

const (
	MemberActive   MemberStatus = "active"
	MemberInactive MemberStatus = "inactive"
	MemberLocked   MemberStatus = "locked"
	MemberOverdue  MemberStatus = "overdue"
)

type Member struct {
	ID               uuid.UUID    `json:"id"`
	Code             string       `json:"code"` // Matrícula (ex: HA-1001)
	Name             string       `json:"name"`
	Email            string       `json:"email"`
	Phone            string       `json:"phone"`
	CPF              string       `json:"cpf"`
	BirthDate        *time.Time   `json:"birth_date,omitempty"`
	Gender           string       `json:"gender,omitempty"`
	Address          string       `json:"address,omitempty"`
	PhotoURL         string       `json:"photo_url,omitempty"`
	Status           MemberStatus `json:"status"`
	EmergencyContact string       `json:"emergency_contact,omitempty"`
	Notes            string       `json:"notes,omitempty"`
	CreatedAt        time.Time    `json:"created_at"`
	UpdatedAt        time.Time    `json:"updated_at"`
}

type Plan struct {
	ID             uuid.UUID `json:"id"`
	Name           string    `json:"name"`
	Description    string    `json:"description,omitempty"`
	DurationMonths int       `json:"duration_months"`
	Price          float64   `json:"price"`
	Active         bool      `json:"active"`
	CreatedAt      time.Time `json:"created_at"`
}

type SubscriptionStatus string

const (
	SubscriptionActive   SubscriptionStatus = "active"
	SubscriptionExpired  SubscriptionStatus = "expired"
	SubscriptionCanceled SubscriptionStatus = "canceled"
)

type Subscription struct {
	ID        uuid.UUID          `json:"id"`
	MemberID  uuid.UUID          `json:"member_id"`
	PlanID    uuid.UUID          `json:"plan_id"`
	PlanName  string             `json:"plan_name,omitempty"`
	StartDate time.Time          `json:"start_date"`
	EndDate   time.Time          `json:"end_date"`
	Status    SubscriptionStatus `json:"status"`
	AutoRenew bool               `json:"auto_renew"`
	CreatedAt time.Time          `json:"created_at"`
}

type InvoiceStatus string

const (
	InvoicePending  InvoiceStatus = "pending"
	InvoicePaid     InvoiceStatus = "paid"
	InvoiceOverdue  InvoiceStatus = "overdue"
	InvoiceCanceled InvoiceStatus = "canceled"
)

type Invoice struct {
	ID             uuid.UUID     `json:"id"`
	MemberID       uuid.UUID     `json:"member_id"`
	MemberName     string        `json:"member_name,omitempty"`
	SubscriptionID *uuid.UUID    `json:"subscription_id,omitempty"`
	Amount         float64       `json:"amount"`
	DueDate        time.Time     `json:"due_date"`
	PaidAt         *time.Time    `json:"paid_at,omitempty"`
	PaymentMethod  string        `json:"payment_method,omitempty"` // pix, credit_card, cash, boleto
	Status         InvoiceStatus `json:"status"`
	PixCopyPaste   string        `json:"pix_copy_paste,omitempty"`
	CreatedAt      time.Time     `json:"created_at"`
}

type Exercise struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	MuscleGroup  string    `json:"muscle_group"` // Peito, Costas, Quadríceps, Bíceps, etc.
	Equipment    string    `json:"equipment,omitempty"`
	Instructions string    `json:"instructions,omitempty"`
	VideoURL     string    `json:"video_url,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type WorkoutItem struct {
	ID          uuid.UUID `json:"id"`
	WorkoutID   uuid.UUID `json:"workout_id"`
	Division    string    `json:"division"` // "A", "B", "C", "D", "E"
	ExerciseID  uuid.UUID `json:"exercise_id"`
	Exercise    *Exercise `json:"exercise,omitempty"`
	Sets        int       `json:"sets"`
	Reps        string    `json:"reps"` // "8-12", "15", "Falha"
	WeightKg    float64   `json:"weight_kg"`
	RestSeconds int       `json:"rest_seconds"`
	Notes       string    `json:"notes,omitempty"`
	OrderIndex  int       `json:"order_index"`
}

type Workout struct {
	ID             uuid.UUID     `json:"id"`
	MemberID       uuid.UUID     `json:"member_id"`
	MemberName     string        `json:"member_name,omitempty"`
	InstructorID   uuid.UUID     `json:"instructor_id"`
	InstructorName string        `json:"instructor_name,omitempty"`
	Title          string        `json:"title"` // Ex: "Hipertrofia ABC - Carga Progressiva"
	Goal           string        `json:"goal"`  // Hipertrofia, Emagrecimento, Força, etc.
	Level          string        `json:"level"` // Iniciante, Intermediário, Avançado
	ValidUntil     time.Time     `json:"valid_until"`
	IsActive       bool          `json:"is_active"`
	Items          []WorkoutItem `json:"items,omitempty"`
	CreatedAt      time.Time     `json:"created_at"`
}

type PhysicalAssessment struct {
	ID           uuid.UUID `json:"id"`
	MemberID     uuid.UUID `json:"member_id"`
	MemberName   string    `json:"member_name,omitempty"`
	EvaluatorID  uuid.UUID `json:"evaluator_id"`
	WeightKg     float64   `json:"weight_kg"`
	HeightCm     float64   `json:"height_cm"`
	BodyFatPct   float64   `json:"body_fat_pct"`
	MuscleMassKg float64   `json:"muscle_mass_kg"`
	ChestCm      float64   `json:"chest_cm"`
	WaistCm      float64   `json:"waist_cm"`
	AbdomenCm    float64   `json:"abdomen_cm"`
	HipsCm       float64   `json:"hips_cm"`
	RightArmCm   float64   `json:"right_arm_cm"`
	LeftArmCm    float64   `json:"left_arm_cm"`
	RightThighCm float64   `json:"right_thigh_cm"`
	LeftThighCm  float64   `json:"left_thigh_cm"`
	Notes        string    `json:"notes,omitempty"`
	AssessedAt   time.Time `json:"assessed_at"`
}

type CheckIn struct {
	ID           uuid.UUID `json:"id"`
	MemberID     uuid.UUID `json:"member_id"`
	MemberName   string    `json:"member_name"`
	MemberCode   string    `json:"member_code"`
	PlanName     string    `json:"plan_name"`
	PhotoURL     string    `json:"photo_url,omitempty"`
	Status       string    `json:"status"` // "authorized", "denied"
	Reason       string    `json:"reason,omitempty"`
	CheckedInAt  time.Time `json:"checked_in_at"`
}

type DashboardMetrics struct {
	TotalActiveMembers int       `json:"total_active_members"`
	TotalOverdueMembers int      `json:"total_overdue_members"`
	CheckinsToday      int       `json:"checkins_today"`
	MonthlyRevenue     float64   `json:"monthly_revenue"`
	NewMembersThisMonth int      `json:"new_members_this_month"`
	RetentionRatePct   float64   `json:"retention_rate_pct"`
	RecentCheckIns     []CheckIn `json:"recent_checkins"`
}
