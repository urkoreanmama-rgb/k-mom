'use client'

import { useState } from 'react'
import type {
  DemoStudent,
  StudentBadge,
  WorkHistoryItem,
} from '@/data/demo-students'
import { requestContact } from '@/app/employer/match/actions'

const BADGE_META: Record<
  StudentBadge,
  { emoji: string; chip: string }
> = {
  '학교 소속 확인': {
    emoji: '🏫',
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  '교수 추천': {
    emoji: '👨‍🏫',
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  },
  'D-2 학생': {
    emoji: '🛂',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  },
  '한국어 일상대화 가능': {
    emoji: '🇰🇷',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  },
  '알바 이력 있음': {
    emoji: '💼',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  '성실도 우수': {
    emoji: '⭐',
    chip: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
  '재고용 의향 높음': {
    emoji: '🔄',
    chip: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  },
}

const RISK_META: Record<DemoStudent['noShowRisk'], { label: string; color: string }> = {
  low: {
    label: '낮음',
    color: 'text-emerald-700 dark:text-emerald-300',
  },
  medium: {
    label: '보통',
    color: 'text-amber-700 dark:text-amber-300',
  },
  high: {
    label: '높음',
    color: 'text-red-700 dark:text-red-300',
  },
}

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
      {/* 헤더 */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-zinc-400">
            {student.studentId}
          </p>
          <h3 className="mt-0.5 text-lg font-bold">{student.nickname}</h3>
          <p className="text-xs text-zinc-500">
            {student.nationality} · {student.visaType}
          </p>
          {student.schoolName && (
            <p className="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              🏫 {student.schoolName}
            </p>
          )}
        </div>
        {/* 평균 별점 + 재고용률 */}
        <div className="text-right">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold text-amber-500">
              {student.averageEmployerRating.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-400">/5</span>
          </div>
          <p className="text-[10px] text-zinc-500">평균 평가</p>
          <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            재고용 {student.rehireRate}%
          </p>
        </div>
      </header>

      {/* 배지 */}
      {student.badges && student.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {student.badges.map((b) => {
            const meta = BADGE_META[b]
            return (
              <span
                key={b}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}
              >
                <span>{meta.emoji}</span>
                <span>{b}</span>
              </span>
            )
          })}
        </div>
      )}

      {/* 신뢰 점수 그리드 */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-zinc-50 p-2 dark:bg-zinc-950">
        <ScoreBox
          label="신뢰도"
          value={student.reliabilityScore.toFixed(1)}
          color="emerald"
        />
        <ScoreBox
          label="시간준수"
          value={student.punctualityScore.toFixed(1)}
          color="sky"
        />
        <div className="rounded-lg bg-white px-2 py-1.5 text-center dark:bg-zinc-900">
          <p className="text-[10px] text-zinc-500">No-show</p>
          <p className={`text-base font-bold ${RISK_META[student.noShowRisk].color}`}>
            {RISK_META[student.noShowRisk].label}
          </p>
        </div>
      </div>

      {/* 조건 정보 */}
      <div className="mt-4 space-y-1.5 text-xs">
        <Row label="언어">
          {student.languages.map((l) => (
            <Chip key={l}>{l}</Chip>
          ))}
        </Row>
        <Row label="한국어">
          <Chip variant="info">
            {student.koreanLevel} · TOPIK {student.topikLevel || '없음'}
            {student.topikLevel ? '급' : ''}
          </Chip>
        </Row>
        <Row label="요일">{student.availableDays.join(' · ')}</Row>
        <Row label="시간">{student.availableTimeSlots.join(' · ')}</Row>
        <Row label="지역">{student.availableAreas.join(' · ')}</Row>
        <Row label="업무">{student.preferredJobTypes.join(' · ')}</Row>
      </div>

      {/* 강점 */}
      {student.strengths && student.strengths.length > 0 && (
        <div className="mt-3 rounded-lg bg-violet-50 px-3 py-2 dark:bg-violet-950/30">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:text-violet-400">
            강점
          </p>
          <p className="mt-0.5 text-xs text-violet-900 dark:text-violet-200">
            {student.strengths.join(' · ')}
          </p>
        </div>
      )}

      {/* 알바 이력 */}
      {student.workHistory && student.workHistory.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            알바 이력 ({student.totalWorkHours}h 누적)
          </p>
          <ul className="mt-1 space-y-1.5">
            {student.workHistory.slice(0, 3).map((w) => (
              <WorkHistoryRow key={w.workId} work={w} />
            ))}
          </ul>
        </div>
      )}

      {/* 자기소개 */}
      <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-sm italic text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
        "{student.introduction}"
      </p>

      {/* CTA */}
      <div className="mt-auto pt-5">
        {done ? (
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ 연락 요청 접수 — 관리자가 학생에게 전달합니다
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
        <p className="mt-2 text-center text-[11px] text-zinc-500">
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
    <div className="flex items-start gap-2">
      <span className="w-14 shrink-0 text-zinc-500">{label}</span>
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

function ScoreBox({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: 'emerald' | 'sky'
}) {
  const colorClass =
    color === 'emerald'
      ? 'text-emerald-700 dark:text-emerald-300'
      : 'text-sky-700 dark:text-sky-300'
  return (
    <div className="rounded-lg bg-white px-2 py-1.5 text-center dark:bg-zinc-900">
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p className={`text-base font-bold ${colorClass}`}>
        {value}
        <span className="ml-0.5 text-[10px] font-normal text-zinc-400">/5</span>
      </p>
    </div>
  )
}

function WorkHistoryRow({ work }: { work: WorkHistoryItem }) {
  const isActive = work.status === 'active'
  return (
    <li className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{work.companyName}</p>
          <p className="text-zinc-500">
            {work.businessType} · {work.jobType}
          </p>
        </div>
        <div className="text-right text-[10px] text-zinc-500">
          <p>
            {work.startDate} ~ {work.endDate}
          </p>
          {isActive && (
            <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              근무중
            </span>
          )}
          {work.rehireIntent && (
            <span className="mt-0.5 inline-block rounded-full bg-rose-100 px-1.5 py-0.5 font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
              🔄 재고용 의향
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
