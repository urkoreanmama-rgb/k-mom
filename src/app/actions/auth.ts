'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/supabase/types'

export interface AuthFormState {
  error?: string
  ok?: boolean
}

const VALID_ROLES: UserRole[] = ['student', 'employer', 'school_admin']

export async function signup(
  _prev: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const roleRaw = String(formData.get('role') ?? 'student')
  const role = (VALID_ROLES.includes(roleRaw as UserRole) ? roleRaw : 'student') as UserRole

  if (!email || !password || password.length < 6) {
    return { error: '이메일과 6자 이상 비밀번호가 필요합니다.' }
  }
  if (!name) {
    return { error: '이름을 입력해주세요.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect(roleHome(role))
}

export async function login(
  _prev: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // 역할에 맞는 홈으로 보내기
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '로그인은 됐지만 사용자 정보를 가져오지 못했어요.' }

  const { data: row } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  redirect(roleHome((row?.role ?? 'student') as UserRole))
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

/**
 * 시연용 — 미리 만든 데모 계정으로 즉시 로그인 + 지정 경로로 이동
 * 이메일은 demo-personas.ts 의 화이트리스트만 허용
 */
const DEMO_PASSWORD = 'kmom2026demo'
const ALLOWED_DEMO_EMAILS = new Set([
  'kmom.student1@gmail.com',
  'kmom.student2@gmail.com',
  'kmom.student3@gmail.com',
  'kmom.student4@gmail.com',
  'kmom.student5@gmail.com',
  'kmom.employer1@gmail.com',
  'kmom.employer2@gmail.com',
  'kmom.employer3@gmail.com',
  'kmom.school@gmail.com',
  'kmom.admin@gmail.com',
])

export async function loginAsDemoAccount(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim()
  const dest = String(formData.get('dest') ?? '/')

  if (!ALLOWED_DEMO_EMAILS.has(email)) {
    redirect('/?demo_error=invalid_account')
  }

  const supabase = await createClient()
  // 기존 세션 있으면 끊고 새로 로그인 (역할 전환 시 깔끔)
  await supabase.auth.signOut()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: DEMO_PASSWORD,
  })
  if (error) {
    redirect(`/?demo_error=${encodeURIComponent(error.message)}`)
  }
  redirect(dest)
}

function roleHome(role: UserRole): string {
  switch (role) {
    case 'employer':
      return '/employer/search'
    case 'school_admin':
      return '/school/dashboard'
    case 'platform_admin':
      return '/admin/dashboard'
    case 'student':
    default:
      return '/student/profile'
  }
}
