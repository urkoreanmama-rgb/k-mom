import Link from 'next/link'
import { DEMO_METRICS } from '@/data/demo-metrics'

export const metadata = { title: '투자자 대시보드 · K-MOM' }

export default function InvestorDashboardPage() {
  const m = DEMO_METRICS

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* ── Header ── */}
      <section className="mb-12 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex h-7 items-center rounded-full bg-violet-100 px-3 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            INVESTOR DEMO · Phase 1 MVP
          </span>
          <span className="inline-flex h-7 items-center rounded-full bg-zinc-100 px-3 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            벤치마킹: Instawork + Interstride + Handshake
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          K-MOM
        </h1>
        <p className="mt-3 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          외국인 유학생 시간제취업 신뢰 플랫폼
        </p>
        <p className="mt-3 max-w-3xl mx-auto text-base text-zinc-500 dark:text-zinc-400">
          학생은 안전한 일자리를 찾고, 업주는 검증된 학생을 만나고, 학교는 교외 근무 현황을 확인합니다.
        </p>
      </section>

      {/* ── KPI 카드 ── */}
      <section className="mb-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
          핵심 지표 (Phase 1 MVP)
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <KpiCard icon="🎓" value={m.registeredStudents} unit="명" label="등록 유학생 수" tone="sky" />
          <KpiCard icon="🏪" value={m.registeredCompanies} unit="곳" label="등록 업체 수" tone="emerald" />
          <KpiCard icon="✅" value={m.certifiedCompanies} unit="곳" label="K-MOM 인증 업체" tone="emerald" verified />
          <KpiCard icon="⭐" value={m.totalReviews} unit="건" label="쌍방향 평가 누적" tone="amber" />
          <KpiCard icon="🏫" value={m.professorRecommendedStudents} unit="명" label="교수 추천 학생 수" tone="violet" />
          <KpiCard icon="🔍" value={m.candidateMatchRequests} unit="건" label="조건맞춤 후보 요청" tone="sky" />
          <KpiCard icon="💳" value={m.previewPayments} unit="건" label="후보 미리보기 결제" tone="emerald" />
          <KpiCard icon="⭐" value={m.studentSatisfaction} unit="점" label="학생 만족도" tone="amber" decimal />
          <KpiCard icon="🏆" value={m.companyTrustAverage} unit="점" label="업체 신뢰도 평균" tone="emerald" decimal />
        </div>
      </section>

      {/* ── 플랫폼 가치 3단계 ── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6">K-MOM이 해결하는 것</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ValueCard
            icon="🎓"
            title="학생"
            headline="안전한 일자리를 찾는다"
            items={['신뢰 프로필 누적', '알바 이력 = 경력 자산', '교수 추천 배지']}
            tone="sky"
          />
          <ValueCard
            icon="🏪"
            title="업주"
            headline="검증된 학생을 만난다"
            items={['비자/학교/평점 확인', '1만원 미리보기 결제', '서류 위반 리스크 감소']}
            tone="emerald"
          />
          <ValueCard
            icon="🏫"
            title="학교"
            headline="교외 근무를 모니터링한다"
            items={['K-MOM 인증 업체 목록', '위험 신호 알림', '익명 리포트 접수']}
            tone="violet"
          />
        </div>
      </section>

      {/* ── 벤치마킹 ── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6">해외 플랫폼 벤치마킹</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: 'Instawork', desc: '쌍방향 평가 + 신뢰 기반 매칭', emoji: '🤝' },
            { name: 'Interstride', desc: '국제학생 비자 취업 지원', emoji: '🌍' },
            { name: 'Linzara', desc: '비자 친화적 후보 프로필', emoji: '📋' },
            { name: 'Handshake', desc: '학교 기반 학생·업주 연결', emoji: '🏫' },
            { name: 'Uber', desc: '상호 평가가 다음 매칭에 반영', emoji: '🚗' },
            { name: 'Glassdoor', desc: '업체 근무환경 사전 확인', emoji: '🔍' },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.emoji}</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 핵심 차별화 ── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6">K-MOM만의 것</h2>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-800 dark:bg-violet-900/10 space-y-4">
          {[
            { n: 1, text: 'D-2 비자 시간제취업 합법 체크리스트 내장' },
            { n: 2, text: '쌍방향 신뢰 점수가 다음 매칭 품질을 높임' },
            { n: 3, text: '좋은 업체는 인증 받고 좋은 학생에게 먼저 노출' },
            { n: 4, text: '이 신뢰 데이터가 시간이 지날수록 K-MOM의 핵심 자산' },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                {item.n}
              </span>
              <p className="pt-1 text-sm font-medium text-violet-900 dark:text-violet-200">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section>
        <h2 className="text-2xl font-bold mb-6">페이지 바로가기</h2>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/students" label="학생 프로필 보기 →" tone="sky" />
          <QuickLink href="/employers" label="업체 프로필 보기 →" tone="emerald" />
          <QuickLink href="/reviews" label="쌍방향 평가 보기 →" tone="amber" />
          <QuickLink href="/school/dashboard" label="학교 모니터링 →" tone="violet" />
          <QuickLink href="/admin/dashboard" label="관리자 대시보드 →" tone="zinc" />
        </div>
      </section>
    </main>
  )
}

function KpiCard({
  icon,
  value,
  unit,
  label,
  tone,
  verified = false,
  decimal = false,
}: {
  icon: string
  value: number
  unit: string
  label: string
  tone: 'sky' | 'emerald' | 'amber' | 'violet'
  verified?: boolean
  decimal?: boolean
}) {
  const border =
    tone === 'sky'
      ? 'border-sky-200 dark:border-sky-800'
      : tone === 'emerald'
        ? 'border-emerald-200 dark:border-emerald-800'
        : tone === 'amber'
          ? 'border-amber-200 dark:border-amber-800'
          : 'border-violet-200 dark:border-violet-800'

  const numColor =
    tone === 'sky'
      ? 'text-sky-700 dark:text-sky-300'
      : tone === 'emerald'
        ? 'text-emerald-700 dark:text-emerald-300'
        : tone === 'amber'
          ? 'text-amber-700 dark:text-amber-300'
          : 'text-violet-700 dark:text-violet-300'

  const bg =
    tone === 'sky'
      ? 'bg-sky-50 dark:bg-sky-900/10'
      : tone === 'emerald'
        ? 'bg-emerald-50 dark:bg-emerald-900/10'
        : tone === 'amber'
          ? 'bg-amber-50 dark:bg-amber-900/10'
          : 'bg-violet-50 dark:bg-violet-900/10'

  const displayValue = decimal ? value.toFixed(1) : value.toLocaleString()

  return (
    <div className={`rounded-2xl border ${border} ${bg} p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        {verified && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ 인증</span>
        )}
      </div>
      <p className={`text-4xl font-bold ${numColor}`}>
        {displayValue}
        <span className="ml-1 text-base font-medium text-zinc-500">{unit}</span>
      </p>
      <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
    </div>
  )
}

function ValueCard({
  icon,
  title,
  headline,
  items,
  tone,
}: {
  icon: string
  title: string
  headline: string
  items: string[]
  tone: 'sky' | 'emerald' | 'violet'
}) {
  const accent =
    tone === 'sky'
      ? 'text-sky-700 dark:text-sky-300'
      : tone === 'emerald'
        ? 'text-emerald-700 dark:text-emerald-300'
        : 'text-violet-700 dark:text-violet-300'

  const border =
    tone === 'sky'
      ? 'border-sky-200 dark:border-sky-800'
      : tone === 'emerald'
        ? 'border-emerald-200 dark:border-emerald-800'
        : 'border-violet-200 dark:border-violet-800'

  return (
    <div className={`rounded-2xl border ${border} bg-white p-6 dark:bg-zinc-900`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-lg font-bold ${accent}`}>{title}</span>
      </div>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{headline}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className={accent + ' shrink-0'}>✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function QuickLink({
  href,
  label,
  tone,
}: {
  href: string
  label: string
  tone: 'sky' | 'emerald' | 'amber' | 'violet' | 'zinc'
}) {
  const styles: Record<string, string> = {
    sky: 'bg-sky-600 hover:bg-sky-700 text-white',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    amber: 'bg-amber-500 hover:bg-amber-600 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
    zinc: 'bg-zinc-700 hover:bg-zinc-800 text-white dark:bg-zinc-600 dark:hover:bg-zinc-500',
  }

  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold transition ${styles[tone]}`}
    >
      {label}
    </Link>
  )
}
