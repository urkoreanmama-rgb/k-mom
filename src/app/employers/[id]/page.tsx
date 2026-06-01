import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DEMO_EMPLOYERS } from '@/data/demo-employers'
import { DEMO_REVIEWS } from '@/data/demo-reviews'
import { DEMO_STUDENTS } from '@/data/demo-students'
import EmployerTrustCard from '@/components/EmployerTrustCard'
import ReviewCard from '@/components/ReviewCard'
import TrustBadge from '@/components/TrustBadge'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const employer = DEMO_EMPLOYERS.find((e) => e.companyId === id)
  if (!employer) return { title: '업체 없음 · K-MOM' }
  return { title: `${employer.companyName} 신뢰 프로필 · K-MOM` }
}

export async function generateStaticParams() {
  return DEMO_EMPLOYERS.map((e) => ({ id: e.companyId }))
}

const CERTIFICATION_CONDITIONS = [
  { label: '누적 학생 평가 5건 이상', key: 'totalReviews', threshold: 5 },
  { label: '임금 지급 신뢰도 4.5 이상', key: 'wageOnTime', threshold: 4.5 },
  { label: '근무환경 점수 4.3 이상', key: 'workEnvironment', threshold: 4.3 },
  { label: '서류 협조 점수 4.0 이상', key: 'documentSupport', threshold: 4.0 },
  { label: '학생 재근무 의향 70% 이상', key: 'rehireIntent', threshold: 70 },
  { label: '주의 신호 없음', key: 'noRiskFlag', threshold: 1 },
] as const

export default async function EmployerDetailPage({ params }: Props) {
  const { id } = await params
  const employer = DEMO_EMPLOYERS.find((e) => e.companyId === id)

  if (!employer) {
    notFound()
  }

  // Get student reviews for this employer
  const studentReviews = DEMO_REVIEWS.filter(
    (r) => r.companyId === id && r.reviewerRole === 'student'
  )

  const rs = employer.reviewSummary

  // Check each certification condition
  const conditionResults = [
    { label: '누적 학생 평가 5건 이상', achieved: rs.totalReviews >= 5, current: `${rs.totalReviews}건` },
    { label: '임금 지급 신뢰도 4.5 이상', achieved: rs.wageOnTime >= 4.5, current: `${rs.wageOnTime.toFixed(1)}점` },
    { label: '근무환경 점수 4.3 이상', achieved: rs.workEnvironment >= 4.3, current: `${rs.workEnvironment.toFixed(1)}점` },
    { label: '서류 협조 점수 4.0 이상', achieved: rs.documentSupport >= 4.0, current: `${rs.documentSupport.toFixed(1)}점` },
    { label: '학생 재근무 의향 70% 이상', achieved: rs.rehireIntent >= 70, current: `${rs.rehireIntent}%` },
    { label: '주의 신호 없음', achieved: !employer.riskFlag, current: employer.riskFlag ? '주의 신호 있음' : '문제 없음' },
  ]

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Back */}
      <Link href="/employers" className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:underline mb-6">
        ← 업체 목록으로
      </Link>

      {/* Risk flag warning */}
      {employer.riskFlag && (
        <div className="mb-6 rounded-2xl border-2 border-orange-300 bg-orange-50 p-5 dark:border-orange-700 dark:bg-orange-900/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-orange-800 dark:text-orange-200">주의 신호 업체</p>
              {employer.riskNote && (
                <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">{employer.riskNote}</p>
              )}
              <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                이 업체는 K-MOM 모니터링 대상입니다. 지원 전 반드시 확인하세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full employer card */}
      <EmployerTrustCard employer={employer} compact={false} />

      {/* Student reviews */}
      {studentReviews.length > 0 && (
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold mb-4">
            학생 후기
            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
              ({studentReviews.length}건)
            </span>
          </h2>
          <div className="space-y-4">
            {studentReviews.map((review) => {
              const student = DEMO_STUDENTS.find((s) => s.studentId === review.studentId)
              return (
                <ReviewCard
                  key={review.reviewId}
                  review={review}
                  studentName={student?.name ?? review.studentId}
                  companyName={employer.companyName}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Certification conditions */}
      <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">K-MOM 인증 조건</h2>
          {employer.certified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-bold text-white">
              ✓ 인증 완료
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-300 px-3 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
              미인증
            </span>
          )}
        </div>
        <div className="space-y-2">
          {conditionResults.map((cond) => (
            <div
              key={cond.label}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-2">
                <span className={`text-base ${cond.achieved ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}`}>
                  {cond.achieved ? '✓' : '○'}
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{cond.label}</span>
              </div>
              <span className={`text-sm font-semibold ${
                cond.achieved
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}>
                {cond.current}
              </span>
            </div>
          ))}
        </div>
        {!employer.certified && (
          <p className="mt-4 text-xs text-emerald-700 dark:text-emerald-400">
            위 조건을 모두 충족하면 K-MOM 인증 업체로 등록되어 우수 학생에게 먼저 노출됩니다.
          </p>
        )}
      </section>

      {/* Hiring history full table */}
      {employer.hiringHistory.length > 0 && (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold mb-4">채용 이력 상세</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-2 pr-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">학생 닉네임</th>
                  <th className="py-2 pr-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">기간</th>
                  <th className="py-2 pr-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">직무</th>
                  <th className="py-2 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">재고용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {employer.hiringHistory.map((h, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 font-medium text-zinc-800 dark:text-zinc-200">{h.studentNickname}</td>
                    <td className="py-2.5 pr-4 text-zinc-500 dark:text-zinc-400">{h.period}</td>
                    <td className="py-2.5 pr-4 text-zinc-500 dark:text-zinc-400">{h.jobType}</td>
                    <td className="py-2.5">
                      {h.rehired ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">재고용 ✓</span>
                      ) : h.period.includes('현재') ? (
                        <span className="text-sky-600 dark:text-sky-400">재직 중</span>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Badges */}
      {employer.badges.length > 0 && (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold mb-4">인증 배지</h2>
          <div className="flex flex-wrap gap-2">
            {employer.badges.map((badge) => (
              <TrustBadge key={badge} label={badge} size="md" />
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500 text-center leading-relaxed">
        이 프로필은 K-MOM 플랫폼에 등록된 학생의 리뷰를 기반으로 합니다.
        시현용 더미 데이터이며, 실제 서비스에서는 Supabase employer_profiles 테이블로 교체됩니다.
      </p>
    </main>
  )
}
