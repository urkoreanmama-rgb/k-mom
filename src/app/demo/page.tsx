// 시연 모드 — 운영자 전용
// Apple-inspired: 흰/검/회 + 단일 액센트, 그라데이션 없음

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginAsDemoAccount } from '@/app/actions/auth'

export const metadata = { title: '시연 모드 · K-MOM' }

interface RoleCard {
  role: string
  email: string
  dest: string
  desc: string
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: '학생',
    email: 'kmom.student1@gmail.com',
    dest: '/student/profile',
    desc: '응우옌 티 화의 프로필 화면',
  },
  {
    role: '업주',
    email: 'kmom.employer3@gmail.com',
    dest: '/employer/match',
    desc: '이수정의 매칭 요청 화면',
  },
  {
    role: '학교',
    email: 'kmom.school@gmail.com',
    dest: '/school/dashboard',
    desc: '국제처 모니터링 대시보드',
  },
  {
    role: '관리자',
    email: 'kmom.admin@gmail.com',
    dest: '/admin/dashboard',
    desc: '운영자 대시보드',
  },
]

export default async function DemoPage() {
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
    <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
      {/* 헤더 */}
      <header className="text-center">
        <p className="text-sm font-medium text-zinc-500">시연 모드</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
          역할별로 둘러보세요.
        </h1>
        <p className="mt-4 text-zinc-500">
          버튼을 누르면 그 역할로 자동 로그인되어 해당 화면이 열립니다.
        </p>
      </header>

      {/* K-MOM 차별화 — 단색, 비교만 */}
      <section className="mt-20 rounded-2xl border border-zinc-200 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-500">K-MOM 차별화</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          학생이 검증한 가게가 자동으로 위로 올라옵니다.
        </h2>
        <p className="mt-3 text-zinc-500">
          광고비가 아니라 학생들의 실제 평가 누적으로 인증 등급이 정해집니다.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="card-3d rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              일반 알바앱
            </p>
            <p className="mt-3 text-base font-medium">광고비 = 상위 노출</p>
            <ul className="mt-3 space-y-1.5 text-sm text-zinc-500">
              <li>— 돈 많이 쓴 업체가 위로</li>
              <li>— 학생 신뢰 X</li>
              <li>— 채용 성공률 보통</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-900 p-6 dark:border-zinc-100 dark:bg-zinc-100">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
              K-MOM
            </p>
            <p className="mt-3 text-base font-medium">학생 평가 = 상위 노출</p>
            <ul className="mt-3 space-y-1.5 text-sm text-zinc-300 dark:text-zinc-600">
              <li>— 학생이 잘했다 한 곳이 위로</li>
              <li>— GOLD 인증 = 학생이 먼저 지원</li>
              <li>— 채용 성공률 ↑ 신뢰 자산 누적</li>
            </ul>
          </div>
        </div>
      </section>

      {/* K-MOM 수익 구조 — 단색 정돈 */}
      <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-500">수익 구조</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          업주는 두 축으로 결제합니다.
        </h2>
        <p className="mt-3 text-zinc-500">
          "외국인 채용비"가 아니라 "내가 필요한 언어 인재 열람비".
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <BMSection
            label="학생"
            sub="항상 무료"
            items={[
              '비자체커',
              '신뢰 프로필 등록',
              '재직 중 이력 누적',
              '졸업 후 커리어 프로필 전환',
            ]}
            loginEmail="kmom.student1@gmail.com"
            dest="/student/profile"
          />
          <BMSection
            label="업주"
            sub="두 가지 결제"
            items={[
              '언어 매칭팩 9,900원 / 언어',
              '스태프 안정 구독 49,000원 / 월',
              '비자 D-30 · 주 25h · 졸업 D-60 알림',
            ]}
            loginEmail="kmom.employer3@gmail.com"
            dest="/employer/match"
            emphasis
          />
          <BMSection
            label="학교 국제처"
            sub="B2B 구독"
            items={[
              '대시보드 학기당 협의',
              '교외 근무 현황 모니터링',
              '위험 업체 알림',
            ]}
            loginEmail="kmom.school@gmail.com"
            dest="/school/dashboard"
          />
          <BMSection
            label="기업 채용팀"
            sub="v4.0"
            items={[
              '졸업생 커리어 프로필 열람권',
              '알바 이력 + 평가 + 언어 능력',
              '진짜 B2B 매출의 시작점',
            ]}
            href="/demo/enterprise"
          />
        </div>
      </section>

      {/* 4개 역할 카드 — 동일 색·동일 톤 */}
      <section className="mt-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {ROLE_CARDS.map((card) => {
            const isStudent = card.role === '학생'
            return (
              <div
                key={card.role}
                className="card-3d rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-sm font-medium text-zinc-500">{card.desc}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{card.role}</h2>

                {isStudent ? (
                  <div className="mt-6 space-y-2">
                    <Link
                      href="/demo/student-journey"
                      className="btn-3d inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium"
                    >
                      학생의 여정 보기 (4단계)
                    </Link>
                    <form action={loginAsDemoAccount}>
                      <input type="hidden" name="email" value={card.email} />
                      <input type="hidden" name="dest" value={card.dest} />
                      <button
                        type="submit"
                        className="btn-3d inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium"
                      >
                        학생의 현재 상태 보기
                      </button>
                    </form>
                  </div>
                ) : (
                  <form action={loginAsDemoAccount}>
                    <input type="hidden" name="email" value={card.email} />
                    <input type="hidden" name="dest" value={card.dest} />
                    <button
                      type="submit"
                      className="btn-3d mt-6 inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium"
                    >
                      {card.role} 화면 보기 →
                    </button>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-16 text-center">
        <Link
          href="/admin/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← 관리자 대시보드로 돌아가기
        </Link>
      </div>
    </main>
  )
}

function BMSection({
  label,
  sub,
  items,
  emphasis = false,
  loginEmail,
  dest,
  href,
}: {
  label: string
  sub: string
  items: string[]
  emphasis?: boolean
  loginEmail?: string
  dest?: string
  href?: string
}) {
  const cls = emphasis
    ? 'card-3d block w-full text-left rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900'
    : 'card-3d block w-full text-left rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950'

  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{sub}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="text-zinc-400">—</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
        클릭해서 화면 보기 →
      </p>
    </>
  )

  // 데모 계정 자동 로그인
  if (loginEmail && dest) {
    return (
      <form action={loginAsDemoAccount}>
        <input type="hidden" name="email" value={loginEmail} />
        <input type="hidden" name="dest" value={dest} />
        <button type="submit" className={cls}>
          {content}
        </button>
      </form>
    )
  }

  // 내부 링크 (예: /demo/enterprise)
  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    )
  }

  return <div className={cls}>{content}</div>
}
