import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DEMO_STUDENTS } from '@/data/demo-students'
import { DEMO_EMPLOYERS } from '@/data/demo-employers'

export const metadata = { title: '학교 모니터링 대시보드 · K-MOM' }

export default async function SchoolDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 자기 학교 조회
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('admin_user_id', user.id)
    .maybeSingle()

  // school이 없으면 → 투자자 데모 대시보드 표시
  if (!school) {
    return <DemoDashboard />
  }

  // ── 정식 MOU 학교가 있는 경우 — 기존 로직 유지 ──
  const { data: schoolStudents } = await supabase
    .from('school_students')
    .select('student_id, doc_submitted')
    .eq('school_id', school.id)

  const studentIds = (schoolStudents ?? []).map((s) => s.student_id)
  const totalStudents = studentIds.length
  const docNotSubmitted = (schoolStudents ?? []).filter((s) => !s.doc_submitted).length

  let visaCounts = { d2: 0, d4: 0, other: 0, unknown: 0 }
  let lowTopikCount = 0
  let activeWorkCount = 0
  let workOverLimitWarn = 0

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
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="등록된 재학생" value={totalStudents} suffix="명" />
        <StatCard label="현재 교외 근무중" value={activeWorkCount} suffix="명" level={activeWorkCount > 0 ? 'info' : 'ok'} />
        <StatCard label="서류 미제출" value={docNotSubmitted} suffix="명" level={docNotSubmitted > 0 ? 'warn' : 'ok'} />
        <StatCard label="시간 한도 초과 의심" value={workOverLimitWarn} suffix="건" level={workOverLimitWarn > 0 ? 'fail' : 'ok'} />
      </div>
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

// ── 투자자 데모 대시보드 ──

function DemoDashboard() {
  // 12명의 데모 학생과 매칭된 업체 데이터
  const demoRows = [
    { studentId: 's-001', employerId: 'e-001', days: '금·토', hours: '주 10h', rating: 4.7 },
    { studentId: 's-002', employerId: 'e-010', days: '화·목·토', hours: '주 12h', rating: 4.1 },
    { studentId: 's-003', employerId: 'e-012', days: '월·수·금', hours: '주 15h', rating: 4.8 },
    { studentId: 's-004', employerId: 'e-002', days: '토·일', hours: '주 8h', rating: 4.4 },
    { studentId: 's-005', employerId: 'e-005', days: '금·토·일', hours: '주 9h', rating: 3.1 },
    { studentId: 's-006', employerId: 'e-003', days: '화·토', hours: '주 10h', rating: 4.5 },
    { studentId: 's-007', employerId: 'e-007', days: '월~목', hours: '주 8h', rating: 4.0 }, // 주의 신호
    { studentId: 's-008', employerId: 'e-004', days: '수·금·토', hours: '주 12h', rating: 4.4 },
    { studentId: 's-009', employerId: 'e-009', days: '월·수', hours: '주 8h', rating: 3.8 },
    { studentId: 's-010', employerId: 'e-008', days: '화·토', hours: '주 10h', rating: 4.3 },
    { studentId: 's-011', employerId: 'e-001', days: '토·일', hours: '주 8h', rating: 4.2 },
    { studentId: 's-012', employerId: 'e-004', days: '화·목', hours: '주 10h', rating: 4.5 },
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">K-MOM 데모대학교</h1>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              학교 모니터링 대시보드
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Handshake · Interstride 벤치마킹 — 학생 시간제취업 현황 실시간 모니터링
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          🎬 DEMO MODE
        </span>
      </div>

      {/* KPI 카드 row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="등록 학생 수" value={18} suffix="명" level="info" />
        <StatCard label="알바 희망 학생" value={12} suffix="명" level="info" />
        <StatCard label="현재 근무 중인 학생" value={7} suffix="명" level="info" />
        <StatCard label="K-MOM 인증 업체 근무" value={5} suffix="명" level="ok" />
        <StatCard label="주의 신호 업체" value={1} suffix="곳" level="warn" />
        <StatCard label="교수 추천 학생" value={4} suffix="명" level="ok" />
        <StatCard label="서류 체크리스트 완료" value={10} suffix="명" level="ok" />
        <StatCard label="업체 평가 평균" value={4.3} suffix="점" level="info" isDecimal />
        <StatCard label="학생 만족도" value={4.6} suffix="점" level="ok" isDecimal />
      </div>

      {/* 위험 신호 알림 박스 */}
      <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              주의 신호 업체 1곳 확인됨 — 이자카야 도쿄밤 (홍대)
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
              임금 지급 지연 신고 1건. 해당 업체에서 근무 중인 학생 1명.
            </p>
          </div>
        </div>
      </div>

      {/* 학생 근무 현황 표 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">학생 근무 현황 (12명)</h2>
        <p className="mt-1 text-sm text-zinc-500">학생 동의 기반 · K-MOM 등록 근무 이력 기준</p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <Th>학생</Th>
                <Th>학교인증</Th>
                <Th>비자</Th>
                <Th>근무 업체</Th>
                <Th>업종</Th>
                <Th>지역</Th>
                <Th>인증업체</Th>
                <Th>요일</Th>
                <Th>시간</Th>
                <Th>평가</Th>
                <Th>주의신호</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {demoRows.map((row) => {
                const student = DEMO_STUDENTS.find((s) => s.studentId === row.studentId)
                const employer = DEMO_EMPLOYERS.find((e) => e.companyId === row.employerId)
                if (!student || !employer) return null
                const isRisk = employer.riskFlag
                return (
                  <tr
                    key={row.studentId}
                    className={`hover:bg-zinc-50 dark:hover:bg-zinc-900 ${isRisk ? 'bg-amber-50/60 dark:bg-amber-950/20' : ''}`}
                  >
                    <Td>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-zinc-400">{student.nickname}</div>
                    </Td>
                    <Td>
                      {student.schoolVerified ? (
                        <span className="text-xs text-emerald-700 dark:text-emerald-300">✓ 인증</span>
                      ) : (
                        <span className="text-xs text-zinc-400">미인증</span>
                      )}
                    </Td>
                    <Td>
                      <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                        {student.visaType}
                      </span>
                    </Td>
                    <Td>
                      <div className="font-medium">{employer.companyName}</div>
                    </Td>
                    <Td>
                      <span className="text-xs text-zinc-500">{employer.businessType}</span>
                    </Td>
                    <Td>
                      <span className="text-xs text-zinc-500">{employer.area}</span>
                    </Td>
                    <Td>
                      {employer.certified ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          인증
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">미인증</span>
                      )}
                    </Td>
                    <Td>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">{row.days}</span>
                    </Td>
                    <Td>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">{row.hours}</span>
                    </Td>
                    <Td>
                      <span className="text-xs font-medium">
                        ★ {row.rating}
                      </span>
                    </Td>
                    <Td>
                      {isRisk ? (
                        <span className="text-amber-500">⚠️</span>
                      ) : (
                        <span className="text-xs text-zinc-300 dark:text-zinc-700">—</span>
                      )}
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs leading-relaxed text-zinc-500">
          K-MOM은 학교가 학생의 시간제취업을 직접 알선하는 서비스가 아닙니다. 학생과 업체의 신뢰
          이력을 기반으로 학생의 교외 근무 현황을 확인하고 위험 신호를 파악할 수 있도록 돕는
          모니터링 도구입니다. 최종 허가와 판단은 학교와 출입국 기준에 따릅니다.
        </p>
      </div>
    </main>
  )
}

// ── 공통 컴포넌트 ──

function StatCard({
  label,
  value,
  suffix,
  level = 'info',
  isDecimal = false,
}: {
  label: string
  value: number
  suffix?: string
  level?: 'ok' | 'warn' | 'fail' | 'info'
  isDecimal?: boolean
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
        {isDecimal ? value.toFixed(1) : value}
        {suffix && <span className="ml-1 text-sm font-medium text-zinc-500">{suffix}</span>}
      </p>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-middle">{children}</td>
}
