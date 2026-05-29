'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { createWorkHistory, type ActionResult } from '@/app/actions/work'

export default function HireForm({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<ActionResult | undefined, FormData>(
    createWorkHistory,
    undefined,
  )

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
          ✓ 서류 준비 패키지가 시작되었어요
        </p>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
          시간제취업 허가 신청 전 필요한 서류 체크리스트와 함께 진행하세요. 내 알바 페이지에서
          진행 상황을 확인할 수 있어요.
        </p>
        <Link
          href="/employer/work"
          className="mt-3 inline-block text-sm font-medium underline text-emerald-700 dark:text-emerald-300"
        >
          내 알바로 →
        </Link>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium">합법 채용 진행</p>
        <p className="mt-1 text-sm text-zinc-500">
          이 학생을 채용하기로 결정했다면, K-MOM이 시간제취업 허가 신청 전 필요한 서류와
          근무 조건을 기록·점검해드립니다. <strong>채용 알선 수수료는 없습니다.</strong>
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex h-11 items-center rounded-lg bg-emerald-600 px-6 text-sm font-medium text-white hover:bg-emerald-700"
        >
          서류 준비 패키지 시작
        </button>
      </div>
    )
  }

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <input type="hidden" name="student_id" value={studentId} />
      <h3 className="font-semibold">근무 조건 기록</h3>
      <p className="text-xs text-zinc-500">
        시간제취업 허가 신청서에 들어갈 정보입니다. 정확히 입력해주세요.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="block text-xs font-medium text-zinc-500">근무 시작 예정일</span>
          <input
            type="date"
            name="start_date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-zinc-500">주당 근무시간</span>
          <input
            type="number"
            name="hours_per_week"
            min={0}
            max={40}
            placeholder="15"
            className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-zinc-500">시급 (원)</span>
          <input
            type="number"
            name="hourly_wage"
            min={0}
            step={100}
            placeholder="10030"
            className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>

      <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>다음 단계:</strong> 등록 후 「내 알바」에서 ① 근로계약서 작성 ② 시간제취업
        확인서 작성 ③ 출입국·외국인관서 허가 신청 안내를 받게 됩니다.
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? '기록 중...' : '서류 준비 시작'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-10 rounded-lg border border-zinc-300 px-5 text-sm dark:border-zinc-700"
        >
          취소
        </button>
      </div>
    </form>
  )
}
