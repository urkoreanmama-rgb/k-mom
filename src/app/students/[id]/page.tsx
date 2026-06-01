import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DEMO_STUDENTS } from '@/data/demo-students'
import StudentTrustCard from '@/components/StudentTrustCard'
import TrustScoreBar from '@/components/TrustScoreBar'
import TrustBadge from '@/components/TrustBadge'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const student = DEMO_STUDENTS.find((s) => s.studentId === id)
  if (!student) return { title: '학생 없음 · K-MOM' }
  return { title: `${student.name} 신뢰 프로필 · K-MOM` }
}

export async function generateStaticParams() {
  return DEMO_STUDENTS.map((s) => ({ id: s.studentId }))
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params
  const student = DEMO_STUDENTS.find((s) => s.studentId === id)

  if (!student) {
    notFound()
  }

  const allowedHours =
    student.visaType === 'D-2-3' || student.visaType === 'D-2-4'
      ? student.topikLevel >= 5
        ? '주 35시간'
        : student.topikLevel >= 4
          ? '주 30시간'
          : '주 15시간'
      : student.topikLevel >= 5
        ? '주 30시간'
        : student.topikLevel >= 4
          ? '주 25시간'
          : '주 15시간'

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Back */}
      <Link href="/students" className="inline-flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400 hover:underline mb-6">
        ← 학생 목록으로
      </Link>

      {/* Full trust card */}
      <StudentTrustCard student={student} compact={false} />

      {/* Trust score detail */}
      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold mb-4">신뢰 점수 상세</h2>
        <div className="space-y-3">
          <TrustScoreBar label="성실도" score={student.reliabilityScore} color="sky" />
          <TrustScoreBar label="시간 준수" score={student.punctualityScore} color="sky" />
          <TrustScoreBar label="업체 평균 평점" score={student.averageEmployerRating} color="sky" />
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">재고용 의향률</span>
            <span className="text-lg font-bold text-sky-700 dark:text-sky-300">{student.rehireRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">노쇼 위험도</span>
            <span className={`text-sm font-semibold ${
              student.noShowRisk === 'low'
                ? 'text-emerald-600 dark:text-emerald-400'
                : student.noShowRisk === 'medium'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
            }`}>
              {student.noShowRisk === 'low' ? '낮음' : student.noShowRisk === 'medium' ? '보통' : '높음'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">총 근무 시간</span>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{student.totalWorkHours}시간</span>
          </div>
        </div>
      </section>

      {/* Work history */}
      {student.workHistory.length > 0 && (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold mb-4">알바 이력</h2>
          <div className="space-y-3">
            {student.workHistory.map((wh) => (
              <div
                key={wh.workId}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{wh.companyName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {wh.businessType} · {wh.jobType}
                    </p>
                  </div>
                  <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
                    <p>{wh.startDate} – {wh.endDate}</p>
                    {wh.status === 'active' && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">재직 중</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {wh.workDays.map((d) => (
                    <span key={d} className="rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                      {d}
                    </span>
                  ))}
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                    {wh.timeSlot}
                  </span>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>업체 평가 {wh.employerRated ? '✓' : '미완료'}</span>
                  <span>학생 평가 {wh.studentRated ? '✓' : '미완료'}</span>
                  {wh.rehireIntent && <span className="text-emerald-600 dark:text-emerald-400">재고용 의향 ✓</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Badges */}
      {student.badges.length > 0 && (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold mb-4">배지 모음</h2>
          <div className="flex flex-wrap gap-2">
            {student.badges.map((badge) => (
              <TrustBadge key={badge} label={badge} size="md" />
            ))}
          </div>
        </section>
      )}

      {/* D-2 Checklist */}
      <section className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-800 dark:bg-sky-900/10">
        <h2 className="text-lg font-bold text-sky-900 dark:text-sky-100 mb-4">D-2 체크리스트</h2>
        <div className="space-y-3">
          <ChecklistItem
            label="비자 유형 확인"
            value={student.visaType}
            ok={true}
          />
          <ChecklistItem
            label="학교 소속 확인"
            value={student.schoolName}
            ok={student.schoolVerified}
          />
          <ChecklistItem
            label="TOPIK 등급 확인"
            value={student.topikLevel > 0 ? `${student.topikLevel}급` : '없음'}
            ok={student.topikLevel >= 3}
          />
          <ChecklistItem
            label="학기 중 근무 가능 시간 (D-2 기준 자동 계산)"
            value={allowedHours}
            ok={true}
          />
          <ChecklistItem
            label="시간제취업 서류 경험"
            value={student.partTimePermissionExperience ? '있음' : '없음'}
            ok={student.partTimePermissionExperience}
          />
        </div>
        <p className="mt-4 text-xs text-sky-700 dark:text-sky-400">
          ※ 출입국관리법 제20조 · 법무부 시간제취업 허가 기준 자동 계산
        </p>
      </section>

      {/* Contact button */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          이 학생에게 연락하시겠습니까?
        </p>
        <Link
          href="/login"
          className="inline-flex h-11 items-center rounded-full bg-sky-600 px-6 text-sm font-semibold text-white hover:bg-sky-700 transition"
        >
          업주 회원으로 로그인 → 연락 요청
        </Link>
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          업주 회원이신가요? /login 으로 이동하세요
        </p>
      </section>

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500 text-center leading-relaxed">
        이 프로필은 K-MOM 플랫폼 시현용 더미 데이터입니다.
        실제 서비스에서는 Supabase student_profiles 테이블로 교체됩니다.
        개인정보는 학생 본인의 동의 하에 게시됩니다.
      </p>
    </main>
  )
}

function ChecklistItem({
  label,
  value,
  ok,
}: {
  label: string
  value: string
  ok: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <span className={`text-base ${ok ? 'text-emerald-500' : 'text-red-500'}`}>
          {ok ? '✓' : '✗'}
        </span>
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${ok ? 'text-zinc-800 dark:text-zinc-200' : 'text-red-600 dark:text-red-400'}`}>
        {value}
      </span>
    </div>
  )
}
