export type UserRole = 'admin' | 'gestor' | 'recepcao' | 'personal' | 'avaliador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at: string;
}

export type MemberStatus = 'active' | 'inactive' | 'locked' | 'overdue';

export interface Member {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  photo_url?: string;
  status: MemberStatus;
  emergency_contact?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  duration_months: number;
  price: number;
  active: boolean;
  created_at: string;
}

export interface Invoice {
  id: string;
  member_id: string;
  member_name: string;
  subscription_id?: string;
  amount: number;
  due_date: string;
  paid_at?: string;
  payment_method?: string;
  status: 'pending' | 'paid' | 'overdue' | 'canceled';
  pix_copy_paste?: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment?: string;
  instructions?: string;
  video_url?: string;
}

export interface WorkoutItem {
  id: string;
  workout_id: string;
  division: string;
  exercise_id: string;
  exercise?: Exercise;
  sets: number;
  reps: string;
  weight_kg: number;
  rest_seconds: number;
  notes?: string;
  order_index: number;
}

export interface Workout {
  id: string;
  member_id: string;
  member_name?: string;
  instructor_id: string;
  instructor_name?: string;
  title: string;
  goal: string;
  level: string;
  valid_until: string;
  is_active: boolean;
  items?: WorkoutItem[];
  created_at: string;
}

export interface PhysicalAssessment {
  id: string;
  member_id: string;
  member_name?: string;
  evaluator_id: string;
  weight_kg: number;
  height_cm: number;
  body_fat_pct: number;
  muscle_mass_kg: number;
  chest_cm?: number;
  waist_cm?: number;
  abdomen_cm?: number;
  hips_cm?: number;
  right_arm_cm?: number;
  left_arm_cm?: number;
  right_thigh_cm?: number;
  left_thigh_cm?: number;
  notes?: string;
  assessed_at: string;
}

export interface CheckIn {
  id: string;
  member_id: string;
  member_name: string;
  member_code: string;
  plan_name: string;
  photo_url?: string;
  status: 'authorized' | 'denied';
  reason?: string;
  checked_in_at: string;
}

export interface DashboardMetrics {
  total_active_members: number;
  total_overdue_members: number;
  checkins_today: number;
  monthly_revenue: number;
  new_members_this_month: number;
  retention_rate_pct: number;
  recent_checkins: CheckIn[];
}
