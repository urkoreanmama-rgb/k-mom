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

      {/* K-MOM의 핵심 차별화 — 시연 시작 전에 가장 먼저 보여야 함 */}
      <section className="mt-8 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-sky-50 p-6 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-sky-950/30">
        <div className="text-center">
          <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            K-MOM 핵심 차별화
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl font-bold">
            인증 배지는 매칭 데이터의 <span className="text-emerald-600 dark:text-emerald-400">부산물</span>입니다
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            학생이 먼저 지원하고 싶은 업체가 자동으로 위로 올라옵니다
          </p>
        </div>

        {/* 비교표 */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              일반 알바앱
            </p>
            <p className="mt-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
              💸 광고비 = 상위 노출
            </p>
            <ul className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li>· 돈 많이 쓴 업체가 위로</li>
              <li>· 학생은 신뢰 못함 → 신중하게 안 봄</li>
              <li>· 채용 성공률 보통</li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-emerald-400 bg-white p-4 dark:border-emerald-700 dark:bg-zinc-900">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              K-MOM
            </p>
            <p className="mt-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              ⭐ 학생 평가 = 상위 노출
            </p>
            <ul className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li>· 학생이 잘했다 한 곳이 위로</li>
              <li>· GOLD 인증 = 학생이 먼저 지원</li>
              <li>· 채용 성공률 ↑ 신뢰 자산 누적</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          GOLD 🥇 = 20건+ 평균 4.5↑ · SILVER 🥈 = 5건+ 평균 4.0↑ ·
          자동 산정 (Postgres 트리거)
        </p>
      </section>

      {/* 💼 K-MOM 수익 구조 — 4개 채널 BM 구조 */}
      <section className="mt-6 rounded-2xl border-2 border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <span className="inline-block rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white dark:bg-zinc-100 dark:text-zinc-900">
            💼 K-MOM 수익 구조
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl font-bold">
            업주 결제는 두 축으로 — <span className="text-emerald-600">언어 인재 + 스태프 안정</span>
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            "외국인 채용비" 가 아니라 "내가 필요한 언어 인재 열람비". 가게가 직결된다.
          </p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {/* 학생 */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
              👨‍🎓 학생 (항상 무료)
            </p>
            <ul className="mt-2 space-y-1 text-xs text-emerald-900 dark:text-emerald-200">
              <li>· 비자체커 (가입 깔때기)</li>
              <li>· 신뢰 프로필 등록</li>
              <li>· 재직 중 이력 누적</li>
              <li>· 졸업 후 커리어 프로필 전환</li>
            </ul>
          </div>

          {/* 업주 */}
          <div className="rounded-xl border-2 border-sky-400 bg-sky-50 p-4 dark:border-sky-700 dark:bg-sky-950/30">
            <p className="text-xs font-bold uppercase text-sky-700 dark:text-sky-300">
              🏪 업주 (두 가지 결제)
            </p>
            <div className="mt-2 space-y-2 text-xs">
              <div>
                <p className="font-bold text-sky-900 dark:text-sky-200">
                  🌏 언어 매칭팩 9,900원/언어
                </p>
                <p className="text-sky-800 dark:text-sky-300">
                  🇨🇳 중국어·🇻🇳 베트남어·🇺🇸 영어... 가게 컨텍스트로 직결
                </p>
              </div>
              <div>
                <p className="font-bold text-sky-900 dark:text-sky-200">
                  🛡️ 스태프 안정 구독 49,000원/월
                </p>
                <p className="text-sky-800 dark:text-sky-300">
                  비자 D-30 알림·주 25h 사전 경고·졸업 D-60 후임 알림 →
                  "갑자기 사람 없어지는 상황 예방"
                </p>
              </div>
            </div>
          </div>

          {/* 학교 */}
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900/50 dark:bg-violet-950/20">
            <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-400">
              🏫 학교 국제처 (B2B 구독)
            </p>
            <ul className="mt-2 space-y-1 text-xs text-violet-900 dark:text-violet-200">
              <li>· 대시보드 학기당 협의</li>
              <li>· 학생 교외 근무 현황 모니터링</li>
              <li>· 위험 업체 알림</li>
            </ul>
          </div>

          {/* 기업 v4.0 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400">
              🏢 기업 채용팀 (v4.0)
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-900 dark:text-amber-200">
              <li>· 졸업생 커리어 프로필 열람권</li>
              <li>· 알바 이력 + 평가 + 언어 능력 패키지</li>
              <li>· 진짜 B2B 매출의 시작점</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-[11px] text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
          <strong>업주 결제 재정의 핵심:</strong> "Contact Pack"을 "🌏 언어 매칭팩"으로 바꾸니
          업주가 가게 컨텍스트로 직결돼서 9,900원이 합리적으로 느껴진다.
          "컴플라이언스 구독"을 "🛡️ 스태프 안정 구독"으로 바꾸니
          법무 부담이 아니라 "사람 안 끊기는 안전망"이 돼서 49,000원이 보험으로 보인다.
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {ROLE_CARDS.map((card) => {
          const t = TONE_MAP[card.tone]
          const isStudent = card.role === '학생'

          return (
            <div
              key={card.role}
              className={`rounded-2xl border-2 p-8 text-center transition ${t.wrap}`}
            >
              <div className="text-6xl">{card.emoji}</div>
              <h2 className="mt-4 text-2xl font-bold">{card.role}</h2>

              {/* 학생 카드만 2개 버튼 (여정 보기 + 현재 상태) */}
              {isStudent ? (
                <div className="mt-6 space-y-2">
                  <Link
                    href="/demo/student-journey"
                    className={`inline-flex h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-bold text-white ${t.btn}`}
                  >
                    🗺️ 학생의 여정 보기 (4단계)
                  </Link>
                  <form action={loginAsDemoAccount}>
                    <input type="hidden" name="email" value={card.email} />
                    <input type="hidden" name="dest" value={card.dest} />
                    <button
                      type="submit"
                      className="inline-flex h-11 w-full items-center justify-center rounded-lg border-2 border-emerald-600 bg-white px-4 text-sm font-bold text-emerald-700 hover:bg-emerald-50 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-zinc-800"
                    >
                      📋 학생의 현재 상태 보기 →
                    </button>
                  </form>
                </div>
              ) : (
                <form action={loginAsDemoAccount}>
                  <input type="hidden" name="email" value={card.email} />
                  <input type="hidden" name="dest" value={card.dest} />
                  <button
                    type="submit"
                    className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg px-5 text-base font-bold text-white ${t.btn}`}
                  >
                    {card.role} 화면 보기 →
                  </button>
                </form>
              )}
            </div>
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
