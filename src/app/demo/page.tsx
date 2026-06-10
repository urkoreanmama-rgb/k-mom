// 🎬 시연 모드 — 운영자 전용
// 학생·업주·학교·관리자 4개 버튼만 깔끔하게.
// 클릭 → 자동 로그인 → 그 역할 화면으로 즉시 이동 (이미 로그인된 상태로 진입).

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginAsDemoAccount } from '@/app/actions/auth'

export const metadata = { title: '시연 모드 · K-MOM' }

interface RoleCard {
  emoji: string
  role: string
  email: string
  dest: string
  tone: 'emerald' | 'sky' | 'violet' | 'amber'
}

const ROLE_CARDS: RoleCard[] = [
  {
    emoji: '👨‍🎓',
    role: '학생',
    email: 'kmom.student1@gmail.com',
    dest: '/student/profile',
    tone: 'emerald',
  },
  {
    emoji: '🏪',
    role: '업주',
    email: 'kmom.employer3@gmail.com',
    dest: '/employer/match',
    tone: 'sky',
  },
  {
    emoji: '🏫',
    role: '학교',
    email: 'kmom.school@gmail.com',
    dest: '/school/dashboard',
    tone: 'violet',
  },
  {
    emoji: '🛡️',
    role: '관리자',
    email: 'kmom.admin@gmail.com',
    dest: '/admin/dashboard',
    tone: 'amber',
  },
]

const TONE_MAP: Record<RoleCard['tone'], { wrap: string; btn: string }> = {
  emerald: {
    wrap: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50',
    btn: 'bg-emerald-600 hover:bg-emerald-700',
  },
  sky: {
    wrap: 'border-sky-300 bg-sky-50 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/30 dark:hover:bg-sky-950/50',
    btn: 'bg-sky-600 hover:bg-sky-700',
  },
  violet: {
    wrap: 'border-violet-300 bg-violet-50 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:hover:bg-violet-950/50',
    btn: 'bg-violet-600 hover:bg-violet-700',
  },
  amber: {
    wrap: 'border-amber-300 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:hover:bg-amber-950/50',
    btn: 'bg-amber-600 hover:bg-amber-700',
  },
}

export default async function DemoPage() {
  // 운영자(platform_admin)만 접근
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/demo')
  }

  const { data: row } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (row?.role !== 'platform_admin') {
    redirect('/?notice=demo_admin_only')
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">🎬 시연 모드</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          버튼을 클릭하면 그 역할로 자동 로그인되어 해당 화면이 열립니다.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ROLE_CARDS.map((card) => {
          const t = TONE_MAP[card.tone]
          return (
            <form
              key={card.role}
              action={loginAsDemoAccount}
              className={`rounded-2xl border-2 p-8 text-center transition ${t.wrap}`}
            >
              <input type="hidden" name="email" value={card.email} />
              <input type="hidden" name="dest" value={card.dest} />

              <div className="text-6xl">{card.emoji}</div>
              <h2 className="mt-4 text-2xl font-bold">{card.role}</h2>

              <button
                type="submit"
                className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg px-5 text-base font-bold text-white ${t.btn}`}
              >
                {card.role} 화면 보기 →
              </button>
            </form>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/admin/dashboard"
          className="text-sm text-zinc-500 hover:underline"
        >
          ← 관리자 대시보드로 돌아가기
        </Link>
      </div>
    </main>
  )
}
