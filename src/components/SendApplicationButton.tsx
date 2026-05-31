'use client'

import { useActionState, useState } from 'react'
import { sendApplication, type ApplicationResult } from '@/app/actions/applications'

export default function SendApplicationButton({
  employerId,
  businessName,
  alreadySent = false,
}: {
  employerId: string
  businessName: string
  alreadySent?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<ApplicationResult | undefined, FormData>(
    sendApplication,
    undefined,
  )

  if (alreadySent || state?.ok) {
    return (
      <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        ✓ 이력서 전송 완료
      </div>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        📩 내 이력서 보내기
      </button>
    )
  }

  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="employer_id" value={employerId} />
      <p className="text-xs font-medium">
        <span className="font-bold">{businessName}</span> 에 내 이력서 보내기
      </p>
      <textarea
        name="message"
        rows={3}
        placeholder="짧은 인사말 (선택)"
        maxLength={300}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
      />
      {state?.error && (
        <p className="rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 h-9 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? '보내는 중...' : '전송'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-9 rounded-lg border border-zinc-300 px-3 text-xs dark:border-zinc-700"
        >
          취소
        </button>
      </div>
    </form>
  )
}
