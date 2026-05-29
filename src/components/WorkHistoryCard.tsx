import Link from 'next/link'
import { completeWorkHistory } from '@/app/actions/work'
import type { WorkHistory } from '@/lib/supabase/types'

interface Props {
  work: WorkHistory
  // 상대방 정보 (학생이 보면 업주, 업주가 보면 학생)
  counterpartName: string
  counterpartLabel: string
  viewer: 'student' | 'employer'
  myReviewSubmitted: boolean
  bothRevealed: boolean
}

export default function WorkHistoryCard({
  work,
  counterpartName,
  counterpartLabel,
  viewer,
  myReviewSubmitted,
  bothRevealed,
}: Props) {
  const isActive = work.status === 'active'
  const isCompleted = work.status === 'completed'

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500">{counterpartLabel}</p>
          <p className="mt-1 font-semibold">{counterpartName}</p>
        </div>
        <span
          className={
            isActive
              ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }
        >
          {isActive ? '근무중' : isCompleted ? '종료' : '취소'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label="시작" value={work.start_date} />
        <Stat label="종료" value={work.end_date ?? '진행중'} />
        <Stat
          label="주당"
          value={work.hours_per_week ? `${work.hours_per_week}h` : '-'}
        />
      </div>

      {work.hourly_wage && (
        <p className="mt-2 text-xs text-zinc-500">
          시급 {work.hourly_wage.toLocaleString()}원
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {isActive && viewer === 'employer' && (
          <form action={completeWorkHistory}>
            <input type="hidden" name="work_id" value={work.id} />
            <button className="h-9 rounded-lg border border-zinc-300 px-4 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
              근무 종료 처리
            </button>
          </form>
        )}
        {isCompleted && !myReviewSubmitted && (
          <Link
            href={`/work/${work.id}/review`}
            className="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-xs font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            평가 작성
          </Link>
        )}
        {isCompleted && myReviewSubmitted && !bothRevealed && (
          <span className="inline-flex h-9 items-center rounded-lg border border-amber-300 bg-amber-50 px-4 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            상대 평가 대기 중...
          </span>
        )}
        {isCompleted && bothRevealed && (
          <Link
            href={`/work/${work.id}/review`}
            className="inline-flex h-9 items-center rounded-lg border border-emerald-300 bg-emerald-50 px-4 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            ✓ 평가 확인
          </Link>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 px-2 py-1.5 dark:bg-zinc-950">
      <p className="text-zinc-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
