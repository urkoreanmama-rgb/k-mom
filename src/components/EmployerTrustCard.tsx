import type { DemoEmployer } from '@/data/demo-employers'
import TrustBadge from '@/components/TrustBadge'
import RatingStars from '@/components/RatingStars'
import TrustScoreBar from '@/components/TrustScoreBar'

interface EmployerTrustCardProps {
  employer: DemoEmployer
  compact?: boolean
}

function businessTypeEmoji(type: string): string {
  const lower = type.toLowerCase()
  if (lower.includes('베트남') || lower.includes('쌀국수')) return '🍜'
  if (lower.includes('화장품') || lower.includes('뷰티')) return '💄'
  if (lower.includes('카페')) return '☕'
  if (lower.includes('분식')) return '🍱'
  if (lower.includes('편의점')) return '🏪'
  if (lower.includes('일식') || lower.includes('이자카야') || lower.includes('주점')) return '🍶'
  if (lower.includes('한식')) return '🍚'
  return '🏢'
}

export default function EmployerTrustCard({ employer, compact = false }: EmployerTrustCardProps) {
  const emoji = businessTypeEmoji(employer.businessType)

  if (compact) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl">{emoji}</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{employer.companyName}</span>
          {employer.certified && (
            <TrustBadge label="K-MOM 플랫폼 기준 우수 업체" size="sm" />
          )}
          {employer.riskFlag && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              ⚠️ 주의
            </span>
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <RatingStars rating={employer.trustScore} size="sm" />
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {employer.badges.slice(0, 2).map((badge) => (
            <TrustBadge key={badge} label={badge} size="sm" />
          ))}
        </div>
      </div>
    )
  }

  const { reviewSummary } = employer

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl dark:bg-emerald-900/40">
            {emoji}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{employer.companyName}</h3>
              {employer.certified && (
                <TrustBadge label="K-MOM 플랫폼 기준 우수 업체" size="sm" />
              )}
            </div>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {employer.area} · {employer.businessType}
            </p>
          </div>
        </div>
        {employer.riskFlag && (
          <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2 dark:bg-orange-900/20">
            <span className="text-orange-500">⚠️</span>
            <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">주의 신호</span>
          </div>
        )}
      </div>

      {/* Risk note */}
      {employer.riskFlag && employer.riskNote && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
          ⚠️ {employer.riskNote}
        </div>
      )}

      {/* Overall trust score */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">종합 신뢰도</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{employer.trustScore.toFixed(1)}</p>
          <RatingStars rating={employer.trustScore} size="sm" />
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          <p>리뷰 {reviewSummary.totalReviews}건</p>
          <p className="font-medium text-emerald-600 dark:text-emerald-400">재근무 의향 {reviewSummary.rehireIntent}%</p>
        </div>
      </div>

      {/* Review breakdown */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">평가 항목</p>
        <div className="space-y-2">
          <TrustScoreBar label="급여 약속 지급" score={reviewSummary.wageOnTime} color="emerald" />
          <TrustScoreBar label="공고 내용 일치" score={reviewSummary.jobMatchAccuracy} color="emerald" />
          <TrustScoreBar label="근무 환경 안전" score={reviewSummary.workEnvironment} color="emerald" />
          <TrustScoreBar label="학생 존중" score={reviewSummary.studentRespect} color="emerald" />
          <TrustScoreBar label="서류 협조" score={reviewSummary.documentSupport} color="emerald" />
        </div>
      </div>

      {/* Badges */}
      {employer.badges.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">배지</p>
          <div className="flex flex-wrap gap-1.5">
            {employer.badges.map((badge) => (
              <TrustBadge key={badge} label={badge} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Hiring history */}
      {employer.hiringHistory.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">채용 이력</p>
          <div className="space-y-2">
            {employer.hiringHistory.slice(0, 3).map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{h.studentNickname}</span>
                  <span className="text-xs text-zinc-400">{h.jobType}</span>
                </div>
                <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
                  <div>{h.period}</div>
                  {h.rehired && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">재고용 ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">업체 소개</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{employer.description}</p>
      </div>

      {/* Required languages */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">필요 언어</p>
        <div className="flex flex-wrap gap-1">
          {employer.requiredLanguages.map((lang) => (
            <span
              key={lang}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-400 dark:text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        이 정보는 K-MOM 플랫폼 이용 학생의 평가를 기반으로 합니다
      </p>
    </div>
  )
}
