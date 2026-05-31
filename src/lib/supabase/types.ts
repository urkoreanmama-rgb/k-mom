// 임시 타입 — Supabase 프로젝트 생성 후 아래 명령으로 자동 생성:
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
//
// 지금은 schema.sql 기반 수동 정의

export type UserRole = 'student' | 'employer' | 'school_admin' | 'platform_admin'
export type VisaType = 'D-2-1' | 'D-2-2' | 'D-2-3' | 'D-2-4' | 'D-2-6' | 'D-2-7' | 'D-2-8' | 'D-4' | 'other'
export type TopikLevel = 'none' | 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5' | 'level_6'
export type EmployerCertLevel = 'bronze' | 'silver' | 'gold'
export type WorkStatus = 'active' | 'completed' | 'cancelled'
export type MouStatus = 'none' | 'pending' | 'active' | 'expired'
export type EnrollmentStatus = 'enrolled' | 'on_leave' | 'graduated' | 'unknown'
export type ImmigrationPermitStatus = 'not_applied' | 'applied' | 'approved' | 'unknown'

export type User = {
  id: string
  role: UserRole
  name: string
  email: string
  nationality: string | null
  visa_type: VisaType | null
  phone: string | null
  created_at: string
  updated_at: string
}

export type StudentProfile = {
  user_id: string
  school_id: string | null
  topik_level: TopikLevel
  intro: string | null
  skills: string[] | null
  photo_url: string | null
  topik_certificate_url: string | null
  professor_recommendation_url: string | null
  verified_badge: boolean
  total_work_hours: number
  enrollment_status: EnrollmentStatus
  immigration_permit_status: ImmigrationPermitStatus
  created_at: string
  updated_at: string
}

export type Employer = {
  user_id: string
  business_name: string
  category: string | null
  address: string | null
  business_registration_url: string | null
  certification_level: EmployerCertLevel
  is_blocked: boolean
  created_at: string
  updated_at: string
}

export type WorkHistory = {
  id: string
  student_id: string
  employer_id: string
  start_date: string
  end_date: string | null
  hours_per_week: number | null
  hourly_wage: number | null
  status: WorkStatus
  created_at: string
}

export type EmployerMatchRequestStatus = 'pending' | 'paid' | 'refunded' | 'waitlist'

export type EmployerMatchRequest = {
  id: string
  employer_id: string | null
  criteria: Record<string, unknown> // MatchCriteria as JSON
  candidate_count: number
  payment_status: EmployerMatchRequestStatus
  payment_transaction_id: string | null
  paid_at: string | null
  revealed_candidate_ids: string[]
  contact_requested_ids: string[]
  waitlisted: boolean
  admin_note: string | null
  is_demo: boolean
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  work_history_id: string
  reviewer_id: string
  reviewee_id: string
  score: number
  items_json: Record<string, unknown> | null
  comment: string | null
  revealed_at: string | null
  created_at: string
}

export type School = {
  id: string
  name: string
  admin_user_id: string | null
  mou_status: MouStatus
  subscription_plan: string | null
  created_at: string
}

// Supabase generated-types 형식에 맞춤 (Views/Functions/Enums/Relationships 키 필수)
type TableShape<Row, InsertReq extends keyof Row> = {
  Row: Row
  Insert: Partial<Row> & Pick<Row, InsertReq>
  Update: Partial<Row>
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      users: TableShape<User, 'id' | 'email'>
      student_profiles: TableShape<StudentProfile, 'user_id'>
      employers: TableShape<Employer, 'user_id' | 'business_name'>
      work_histories: TableShape<WorkHistory, 'student_id' | 'employer_id' | 'start_date'>
      reviews: TableShape<Review, 'work_history_id' | 'reviewer_id' | 'reviewee_id' | 'score'>
      schools: TableShape<School, 'name'>
      employer_match_requests: TableShape<EmployerMatchRequest, 'criteria'>
      school_students: {
        Row: { school_id: string; student_id: string; doc_submitted: boolean; monitored_at: string | null }
        Insert: { school_id: string; student_id: string; doc_submitted?: boolean; monitored_at?: string | null }
        Update: Partial<{ doc_submitted: boolean; monitored_at: string | null }>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      user_role: UserRole
      visa_type: VisaType
      topik_level: TopikLevel
      employer_cert_level: EmployerCertLevel
      work_status: WorkStatus
      mou_status: MouStatus
    }
    CompositeTypes: { [_ in never]: never }
  }
}
