import type { DemoReview } from '@/data/demo-reviews'
import RatingStars from '@/components/RatingStars'

interface ReviewCardProps {
  review: DemoReview
  studentName: string
  companyName: string
}

function formatDate(isoString: string): string {
  const d = new Date(isoString)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return `${year}년 ${month}월`
}

const studentRatingLabels: Array<{ key: keyof typeof import('@/data/demo-reviews').DEMO_REVIEWS[number]['ratings']; label: string; isBinary?: boolean }> = [
  { key: 'wageOnTime', label: '급여 약속 날 지급' },
  { key: 'jobMatchAccuracy', label: '공고 내용 일치' },
  { key: 'workEnvironment', label: '근무 환경 안전' },
  { key: 'studentRespect', label: '외국인 학생 존중' },
  { key: 'documentSupport', label: '서류 준비 협조' },
  { key: 'wouldReturn', label: '다시 일하고 싶음', isBinary: true },
]

const employerRatingLabels: Array<{ key: keyof typeof import('@/data/demo-reviews').DEMO_REVIEWS[number]['ratings']; label: string; isBinary?: boolean }> = [
  { key: 'punctuality', label: '약속 시간 출근' },
  { key: 'noShow', label: '무단결근 없음', isBinary: true },
  { key: 'workAttitude', label: '업무 태도 성실' },
  { key: 'customerService', label: '손님 응대 적절' },
  { key: 'koreanCommunication', label: '한국어 소통' },
  { key: 'wouldRehire', label: '다시 채용', isBinary: true },
]

export default function ReviewCard({ review, studentName, companyName }: ReviewCardProps) {
  const isStudentReview = review.reviewerRole === 'student'
  const ratingLabels = isStudentReview ? studentRatingLabels : employerRatingLabels

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isStudentReview
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
            }`}
          >
            {isStudentReview ? '👤' : '🏢'}
            {isStudentReview ? `학생이 업체를 평가` : `업체가 학생을 평가`}
          </span>
          {review.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              ✔ 인증된 리뷰
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{formatDate(review.createdAt)}</span>
      </div>

      {/* Reviewer / Reviewee info */}
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        {isStudentReview
          ? <><strong className="text-zinc-700 dark:text-zinc-300">{studentName}</strong> → <strong className="text-zinc-700 dark:text-zinc-300">{companyName}</strong></>
          : <><strong className="text-zinc-700 dark:text-zinc-300">{companyName}</strong> → <strong className="text-zinc-700 dark:text-zinc-300">{studentName}</strong></>
        }
      </div>

      {/* Ratings */}
      <div className="space-y-2">
        {ratingLabels.map(({ key, label, isBinary }) => {
          const value = review.ratings[key]
          if (value === undefined || value === null) return null

          if (isBinary) {
            return (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                <span
                  className={`text-xs font-semibold ${
                    value === 1
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {value === 1 ? '예 ✓' : '아니오'}
                </span>
              </div>
            )
          }

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0 w-28 truncate">{label}</span>
              <RatingStars rating={value as number} size="sm" />
            </div>
          )
        })}
      </div>

      {/* Comment */}
      <blockquote className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 leading-relaxed dark:bg-zinc-800 dark:text-zinc-300 border-l-2 border-zinc-300 dark:border-zinc-600">
        &ldquo;{review.comment}&rdquo;
      </blockquote>
    </div>
  )
}
