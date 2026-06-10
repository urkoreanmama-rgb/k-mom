// 🎬 시연 모드 — 운영자 전용
// 학생·업주·학교·관리자 4개 역할 버튼만 노출.
// 클릭 → 해당 역할 데모 계정 자동 로그인 + 그 역할 화면 진입.

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
  description: string
  highlight: string // 이 역할 화면에서 보여줄 핵심
  tone: 'emerald' | 'sky' | 'violet' | 'amber'
}

const ROLE_CARDS: RoleCard[] = [
  {
    emoji: '👨‍🎓',
    role: '학생',
    email: 'kmom.student1@gmail.com',
    dest: '/student/profile',
    description: '응우옌 티 화 — 베트남 D-2 유학생',
    highlight: '합법성 점수·내 프로필 미리보기·이력서 양식·업주 둘러보기·알바 이력',
    tone: 'emerald',
  },
  {
    emoji: '🏪',
    role: '업주',
    email: 'kmom.employer3@gmail.com',
    dest: '/employer/match',
    description: '이수정 — 카페 글로우 홍대 사장',
    highlight: '⚡ 맞춤 후보 찾기 (조건→후보수→1만원 결제→후보3명)·받은 이력서',
    tone: 'sky',
  },
  {
    emoji: '🏫',
    role: '학교',
    email: 'kmom.school@gmail.com',
    dest: '/school/dashboard',
    description: '정수민 — K-MOM 데모대학교 국제처',
    highlight: '학생 모니터링·서류 제출 현황·익명 위험 요약 + 정식 MOU 권한 명단',
    tone: 'violet',
  },
  {
    emoji: '🛡️',
    role: '관리자',
    email: 'kmom.admin@gmail.com',
    dest: '/admin/dashboard',
    description: 'K-MOM 플랫폼 운영자',
    highlight: 'KPI 15종 + 전환 깔때기 + DB 다운로드 + 업주 요청 관리',
    tone: 'amber',
  },
]

const TONE_MAP: Record<RoleCard['tone'], { border: string; bg: string; chip: string; btn: string }> = {
  emerald: {
    border: 'border-emerald-300 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    chip: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200',
    btn: 'bg-emerald-600 hover:bg-emerald-700',
  },
  sky: {
    border: 'border-sky-300 dark:border-sky-800',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    chip: 'bg-sky-200 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200',
    btn: 'bg-sky-600 hover:bg-sky-700',
  },
  violet: {
    border: 'border-violet-300 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    chip: 'bg-violet-200 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200',
    btn: 'bg-violet-600 hover:bg-violet-700',
  },
  amber: {
    border: 'border-amber-300 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    chip: 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200',
    btn: 'bg-amber-600 hover:bg-amber-700',
  },
}

export default async function DemoPage() {
  // 관리자(platform_admin)만 접근. 비관리자/비로그인은 리다이렉트
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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link href="/admin/dashboard" className="text-sm text-zinc-500 hover:underline">
        ← 운영자 대시보드로
      </Link>

      <header className="mt-4 text-center">
        <span className="inline-block rounded-full bg-zinc-900 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-zinc-900">
          🎬 시연 모드 · 운영자 전용
        </span>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold">
          어떤 역할의 입장에서 둘러볼까요?
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          버튼 하나를 클릭하면 그 역할 데모 계정으로 자동 로그인되어 해당 화면이 열립니다.
        </p>
      </header>

      {/* 4개 역할 버튼 */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {ROLE_CARDS.map((card) => {
          const t = TONE_MAP[card.tone]
          return (
            <form
              key={card.role}
              action={loginAsDemoAccount}
              className={`flex flex-col rounded-2xl border-2 p-5 ${t.border} ${t.bg}`}
            >
              <input type="hidden" name="email" value={card.email} />
              <input type="hidden" name="dest" value={card.dest} />

              <div className="flex items-center gap-3">
                <span className="text-5xl">{card.emoji}</span>
                <div>
                  <p className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${t.chip}`}>
                    {card.role}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{card.description}</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold">시연 화면:</span> {card.highlight}
              </p>

              <button
                type="submit"
                className={`mt-auto h-12 rounded-lg px-4 text-sm font-bold text-white ${t.btn}`}
              >
                {card.role} 입장에서 보기 →
              </button>
            </form>
          )
        })}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        ※ 클릭 시 자동으로 그 역할의 메인 화면으로 이동합니다. 다른 역할을 보려면 우상단 로그아웃 후
        다시 이 페이지로 돌아오세요.
      </p>
    </main>
  )
}
