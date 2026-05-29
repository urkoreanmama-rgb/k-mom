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
