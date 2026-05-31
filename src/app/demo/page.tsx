import Link from 'next/link'
import DemoPersonaCards from '@/components/DemoPersonaCards'

export const metadata = { title: '시연 모드 · K-MOM' }

export default function DemoPage() {
  return (
    <main className="flex-1">
      {/* 헤더 */}
      <header className="border-b border-zinc-200 bg-zinc-50 px-6 py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-sm text-zinc-500 hover:underline">
            ← 홈으로
          </Link>
          <h1 className="mt-3 text-3xl font-bold">🎬 K-MOM 시연 모드</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            투자자 시연을 위한 모든 페르소나·시나리오·관리자 화면을 한 곳에 모아둔
            페이지입니다. 일반 사용자는 이 페이지를 보지 않습니다.
          </p>
        </div>
      </header>

      {/* 페르소나 카드 6장 */}
      <DemoPersonaCards />

      {/* 추가 시연 자료 */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold">바로 가기</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            href="/employer/match"
            title="⚡ 맞춤 후보 흐름"
            desc="조건 → 후보 수 → 결제 → 카드 (시나리오 3종 노출)"
          />
          <QuickLink
            href="/admin/dashboard"
            title="📊 운영자 대시보드"
            desc="투자자 KPI 7종 + 깔때기"
          />
          <QuickLink
            href="/admin/requests"
            title="📋 업주 요청 관리"
            desc="LIVE + 시드 더미 30건 통합"
          />
          <QuickLink
            href="/pricing"
            title="💰 요금제"
            desc="Free / Contact Pack / Verified Partner"
          />
        </div>

        <h2 className="mt-10 text-xl font-bold">시연 계정 (비번 통일: kmom2026demo)</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  역할
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  이메일
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  설명
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <DemoAccountRow role="학생" email="kmom.student1@gmail.com" desc="완벽 프로필 + 평가 누적" />
              <DemoAccountRow role="학생" email="kmom.student2@gmail.com" desc="좋은 프로필" />
              <DemoAccountRow role="학생" email="kmom.student3@gmail.com" desc="평균 프로필" />
              <DemoAccountRow role="학생" email="kmom.student4@gmail.com" desc="부족 프로필" />
              <DemoAccountRow role="학생" email="kmom.student5@gmail.com" desc="빈 프로필 (TODO 시연)" />
              <DemoAccountRow role="업주" email="kmom.employer1@gmail.com" desc="🥇 GOLD · 평가 완료" />
              <DemoAccountRow role="업주" email="kmom.employer2@gmail.com" desc="🥈 SILVER · 진행 중" />
              <DemoAccountRow role="업주" email="kmom.employer3@gmail.com" desc="🥉 BRONZE · 신규" />
              <DemoAccountRow role="학교" email="kmom.school@gmail.com" desc="K-MOM 데모대학교 국제처" />
              <DemoAccountRow role="운영자" email="kmom.admin@gmail.com" desc="platform_admin" />
            </tbody>
          </table>
        </div>

        <p className="mt-6 rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          ⚠️ 시연 모드는 <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">NEXT_PUBLIC_DEMO_MODE</code> 환경변수로 전체 제어됩니다.
          운영 전환 시 Vercel env에 <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">false</code>로 설정하면
          모든 시연 요소(시나리오 카드, /demo 우회, 페르소나 카드)가 자동으로 숨겨집니다.
        </p>
      </section>
    </main>
  )
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs text-zinc-500">{desc}</p>
    </Link>
  )
}

function DemoAccountRow({
  role,
  email,
  desc,
}: {
  role: string
  email: string
  desc: string
}) {
  const chip =
    role === '학생'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
      : role === '업주'
        ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300'
        : role === '학교'
          ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300'
          : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
      <td className="px-3 py-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${chip}`}>
          {role}
        </span>
      </td>
      <td className="px-3 py-2 font-mono text-xs">{email}</td>
      <td className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">{desc}</td>
    </tr>
  )
}
