// 학교 → 학생 상세 페이지
// 현재 근무지 / 이력 타임라인 / 합법성 추적 / 알림
// 시연 모드: DEMO_STUDENTS 기반

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEMO_STUDENTS } from '@/data/demo-students'
import { DEMO_EMPLOYERS } from '@/data/demo-employers'

interface PageProps {
  params: Promise<{ id: string }>
}

// 데모 학생별 현재 근무 (대시보드와 공유 — 추후 lib로 분리)
const CURRENT_WORK: Record<string, { employerId: string; weeklyHours: number; startDate: string } | null> = {
  's-001': { employerId: 'e-001', weeklyHours: 10, startDate: '2024-06' },
  's-002': { employerId: 'e-010', weeklyHours: 12, startDate: '2024-04' },
  's-003': { employerId: 'e-012', weeklyHours: 15, startDate: '2024-05' },
  's-007': { employerId: 'e-007', weeklyHours: 28, startDate: '2024-03' },
  's-009': null,
  's-005': { employerId: 'e-005', weeklyHours: 9, startDate: '2024-07' },
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const student = DEMO_STUDENTS.find((s) => s.studentId === id)
  return {
    title: student ? `${student.name} · 학생 상세 · K-MOM` : '학생 상세',
  }
}

export default async function SchoolStudentDetailPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // school_admin 권한 확인
  const { data: row } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  const isSchoolOrAdmin = row?.role === 'school_admin' || row?.role === 'platform_admin'
  if (!isSchoolOrAdmin) redirect('/?notice=school_only')

  const student = DEMO_STUDENTS.find((s) => s.studentId === id)
  if (!student) notFound()

  const current = CURRENT_WORK[id]
  const currentEmp = current
    ? DEMO_EMPLOYERS.find((e) => e.companyId === current.employerId)
    : null
  const isOverLimit = current && current.weeklyHours > 25
  const isRisk = currentEmp?.riskFlag

  // 이력 정렬 (최신 먼저)
  const history = [...student.workHistory].sort((a, b) => {
    return (b.startDate ?? '').localeCompare(a.startDate ?? '')
  })

  // 합법성 체크리스트
  const compliance = [
    {
      label: '학교 인증',
      ok: student.schoolVerified,
      detail: student.schoolName,
    },
    {
      label: '비자',
      ok: student.visaType.startsWith('D-2'),
      detail: student.visaType,
    },
    {
      label: 'TOPIK',
      ok: student.topikLevel >= 4,
      detail: `${student.topikLevel}급 (${student.koreanLevel})`,
    },
    {
      label: '시간제취업 허가 경험',
      ok: student.partTimePermissionExperience,
      detail: student.partTimePermissionExperience ? '있음' : '없음 (신청 필요)',
    },
    {
      label: '주당 근무시간',
      ok: !isOverLimit,
      detail: current ? `주 ${current.weeklyHours}h` : '근무 없음',
    },
  ]
  const passed = compliance.filter((c) => c.ok).length

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <Link
        href="/school/dashboard"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← 학교 대시보드
      </Link>

      {/* 학생 헤더 */}
      <header className="mt-8">
        <p className="text-sm font-medium text-zinc-500">학생 모니터링</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
          {student.name}
        </h1>
        <p className="mt-2 text-zinc-500">
          {student.nationality} · {student.visaType} · TOPIK {student.topikLevel}급
          · {student.schoolName}
        </p>
      </header>

      {/* 알림 — 위에서 가장 먼저 보여줘야 함 */}
      {(isOverLimit || isRisk) && (
        <section className="mt-8 rounded-2xl border border-zinc-300 bg-zinc-50 p-6 ring-2 ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-700">
          <p className="text-sm font-medium text-zinc-500">알림</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight">
            확인이 필요합니다
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {isOverLimit && (
              <li>
                <strong className="font-medium">주당 시간 한도 초과</strong>{' '}
                — 현재 주 {current!.weeklyHours}h 근무 중 (D-2 학기중 한도 25h)
              </li>
            )}
            {isRisk && currentEmp && (
              <li>
                <strong className="font-medium">위험 업체에서 근무 중</strong> —{' '}
                {currentEmp.companyName} (임금 지연 신고 1건)
              </li>
            )}
          </ul>
        </section>
      )}

      {/* 현재 근무 */}
      <section className="mt-8 card-3d rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-500">현재 근무</p>
        {current && currentEmp ? (
          <>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {currentEmp.companyName}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {currentEmp.area} · {currentEmp.businessType}
              {currentEmp.certified && ' · K-MOM 인증 업체'}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
              <Metric label="시작일" value={current.startDate} />
              <Metric
                label="주당 시간"
                value={`${current.weeklyHours}h`}
                emphasize={isOverLimit ?? false}
              />
              <Metric
                label="누적 근무"
                value={`${student.totalWorkHours}h`}
              />
            </div>
          </>
        ) : (
          <p className="mt-2 text-zinc-500">현재 근무 없음 (대기 중)</p>
        )}
      </section>

      {/* 합법성 체크리스트 */}
      <section className="mt-6 card-3d rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-zinc-500">합법성 체크리스트</p>
          <p className="text-sm font-semibold tracking-tight">
            {passed} / {compliance.length} 통과
          </p>
        </div>
        <ul className="mt-6 space-y-3">
          {compliance.map((c) => (
            <li key={c.label} className="flex items-start justify-between gap-3 border-t border-zinc-100 pt-3 first:border-t-0 first:pt-0 dark:border-zinc-800">
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{c.detail}</p>
              </div>
              <span
                className={
                  c.ok
                    ? 'text-sm font-semibold text-zinc-900 dark:text-zinc-100'
                    : 'text-sm font-medium text-zinc-400'
                }
              >
                {c.ok ? '통과' : '확인 필요'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 학생 강점 + 평가 */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric label="신뢰도" value={student.reliabilityScore.toFixed(1)} suffix="/5" />
        <Metric
          label="업주 평가"
          value={`★ ${student.averageEmployerRating.toFixed(1)}`}
          suffix="/5"
        />
        <Metric label="재고용률" value={`${student.rehireRate}%`} />
      </section>

      {/* 근무 이력 타임라인 */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">근무 이력</h2>
        <p className="mt-2 text-sm text-zinc-500">최신순 · K-MOM 등록 기준</p>

        {history.length === 0 ? (
          <p className="mt-8 text-zinc-500">아직 등록된 이력이 없습니다.</p>
        ) : (
          <ol className="mt-8 space-y-4">
            {history.map((w) => (
              <li
                key={w.workId}
                className="card-3d rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold tracking-tight">
                      {w.companyName}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">{w.businessType}</p>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {w.startDate} ~ {w.endDate ?? '진행 중'}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Chip>{(w.workDays as readonly string[]).join('·')}</Chip>
                  <Chip>{w.timeSlot}</Chip>
                  {'hoursPerWeek' in w && typeof (w as { hoursPerWeek?: number }).hoursPerWeek === 'number' && (
                    <Chip>주 {(w as { hoursPerWeek: number }).hoursPerWeek}h</Chip>
                  )}
                  {'rating' in w && typeof (w as { rating?: number }).rating === 'number' && (
                    <Chip>★ {(w as { rating: number }).rating}</Chip>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        이 화면은 학생 동의 기반 모니터링 용도입니다.
        K-MOM은 학교가 학생을 직접 알선하지 않으며, 합법 시간제취업 확인을 보조합니다.
      </section>
    </main>
  )
}

function Metric({
  label,
  value,
  suffix,
  emphasize = false,
}: {
  label: string
  value: string
  suffix?: string
  emphasize?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p
        className={
          emphasize
            ? 'mt-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'
            : 'mt-1 text-xl font-semibold tracking-tight'
        }
      >
        {value}
        {suffix && (
          <span className="ml-1 text-xs font-medium text-zinc-500">{suffix}</span>
        )}
      </p>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
      {children}
    </span>
  )
}
