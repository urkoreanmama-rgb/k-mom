import SignupForm from './signup-form'
import Link from 'next/link'
import type { UserRole } from '@/lib/supabase/types'

const ROLES: UserRole[] = ['student', 'employer', 'school_admin']

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role: roleParam } = await searchParams
  const role = (ROLES.includes(roleParam as UserRole) ? roleParam : 'student') as UserRole

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← 홈으로
        </Link>
        <h1 className="mt-4 text-3xl font-bold">회원가입</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {role === 'student' && '학생 계정은 무료입니다.'}
          {role === 'employer' && '업주 계정 — 베타 기간 동안 무료.'}
          {role === 'school_admin' && '학교 국제처 — MOU 체결 후 활성화됩니다.'}
        </p>
        <SignupForm defaultRole={role} />
        <p className="mt-6 text-sm text-zinc-500">
          이미 계정이 있나요?{' '}
          <Link href="/login" className="font-medium underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  )
}
