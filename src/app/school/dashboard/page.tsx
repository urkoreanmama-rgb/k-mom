// 학교 국제처 모니터링 대시보드
// 시연용: 데모 학생 카드 그리드 → 클릭하면 학생 상세 (이력 + 현재 근무 + 합법성)
// 실 운영: school_students 매핑 기반 (school_id 매칭)

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DEMO_STUDENTS } from '@/data/demo-students'
import { DEMO_EMPLOYERS } from '@/data/demo-employers'

export const metadata = { title: '학교 모니터링 대시보드 · K-MOM' }

type Filter = 'working' | 'overlimit' | 'risk' | 'idle' | null

export default async function SchoolDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const sp = await searchParams
  const filter: Filter =
    sp.filter === 'working' || sp.filter === 'overlimit' || sp.filter === 'risk' || sp.filter === 'idle'
      ? sp.filter
      : null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 학교 데모 계정이 Supabase에 없거나 RLS 차단되어도 시연 화면이 보이도록
  // user 없으면 그대로 데모 데이터 표시 (redirect 안 함)
  let schoolName: string | null = null
  let realStudentCount = 0
  if (user) {
    const { data: s } = await supabase
      .from('schools')
      .select('id, name')
      .eq('admin_user_id', user.id)
      .maybeSingle()
    if (s) {
      schoolName = s.name
      const { data: rows } = await supabase
        .from('school_students')
        .select('student_id')
        .eq('school_id', s.id)
      realStudentCount = rows?.length ?? 0
    }
  }

  // 실 데이터 5명 이상이면 실 데이터 모드 (아직 미구현 — 추후 확장)
  // 그 외에는 데모 학생 명단으로 시연
  const useDemoData = realStudentCount < 5

  // 시연용으로 12명 중 주요 6명 픽 (다양한 비자·언어·상태)
  const showcase = useDemoData
    ? ['s-001', 's-002', 's-003', 's-007', 's-009', 's-005']
        .map((id) => DEMO_STUDENTS.find((s) => s.studentId === id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s))
    : []

  // 각 학생별 현재 근무지 (DEMO_EMPLOYERS 매핑)
  const currentWork: Record<string, { employerId: string; weeklyHours: number } | null> = {
    's-001': { employerId: 'e-001', weeklyHours: 10 },   // 응우옌 티 화 — 쌀국수 호아 (대림)
    's-002': { employerId: 'e-010', weeklyHours: 12 },
    's-003': { employerId: 'e-012', weeklyHours: 15 },
    's-007': { employerId: 'e-007', weeklyHours: 28 },   // ⚠️ 시간 초과 위험
    's-009': null,                                       // 휴식 중
    's-005': { employerId: 'e-005', weeklyHours: 9 },    // ⚠️ 위험 업체
  }

  // KPI
  const total = showcase.length
  const working = Object.values(currentWork).filter(Boolean).length
  const overLimit = Object.entries(currentWork).filter(
    ([, w]) => w && w.weeklyHours > 25,
  ).length
  const riskEmployer = Object.entries(currentWork).filter(([, w]) => {
    if (!w) return false
    const emp = DEMO_EMPLOYERS.find((e) => e.companyId === w.employerId)
    return emp?.riskFlag
  }).length

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
      {/* 헤더 */}
      <header>
        <p className="text-sm font-medium text-zinc-500">학교 국제처</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
          {schoolName ?? 'K-MOM 데모대학교'}
        </h1>
        <p className="mt-3 text-zinc-500">
          재학 유학생의 합법 시간제취업 현황을 한눈에. 클릭하면 학생별 현재 근무·이력·위험 신호를 볼 수 있어요.
        </p>
      </header>

      {/* KPI 4개 카드 — 클릭하면 해당 학생만 필터링 */}
      <section className="mt-12 grid gap-4 sm:grid-cols-4">
        <Kpi
          label="모니터링 학생"
          value={total}
          suffix="명"
          href="/school/dashboard"
          active={!filter}
        />
        <Kpi
          label="현재 근무 중"
          value={working}
          suffix="명"
          href="/school/dashboard?filter=working"
          active={filter === 'working'}
        />
        <Kpi
          label="시간 한도 초과"
          value={overLimit}
          suffix="명"
          warn={overLimit > 0}
          href="/school/dashboard?filter=overlimit"
          active={filter === 'overlimit'}
        />
        <Kpi
          label="위험 업체 근무"
          value={riskEmployer}
          suffix="명"
          warn={riskEmployer > 0}
          href="/school/dashboard?filter=risk"
          active={filter === 'risk'}
        />
      </section>

      {/* 위험 알림 (있을 때만) */}
      {(overLimit > 0 || riskEmployer > 0) && (
        <section className="card-3d mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">알림</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight">
            확인이 필요한 학생 {overLimit + riskEmployer}명
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
            {Object.entries(currentWork).map(([sid, w]) => {
              if (!w) return null
              const student = showcase.find((s) => s.studentId === sid)
              if (!student) return null
              const emp = DEMO_EMPLOYERS.find((e) => e.companyId === w.employerId)
              const alerts: string[] = []
              if (w.weeklyHours > 25) {
                alerts.push(`주 ${w.weeklyHours}h 근무 — D-2 학기중 한도(25h) 초과`)
              }
              if (emp?.riskFlag) {
                alerts.push(`${emp.companyName} — 위험 업체 (임금 지연 신고)`)
              }
              if (alerts.length === 0) return null
              return (
                <li key={sid} className="flex flex-wrap items-start gap-2">
                  <Link
                    href={`/school/students/${sid}`}
                    className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                  >
                    {student.name}
                  </Link>
                  <span>—</span>
                  <span>{alerts.join(' · ')}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* 학생 카드 그리드 — 필터 적용 */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {filter === 'working' && '현재 근무 중인 학생'}
              {filter === 'overlimit' && '시간 한도 초과 학생'}
              {filter === 'risk' && '위험 업체에서 근무 중'}
              {filter === 'idle' && '대기 중인 학생'}
              {!filter && '재학 유학생'}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              학생 동의 기반 모니터링 · K-MOM 등록 근무 이력 기준
            </p>
          </div>
          {filter && (
            <Link
              href="/school/dashboard"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ← 전체 보기
            </Link>
          )}
        </div>
        {showcase.filter((s) => {
          const w = currentWork[s.studentId]
          const emp = w ? DEMO_EMPLOYERS.find((e) => e.companyId === w.employerId) : null
          if (filter === 'working') return Boolean(w)
          if (filter === 'overlimit') return w && w.weeklyHours > 25
          if (filter === 'risk') return Boolean(emp?.riskFlag)
          if (filter === 'idle') return !w
          return true
        }).length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
            해당하는 학생이 없습니다.
          </div>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showcase
            .filter((s) => {
              const w = currentWork[s.studentId]
              const emp = w ? DEMO_EMPLOYERS.find((e) => e.companyId === w.employerId) : null
              if (filter === 'working') return Boolean(w)
              if (filter === 'overlimit') return w && w.weeklyHours > 25
              if (filter === 'risk') return Boolean(emp?.riskFlag)
              if (filter === 'idle') return !w
              return true
            })
            .map((s) => {
            const w = currentWork[s.studentId]
            const emp = w ? DEMO_EMPLOYERS.find((e) => e.companyId === w.employerId) : null
            const isOverLimit = w && w.weeklyHours > 25
            const isRisk = emp?.riskFlag
            const hasAlert = isOverLimit || isRisk
            return (
              <Link
                key={s.studentId}
                href={`/school/students/${s.studentId}`}
                className="card-3d block rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* 이름 + 상태 */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold tracking-tight">
                      {s.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {s.nationality} · {s.visaType} · TOPIK {s.topikLevel}
                    </p>
                  </div>
                  {hasAlert ? (
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white dark:bg-zinc-100 dark:text-zinc-900">
                      알림
                    </span>
                  ) : w ? (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                      근무중
                    </span>
                  ) : (
                    <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900">
                      대기
                    </span>
                  )}
                </div>

                {/* 현재 근무 */}
                <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                    현재 근무
                  </p>
                  {w && emp ? (
                    <>
                      <p className="mt-1 text-sm font-medium">{emp.companyName}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {emp.area} · {emp.businessType} · 주 {w.weeklyHours}h
                        {isOverLimit && (
                          <span className="ml-1 font-medium text-zinc-900 dark:text-zinc-100">
                            · 한도 초과
                          </span>
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-400">근무 이력 없음</p>
                  )}
                </div>

                {/* 누적 지표 */}
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <Stat label="누적" value={`${s.totalWorkHours}h`} />
                  <Stat label="평점" value={`★ ${s.averageEmployerRating.toFixed(1)}`} />
                  <Stat label="재고용" value={`${s.rehireRate}%`} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        K-MOM은 학교가 학생의 시간제취업을 직접 알선하는 서비스가 아닙니다.
        학생과 업체의 신뢰 이력을 기반으로 학생의 교외 근무 현황을 확인하고
        위험 신호를 파악할 수 있도록 돕는 모니터링 도구입니다.
        최종 허가와 판단은 학교와 출입국 기준에 따릅니다.
      </section>
    </main>
  )
}

function Kpi({
  label,
  value,
  suffix,
  warn = false,
  href,
  active = false,
}: {
  label: string
  value: number
  suffix?: string
  warn?: boolean
  href?: string
  active?: boolean
}) {
  const base =
    'card-3d block rounded-2xl border bg-white p-6 dark:bg-zinc-900'
  const stateClass = active
    ? 'border-zinc-900 ring-2 ring-zinc-300 dark:border-zinc-100 dark:ring-zinc-700'
    : warn
      ? 'border-zinc-300 ring-2 ring-zinc-200 dark:border-zinc-700 dark:ring-zinc-700'
      : 'border-zinc-200 dark:border-zinc-800'

  const content = (
    <>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-medium text-zinc-500">{suffix}</span>
        )}
      </p>
      {href && (
        <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
          {active ? '· 활성 ·' : '클릭해서 보기 →'}
        </p>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`${base} ${stateClass}`}>
        {content}
      </Link>
    )
  }
  return <div className={`${base} ${stateClass}`}>{content}</div>
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tracking-tight">{value}</p>
    </div>
  )
}
