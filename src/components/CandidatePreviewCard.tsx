'use client'

import { useState } from 'react'
import type { DemoStudent } from '@/data/demo-students'
import { requestContact } from '@/app/employer/match/actions'

export default function CandidatePreviewCard({ student }: { student: DemoStudent }) {
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)

  async function onClick() {
    setPending(true)
    const r = await requestContact(student.studentId)
    if (r.ok) setDone(true)
    setPending(false)
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500">{student.studentId}</p>
          <h3 className="mt-0.5 text-lg font-bold">{student.nickname}</h3>
          <p className="text-xs text-zinc-500">
            {student.nationality} · {student.visaType}
          </p>
        </div>
        {student.schoolVerified ? (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            ✓ 학교 소속 확인
          </span>
        ) : (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
            학교 확인 전
          </span>
        )}
      </header>

      <div className="mt-4 space-y-2 text-sm">
        <Row label="언어">
          {student.languages.map((l) => (
            <Chip key={l}>{l}</Chip>
          ))}
        </Row>
        <Row label="한국어">
          <Chip variant="info">
            {student.koreanLevel} · TOPIK {student.topikLevel}급
          </Chip>
        </Row>
        <Row label="요일">{student.availableDays.join(', ')}</Row>
        <Row label="시간">{student.availableTimeSlots.join(', ')}</Row>
        <Row label="지역">{student.availableAreas.join(', ')}</Row>
        <Row label="업무">{student.preferredJobTypes.join(', ')}</Row>
        <Row label="알바 경험">
          {student.workExperience.length > 0 ? student.workExperience.join(' · ') : '경험 없음'}
        </Row>
        <Row label="시간제취업 허가 경험">
          {student.partTimePermissionExperience ? (
            <span className="text-emerald-700 dark:text-emerald-300">✓ 있음</span>
          ) : (
            <span className="text-zinc-500">없음</span>
          )}
        </Row>
      </div>

      <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
        "{student.introduction}"
      </p>

      <div className="mt-auto pt-5">
        {done ? (
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ 연락 요청 접수 — 관리자가 확인 후 학생에게 전달합니다
          </div>
        ) : (
          <button
            type="button"
            onClick={onClick}
            disabled={pending}
            className="h-11 w-full rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {pending ? '요청 중...' : '📩 연락 요청하기'}
          </button>
        )}
        <p className="mt-2 text-center text-xs text-zinc-500">
          연락처는 요청 후 관리자 확인을 거쳐 전달됩니다
        </p>
      </div>
    </article>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-16 shrink-0 text-zinc-500">{label}</span>
      <span className="flex flex-1 flex-wrap items-center gap-1 text-zinc-800 dark:text-zinc-200">
        {children}
      </span>
    </div>
  )
}

function Chip({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'info'
}) {
  return (
    <span
      className={
        variant === 'info'
          ? 'rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/40 dark:text-sky-300'
          : 'rounded-md bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800'
      }
    >
      {children}
    </span>
  )
}
