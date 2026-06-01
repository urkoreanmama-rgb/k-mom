'use client'

import { useState } from 'react'
import type { DemoStudent } from '@/data/demo-students'
import TrustBadge from '@/components/TrustBadge'
import TrustScoreBar from '@/components/TrustScoreBar'
import RatingStars from '@/components/RatingStars'

interface StudentTrustCardProps {
  student: DemoStudent
  compact?: boolean
}

function nationalityFlag(nationality: string): string {
  const map: Record<string, string> = {
    '베트남': '🇻🇳',
    '중국': '🇨🇳',
    '미국': '🇺🇸',
    '캐나다': '🇨🇦',
    '러시아': '🇷🇺',
    '몽골': '🇲🇳',
    '우즈베키스탄': '🇺🇿',
    '기타': '🌏',
  }
  return map[nationality] || '🌏'
}

const contactStatusConfig = {
  available: { label: '연락 가능', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  pending: { label: '검토 중', color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  unavailable: { label: '현재 불가', color: 'text-zinc-500 dark:text-zinc-400', dot: 'bg-zinc-400' },
}

export default function StudentTrustCard({ student, compact = false }: StudentTrustCardProps) {
  const [expanded, setExpanded] = useState(false)
  const flag = nationalityFlag(student.nationality)
  const contactCfg = contactStatusConfig[student.contactStatus]

  if (compact) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl">{flag}</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{student.name}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">({student.nickname})</span>
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {student.visaType}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {student.badges.slice(0, 3).map((badge) => (
            <TrustBadge key={badge} label={badge} size="sm" />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>재고용 의향 <strong className="text-sky-600 dark:text-sky-400">{student.rehireRate}%</strong></span>
          <span>한국어 <strong className="text-zinc-700 dark:text-zinc-300">{student.koreanLevel}</strong></span>
          <span className="flex gap-0.5">
            {student.availableDays.map((d) => (
              <span key={d} className="rounded bg-sky-50 px-1 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{d}</span>
            ))}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{flag}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{student.name}</h3>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">({student.nickname})</span>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                {student.visaType}
              </span>
            </div>
            {/* Subheader */}
            <div className="mt-0.5 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>🏫 {student.schoolName}</span>
              {student.schoolVerified && (
                <span className="text-sky-600 dark:text-sky-400 text-xs font-medium">✔ 소속 확인</span>
              )}
              {student.professorRecommended && (
                <span className="text-amber-500 text-xs font-medium">⭐ 교수 추천</span>
              )}
            </div>
          </div>
        </div>
        {/* Contact status */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${contactCfg.color}`}>
          <span className={`w-2 h-2 rounded-full ${contactCfg.dot}`} />
          {contactCfg.label}
        </div>
      </div>

      {/* Trust scores */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">신뢰 점수</p>
        <TrustScoreBar label="성실도" score={student.reliabilityScore} color="sky" />
        <TrustScoreBar label="시간 준수" score={student.punctualityScore} color="sky" />
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">평균 업체 평점</span>
          <RatingStars rating={student.averageEmployerRating} size="sm" />
        </div>
      </div>

      {/* Rehire rate highlight */}
      <div className="rounded-xl bg-sky-50 px-4 py-3 dark:bg-sky-900/20">
        <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">재고용 의향</span>
        <p className="text-3xl font-bold text-sky-700 dark:text-sky-300">{student.rehireRate}%</p>
      </div>

      {/* Badges */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">배지</p>
        <div className="flex flex-wrap gap-1.5">
          {student.badges.map((badge) => (
            <TrustBadge key={badge} label={badge} size="sm" />
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">언어</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-zinc-600 dark:text-zinc-300">
            {student.languages.join(', ')}
          </span>
          <span className="text-zinc-400">·</span>
          <span className="text-violet-600 dark:text-violet-400 font-medium">
            한국어 {student.koreanLevel}
          </span>
          {student.topikLevel > 0 && (
            <>
              <span className="text-zinc-400">·</span>
              <span className="text-violet-600 dark:text-violet-400">
                TOPIK {student.topikLevel}급
              </span>
            </>
          )}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">근무 가능</p>
        <div className="flex flex-wrap gap-1">
          {student.availableDays.map((d) => (
            <span
              key={d}
              className="rounded-lg bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{student.availableTimeSlots.join(' / ')}</span>
          <span>·</span>
          <span>{student.availableAreas.join(', ')}</span>
        </div>
      </div>

      {/* Preferred job types */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">희망 직무</p>
        <div className="flex flex-wrap gap-1">
          {student.preferredJobTypes.map((j) => (
            <span
              key={j}
              className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-700 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-300"
            >
              {j}
            </span>
          ))}
        </div>
      </div>

      {/* Introduction */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">자기소개</p>
        <p
          className={`text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}
        >
          {student.introduction}
        </p>
        {student.introduction.length > 60 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs text-sky-600 dark:text-sky-400 hover:underline"
          >
            {expanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>

      {/* Work history (last 2) */}
      {student.workHistory.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">근무 이력</p>
          <div className="space-y-2">
            {student.workHistory.slice(0, 2).map((wh) => (
              <div
                key={wh.workId}
                className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800"
              >
                <div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{wh.companyName}</span>
                  <span className="ml-2 text-xs text-zinc-400">{wh.businessType}</span>
                </div>
                <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
                  <div>{wh.startDate} – {wh.endDate}</div>
                  <div className="flex items-center justify-end gap-1">
                    <span>{wh.jobType}</span>
                    {wh.status === 'active' && (
                      <span className="rounded-full bg-emerald-100 px-1.5 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">재직중</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
