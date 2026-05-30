import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { fetchMetrics } from '@/data/demo-metrics'

export const metadata = { title: '운영자 대시보드 · K-MOM' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 실제 DB 수치 (참고용) + 시현용 메트릭 함께 노출
  const [{ count: dbStudent }, { count: dbEmployer }, { count: dbReviews }, metrics] =
    await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      fetchMetrics(),
    ])

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            INVESTOR DEMO
          </p>
          <h1 className="mt-1 text-3xl font-bold">K-MOM 운영자 대시보드</h1>
          <p className="mt-1 text-sm text-zinc-500">
            맞춤 매칭 흐름의 전환 지표 — 시현용 더미 데이터 기준
          </p>
        </div>
        <Link
          href="/admin/requests"
          className="inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          업주 요청 관리 →
        </Link>
      </header>

      {/* 명세서의 7개 핵심 지표 */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-zinc-500">
          맞춤 매칭 전환 지표 (Investor KPI)
        </h2>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <MetricCard
            label="등록 유학생"
            value={metrics.registeredStudents}
            unit="명"
            tone="emerald"
          />
          <MetricCard
            label="조건 입력 업주"
            value={metrics.inquiredEmployers}
            unit="명"
            tone="sky"
          />
          <MetricCard
            label="후보 수 확인 완료"
            value={metrics.candidateCountConfirmedEmployers}
            unit="명"
            tone="sky"
          />
          <MetricCard
            label="1만 원 결제 업주"
            value={metrics.paidEmployers}
            unit="명"
            tone="violet"
            highlight
          />
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <MetricCard
            label="결제 전환율"
            value={metrics.conversionRatePct}
            unit="%"
            tone="violet"
            highlight
          />
          <MetricCard
            label="연락 요청 수"
            value={metrics.contactRequests}
            unit="건"
            tone="emerald"
          />
          <MetricCard
            label="후보 부족 대기 등록"
            value={metrics.waitlistedEmployers}
            unit="명"
            tone="amber"
          />
        </div>
      </section>

      {/* 깔때기 시각화 (간단) */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-zinc-500">전환 깔때기</h2>
        <div className="mt-3 space-y-2">
          <FunnelRow
            label="조건 입력"
            value={metrics.inquiredEmployers}
            base={metrics.inquiredEmployers}
            color="bg-sky-500"
          />
          <FunnelRow
            label="후보 수 확인 완료"
            value={metrics.candidateCountConfirmedEmployers}
            base={metrics.inquiredEmployers}
            color="bg-sky-600"
          />
          <FunnelRow
            label="1만 원 결제"
            value={metrics.paidEmployers}
            base={metrics.inquiredEmployers}
            color="bg-violet-500"
          />
          <FunnelRow
            label="연락 요청"
            value={metrics.contactRequests}
            base={metrics.inquiredEmployers}
            color="bg-emerald-500"
          />
        </div>
      </section>

      {/* 실제 DB 참고 */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-zinc-500">
          실제 Supabase 데이터 (참고 — 실제 운영 시 위 더미와 통합)
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <SmallStat label="DB 학생" value={dbStudent ?? 0} />
          <SmallStat label="DB 업주" value={dbEmployer ?? 0} />
          <SmallStat label="DB 평가" value={dbReviews ?? 0} />
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-zinc-400">
        * 위 메트릭은 src/data/demo-metrics.ts 의 더미 값입니다. 운영 시
        fetchMetrics()를 Supabase RPC로 교체하세요.
      </p>
    </main>
  )
}

function MetricCard({
  label,
  value,
  unit,
  tone,
  highlight = false,
}: {
  label: string
  value: number
  unit: string
  tone: 'emerald' | 'sky' | 'violet' | 'amber'
  highlight?: boolean
}) {
  const ring =
    tone === 'emerald'
      ? 'border-emerald-200 dark:border-emerald-900'
      : tone === 'sky'
        ? 'border-sky-200 dark:border-sky-900'
        : tone === 'violet'
          ? 'border-violet-200 dark:border-violet-900'
          : 'border-amber-200 dark:border-amber-900'
  const numColor =
    tone === 'emerald'
      ? 'text-emerald-700 dark:text-emerald-300'
      : tone === 'sky'
        ? 'text-sky-700 dark:text-sky-300'
        : tone === 'violet'
          ? 'text-violet-700 dark:text-violet-300'
          : 'text-amber-700 dark:text-amber-300'
  return (
    <div
      className={
        (highlight ? 'border-2 ' : 'border ') +
        ring +
        ' rounded-2xl bg-white p-5 dark:bg-zinc-900'
      }
    >
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${numColor}`}>
        {value.toLocaleString()}
        <span className="ml-1 text-sm font-medium text-zinc-500">{unit}</span>
      </p>
    </div>
  )
}

function FunnelRow({
  label,
  value,
  base,
  color,
}: {
  label: string
  value: number
  base: number
  color: string
}) {
  const pct = base > 0 ? Math.round((value / base) * 100) : 0
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-zinc-500">
          {value.toLocaleString()}명 · {pct}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
        {value.toLocaleString()}
      </p>
    </div>
  )
}
