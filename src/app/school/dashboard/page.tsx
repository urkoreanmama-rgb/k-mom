import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SchoolDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 자기 학교 조회 (없으면 파일럿 신청 안내)
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('admin_user_id', user.id)
    .maybeSingle()

  if (!school) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">학교 국제처 파일럿</h1>
        <p className="mt-2 text-sm text-zinc-500">
          K-MOM은 학교에 첫 3개월 무료 파일럿을 제공합니다.
        </p>

        <div className="mt-8 rounded-2xl border-2 border-dashed border-zinc-300 p-8 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            아직 K-MOM과 MOU/파일럿 계약이 없습니다.
          </p>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            파일럿에서 제공되는 것:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>재학생 익명 위험 요약 리포트 (개인정보 최소화)</li>
            <li>서류 미제출 위험군 수</li>
            <li>업종 위험 알림</li>
            <li>국제처 담당자 1:1 피드백 미팅</li>
          </ul>
          <a
            href="mailto:hello@k-mom.kr?subject=School Pilot 신청"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            파일럿 신청
          </a>
        </div>
      </main>
    )
  }

  // 익명 위험 요약 — 실명 노출 없이 집계
  // 자기 학교 소속 학생들의 합법 위험 신호만 집계
  const { data: schoolStudents } = await supabase
    .from('school_students')
    .select('student_id, doc_submitted')
    .eq('school_id', school.id)

  const studentIds = (schoolStudents ?? []).map((s) => s.student_id)
  const totalStudents = studentIds.length
  const docNotSubmitted = (schoolStudents ?? []).filter((s) => !s.doc_submitted).length

  // 학생 비자/TOPIK 분포 (집계만)
  let visaCounts = { d2: 0, d4: 0, other: 0, unknown: 0 }
  let lowTopikCount = 0 // 4급 미만 = 학기 중 15h 제한
  let activeWorkCount = 0
  let workOverLimitWarn = 0 // 향후 자동 계산용 placeholder

  if (studentIds.length > 0) {
    const [{ data: usersRows }, { data: profilesRows }, { data: activeWorks }] =
      await Promise.all([
        supabase.from('users').select('id, visa_type').in('id', studentIds),
        supabase.from('student_profiles').select('user_id, topik_level').in('user_id', studentIds),
        supabase
          .from('work_histories')
          .select('id, hours_per_week, status, student_id')
          .in('student_id', studentIds)
          .eq('status', 'active'),
      ])

    for (const u of usersRows ?? []) {
      if (!u.visa_type) visaCounts.unknown++
      else if (u.visa_type.startsWith('D-2')) visaCounts.d2++
      else if (u.visa_type === 'D-4') visaCounts.d4++
      else visaCounts.other++
    }
    for (const p of profilesRows ?? []) {
      const lv = p.topik_level
      const num = lv === 'level_6' ? 6 : lv === 'level_5' ? 5 : lv === 'level_4' ? 4 : 0
      if (num < 4) lowTopikCount++
    }
    activeWorkCount = activeWorks?.length ?? 0
    workOverLimitWarn = (activeWorks ?? []).filter((w) => (w.hours_per_week ?? 0) > 25).length
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{school.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            국제처 위험 요약 리포트 · MOU 상태:{' '}
            <span className="font-medium">{school.mou_status}</span>
          </p>
        </div>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
          익명 집계 · 개인정보 최소화
        </span>
      </div>

      {/* 상단 요약 카드 */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat label="등록된 재학생" value={totalStudents} suffix="명" />
        <Stat
          label="현재 교외 근무중"
          value={activeWorkCount}
          suffix="명"
          level={activeWorkCount > 0 ? 'info' : 'ok'}
        />
        <Stat
          label="서류 미제출"
          value={docNotSubmitted}
          suffix="명"
          level={docNotSubmitted > 0 ? 'warn' : 'ok'}
        />
        <Stat
          label="시간 한도 초과 의심"
          value={workOverLimitWarn}
          suffix="건"
          level={workOverLimitWarn > 0 ? 'fail' : 'ok'}
        />
      </div>

      {/* 위험 신호 — 익명 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">위험 신호 (익명 집계)</h2>
        <p className="mt-1 text-sm text-zinc-500">
          개별 학생을 식별하지 않습니다. 위험군 수만 보여드립니다.
        </p>
        <div className="mt-4 space-y-3">
          <RiskRow
            label="TOPIK 4급 미만 (학기 중 주 15시간 제한)"
            count={lowTopikCount}
            unit="명"
            level={lowTopikCount > 0 ? 'warn' : 'ok'}
          />
          <RiskRow
            label="시간제취업 허가 신청 전 추정 (서류 미제출 기준)"
            count={docNotSubmitted}
            unit="명"
            level={docNotSubmitted > 0 ? 'fail' : 'ok'}
          />
          <RiskRow
            label="비자 정보 미입력"
            count={visaCounts.unknown}
            unit="명"
            level={visaCounts.unknown > 0 ? 'warn' : 'ok'}
          />
          <RiskRow
            label="허가 가능 비자 외 학생 (D-2/D-4 아님)"
            count={visaCounts.other}
            unit="명"
            level={visaCounts.other > 0 ? 'fail' : 'ok'}
          />
        </div>
      </section>

      {/* 비자 분포 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">비자 분포</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <DistRow label="D-2 계열" value={visaCounts.d2} total={totalStudents} />
          <DistRow label="D-4 어학" value={visaCounts.d4} total={totalStudents} />
          <DistRow label="기타" value={visaCounts.other} total={totalStudents} />
          <DistRow label="미입력" value={visaCounts.unknown} total={totalStudents} />
        </div>
      </section>

      {/* MOU 업그레이드 안내 */}
      {school.mou_status !== 'active' && (
        <section className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-900 dark:bg-violet-950/30">
          <h3 className="text-lg font-bold text-violet-900 dark:text-violet-200">
            정식 MOU로 전환하면
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-violet-800 dark:text-violet-300">
            <li>학생 동의 기반 실명 조회 권한</li>
            <li>개별 학생 서류 누락 알림</li>
            <li>학기·연간 추이 분석 리포트</li>
            <li>담당자 다계정 + 권한 관리</li>
          </ul>
          <Link
            href="/pricing"
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-violet-600 px-5 text-sm font-medium text-white hover:bg-violet-700"
          >
            요금제 보기
          </Link>
        </section>
      )}
    </main>
  )
}

function Stat({
  label,
  value,
  suffix,
  level = 'info',
}: {
  label: string
  value: number
  suffix?: string
  level?: 'ok' | 'warn' | 'fail' | 'info'
}) {
  const color =
    level === 'fail'
      ? 'text-red-600 dark:text-red-400'
      : level === 'warn'
        ? 'text-amber-600 dark:text-amber-400'
        : level === 'ok'
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-zinc-900 dark:text-white'
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
        {suffix && <span className="ml-1 text-sm font-medium text-zinc-500">{suffix}</span>}
      </p>
    </div>
  )
}

function RiskRow({
  label,
  count,
  unit,
  level,
}: {
  label: string
  count: number
  unit: string
  level: 'ok' | 'warn' | 'fail'
}) {
  const dot =
    level === 'fail' ? 'bg-red-500' : level === 'warn' ? 'bg-amber-500' : 'bg-emerald-500'
  const chip =
    level === 'fail'
      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
      : level === 'warn'
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`rounded-full px-3 py-1 text-sm font-medium ${chip}`}>
        {count} {unit}
      </span>
    </div>
  )
}

function DistRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-zinc-500">{pct}%</p>
    </div>
  )
}
