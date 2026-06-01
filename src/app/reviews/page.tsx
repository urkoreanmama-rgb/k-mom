'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DEMO_REVIEWS, DemoReview } from '@/data/demo-reviews'
import { DEMO_STUDENTS } from '@/data/demo-students'
import { DEMO_EMPLOYERS } from '@/data/demo-employers'

type FilterTab = 'all' | 'student' | 'employer'

function getStudentName(studentId: string): string {
  const s = DEMO_STUDENTS.find((s) => s.studentId === studentId)
  return s ? s.name : studentId
}

function getCompanyName(companyId: string): string {
  const e = DEMO_EMPLOYERS.find((e) => e.companyId === companyId)
  return e ? e.companyName : companyId
}

function avgRatings(review: DemoReview): number {
  const r = review.ratings
  if (review.reviewerRole === 'student') {
    const vals = [r.wageOnTime, r.jobMatchAccuracy, r.workEnvironment, r.studentRespect, r.documentSupport].filter(
      (v): v is number => v !== undefined,
    )
    if (vals.length === 0) return 0
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
  } else {
    const vals = [r.punctuality, r.workAttitude, r.customerService, r.koreanCommunication].filter(
      (v): v is number => v !== undefined,
    )
    if (vals.length === 0) return 0
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
  }
}

function StarRow({ label, value }: { label: string; value: number | undefined }) {
  if (value === undefined) return null
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-36 shrink-0 text-zinc-500">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= value ? 'text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-zinc-700 dark:text-zinc-300">{value}.0</span>
    </div>
  )
}

function YesNoRow({ label, value }: { label: string; value: number | undefined }) {
  if (value === undefined) return null
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-36 shrink-0 text-zinc-500">{label}</span>
      <span
        className={
          value
            ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
            : 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300'
        }
      >
        {value ? '예' : '아니오'}
      </span>
    </div>
  )
}

function ReviewCard({ review }: { review: DemoReview }) {
  const studentName = getStudentName(review.studentId)
  const companyName = getCompanyName(review.companyId)
  const avg = avgRatings(review)
  const isStudentReview = review.reviewerRole === 'student'

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={
              isStudentReview
                ? 'rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                : 'rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
            }
          >
            {isStudentReview ? '학생 → 업체' : '업체 → 학생'}
          </span>
          {review.isVerified && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              ✓ 인증 평가
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span className="text-sm font-semibold">{avg}</span>
          <span className="text-xs text-zinc-500">/ 5.0</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-xs text-zinc-400">학생</span>
          <p className="font-medium">{studentName}</p>
        </div>
        <div>
          <span className="text-xs text-zinc-400">업체</span>
          <p className="font-medium">{companyName}</p>
        </div>
        <div>
          <span className="text-xs text-zinc-400">날짜</span>
          <p className="font-medium">{review.createdAt.slice(0, 10)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {isStudentReview ? (
          <>
            <StarRow label="급여 정시 지급" value={review.ratings.wageOnTime} />
            <StarRow label="공고 내용 일치" value={review.ratings.jobMatchAccuracy} />
            <StarRow label="근무 환경 안전" value={review.ratings.workEnvironment} />
            <StarRow label="학생 존중" value={review.ratings.studentRespect} />
            <StarRow label="서류 지원" value={review.ratings.documentSupport} />
            <YesNoRow label="다시 일하고 싶음" value={review.ratings.wouldReturn} />
          </>
        ) : (
          <>
            <StarRow label="시간 약속" value={review.ratings.punctuality} />
            <YesNoRow label="무단결근 없음" value={review.ratings.noShow} />
            <StarRow label="업무 태도" value={review.ratings.workAttitude} />
            <StarRow label="손님 응대" value={review.ratings.customerService} />
            <StarRow label="한국어 소통" value={review.ratings.koreanCommunication} />
            <YesNoRow label="재고용 의향" value={review.ratings.wouldRehire} />
          </>
        )}
      </div>

      {review.comment && (
        <p className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}
    </div>
  )
}

export default function ReviewsPage() {
  const [tab, setTab] = useState<FilterTab>('all')

  const studentToEmployer = DEMO_REVIEWS.filter((r) => r.reviewerRole === 'student')
  const employerToStudent = DEMO_REVIEWS.filter((r) => r.reviewerRole === 'employer')

  const filtered =
    tab === 'all'
      ? DEMO_REVIEWS
      : tab === 'student'
        ? studentToEmployer
        : employerToStudent

  const allAvg =
    DEMO_REVIEWS.length > 0
      ? Math.round(
          (DEMO_REVIEWS.reduce((acc, r) => acc + avgRatings(r), 0) / DEMO_REVIEWS.length) * 10,
        ) / 10
      : 0

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">쌍방향 평가 시스템</h1>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Instawork · Uber 벤치마킹
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          학생과 업체가 서로 평가하는 K-MOM 신뢰 이력 시스템
        </p>
      </div>

      {/* Explanation box */}
      <div className="mt-6 rounded-2xl bg-sky-50 p-5 dark:bg-sky-950/30">
        <p className="text-sm text-sky-800 dark:text-sky-200">
          <strong>학생과 업체가 서로 평가합니다.</strong> 평가 결과는 신뢰 프로필에 누적되어 다음
          매칭에 반영됩니다. 성실한 학생은 더 좋은 업체와 연결되고, 신뢰도 높은 업체는 더 좋은
          학생을 먼저 만납니다.
        </p>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: '총 평가', value: `${DEMO_REVIEWS.length}건` },
          { label: '학생→업체', value: `${studentToEmployer.length}건` },
          { label: '업체→학생', value: `${employerToStudent.length}건` },
          { label: '평균 평점', value: `${allAvg}점` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex gap-2">
        {(
          [
            { key: 'all', label: '전체' },
            { key: 'student', label: '학생→업체' },
            { key: 'employer', label: '업체→학생' },
          ] as { key: FilterTab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={
              tab === key
                ? 'rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900'
                : 'rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'
            }
          >
            {label}{' '}
            <span className="ml-1 text-xs opacity-70">
              ({key === 'all' ? DEMO_REVIEWS.length : key === 'student' ? studentToEmployer.length : employerToStudent.length})
            </span>
          </button>
        ))}
      </div>

      {/* Review list */}
      <div className="mt-6 space-y-5">
        {filtered.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>

      {/* Completion message box */}
      <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
          평가가 저장되었습니다.
        </p>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
          이 평가는 학생과 업체가 서로 더 신뢰할 수 있는 K-MOM 신뢰 이력에 반영됩니다.
        </p>
        <Link
          href="/work/review-demo"
          className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          평가 작성하기 →
        </Link>
      </div>
    </main>
  )
}
