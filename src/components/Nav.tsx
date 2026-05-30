import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'

export default async function Nav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  let name = ''
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .single()
    role = data?.role ?? null
    name = data?.name ?? ''
  }

  return (
    <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          K-MOM
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {role === 'student' && (
            <>
              <Link href="/student/profile" className="hover:underline">내 프로필</Link>
              <Link href="/student/history" className="hover:underline">알바 이력</Link>
            </>
          )}
          {role === 'employer' && (
            <>
              <Link
                href="/employer/match"
                className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                ⚡ 맞춤 후보 찾기
              </Link>
              <Link href="/employer/search" className="hover:underline">학생 열람</Link>
              <Link href="/employer/work" className="hover:underline">진행 중인 채용</Link>
              <Link href="/employer/profile" className="hover:underline">내 가게</Link>
              <Link href="/pricing" className="hover:underline text-zinc-500">요금제</Link>
            </>
          )}
          {role === 'school_admin' && (
            <Link href="/school/dashboard" className="hover:underline">학교 대시보드</Link>
          )}
          {role === 'platform_admin' && (
            <>
              <Link href="/admin/dashboard" className="hover:underline">대시보드</Link>
              <Link href="/admin/requests" className="hover:underline">업주 요청</Link>
            </>
          )}
          {user ? (
            <>
              <span className="text-zinc-500">{name}</span>
              <form action={logout}>
                <button className="rounded-md border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">로그인</Link>
              <Link
                href="/signup"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900"
              >
                가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
