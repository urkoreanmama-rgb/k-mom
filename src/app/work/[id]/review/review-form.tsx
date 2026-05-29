'use client'

import { useActionState, useState } from 'react'
import { submitReview, type ActionResult } from '@/app/actions/work'

const EMPLOYER_ITEMS = [
  { key: 'punctuality', label: '시간 준수' },
  { key: 'attitude', label: '업무 태도' },
  { key: 'communication', label: '한국어 소통' },
]
const STUDENT_ITEMS = [
  { key: 'legality', label: '합법 근무 보장' },
  { key: 'wage_payment', label: '임금 지급 신뢰' },
  { key: 'environment', label: '근무 환경' },
]

export default function ReviewForm({
  workId,
  isEmployer,
}: {
  workId: string
  isEmployer: boolean
}) {
  const items = isEmployer ? EMPLOYER_ITEMS : STUDENT_ITEMS
  const [score, setScore] = useState(0)
  const [state, action, pending] = useActionState<ActionResult | undefined, FormData>(
    submitReview,
    undefined,
  )

  if (state?.ok) {
    return (
      <div className="mt-8 rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-950/40">
        <p className="font-medium text-emerald-900 dark:text-emerald-200">
          평가가 제출됐어요 ✓
        </p>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
          상대방의 평가가 들어오면 자동으로 공개됩니다.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="mt-8 space-y-6">
      <input type="hidden" name="work_id" value={workId} />

      <div>
        <p className="text-sm font-medium">전체 별점</p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={`text-4xl ${n <= score ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" name="score" value={score} />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">세부 평가</p>
        {items.map((item) => (
          <ItemRow key={item.key} name={item.key} label={item.label} />
        ))}
      </div>

      <label className="block">
        <span className="text-sm font-medium">코멘트 (선택)</span>
        <textarea
          name="comment"
          rows={4}
          placeholder={
            isEmployer
              ? '함께 일한 학생에 대한 솔직한 평가를 남겨주세요.'
              : '근무 환경에 대한 솔직한 평가를 남겨주세요.'
          }
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || score === 0}
        className="h-11 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? '제출 중...' : '평가 제출'}
      </button>
      <p className="text-xs text-zinc-500">
        ※ 상대방도 제출하면 양쪽이 동시에 공개됩니다 (에어비앤비 방식)
      </p>
    </form>
  )
}

function ItemRow({ name, label }: { name: string; label: string }) {
  const [v, setV] = useState(0)
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setV(n)}
            className={`text-xl ${n <= v ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`}
          >
            ★
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={v} />
    </div>
  )
}
