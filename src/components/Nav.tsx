import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE } from '@/lib/flags'
import MobileMenu, { type NavItem } from './MobileMenu'

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

  // 역할별 메뉴 아이템 (모바일·데스크톱 공통 데이터)
  const items: NavItem[] = []
  if (role === 'student') {
    items.push(
      { href: '/student/profile', label: '내 프로필' },
      { href: '/student/resume', label: '📝 이력서' },
      { href: '/student/employers', label: '업주 둘러보기' },
      { href: '/student/history', label: '알바 이력' },
    )
  } else if (role === 'employer') {
    items.push(
      { href: '/employer/match', label: '⚡ 맞춤 후보 찾기', emphasis: 'highlight' },
      { href: '/employer/search', label: '학생 열람' },
      { href: '/employer/applications', label: '📩 받은 이력서' },
      { href: '/employer/work', label: '진행 중인 채용' },
      { href: '/employer/profile', label: '내 가게' },
      { href: '/pricing', label: '요금제' },
    )
  } else if (role === 'school_admin') {
    items.push({ href: '/school/dashboard', label: '학교 대시보드' })
  } else if (role === 'platform_admin') {
    items.push(
      { href: '/admin/dashboard', label: '대시보드' },
      { href: '/admin/requests', label: '업주 요청' },
    )
  }

  return (
    <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="font-bold text-lg shrink-0">
          K-MOM
        </Link>

        {/* ─── Desktop nav (md 이상) ─── */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {items.map((item) => {
            if (item.emphasis === 'highlight') {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            )
          })}

          {user ? (
            <>
              <span className="text-zinc-500 max-w-[12ch] truncate">{name}</span>
              <form action={logout}>
                <button className="rounded-md border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              {DEMO_MODE && (
                <Link
                  href="/demo"
                  className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
                >
                  🎬 시연 모드
                </Link>
              )}
              <Link href="/login" className="hover:underline text-zinc-500">
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
              >
                가입
              </Link>
            </>
          )}
        </div>

        {/* ─── Mobile nav (md 미만) ─── */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <Link
              href="/login"
              className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
            >
              로그인
            </Link>
          )}
          {user && (
            <form action={logout}>
              <button className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                로그아웃
              </button>
            </form>
          )}
          <MobileMenu
            items={items}
            userName={name}
            isLoggedIn={!!user}
            isDemoMode={DEMO_MODE}
          />
        </div>
      </div>
    </nav>
  )
}
