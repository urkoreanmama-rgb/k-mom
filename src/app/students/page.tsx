'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DEMO_STUDENTS } from '@/data/demo-students'
import type { Language, KoreanLevel, Area } from '@/data/demo-students'
import StudentTrustCard from '@/components/StudentTrustCard'

const LANGUAGE_OPTIONS: Array<Language | '전체'> = ['전체', '베트남어', '중국어', '영어', '러시아어', '기타']
const KOREAN_OPTIONS: Array<KoreanLevel | '전체'> = ['전체', '기초', '일상 대화 가능', '중급 이상']
const AREA_OPTIONS: Array<Area | '전체'> = ['전체', '대림', '건대', '홍대', '명동', '기타']

export default function StudentsPage() {
  const [langFilter, setLangFilter] = useState<Language | '전체'>('전체')
  const [koreanFilter, setKoreanFilter] = useState<KoreanLevel | '전체'>('전체')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [profRecommendedOnly, setProfRecommendedOnly] = useState(false)
  const [areaFilter, setAreaFilter] = useState<Area | '전체'>('전체')

  const filtered = useMemo(() => {
    return DEMO_STUDENTS.filter((s) => {
      if (!s.isPublic) return false
      if (langFilter !== '전체' && !s.languages.includes(langFilter)) return false
      if (koreanFilter !== '전체' && s.koreanLevel !== koreanFilter) return false
      if (verifiedOnly && !s.schoolVerified) return false
      if (profRecommendedOnly && !s.professorRecommended) return false
      if (areaFilter !== '전체' && !s.availableAreas.includes(areaFilter)) return false
      return true
    })
  }, [langFilter, koreanFilter, verifiedOnly, profRecommendedOnly, areaFilter])

  const verifiedCount = filtered.filter((s) => s.schoolVerified).length
  const profCount = filtered.filter((s) => s.professorRecommended).length

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-sky-600 dark:text-sky-400 hover:underline">
          ← 대시보드
        </Link>
        <h1 className="mt-3 text-3xl font-bold">학생 신뢰 프로필</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          D-2 유학생 50명의 신뢰 이력
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap gap-4">
          {/* Language filter */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">언어</p>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(lang as Language | '전체')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    langFilter === lang
                      ? 'bg-sky-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Korean level */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">한국어 수준</p>
            <div className="flex flex-wrap gap-1.5">
              {KOREAN_OPTIONS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setKoreanFilter(lvl as KoreanLevel | '전체')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    koreanFilter === lvl
                      ? 'bg-sky-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">지역</p>
            <div className="flex flex-wrap gap-1.5">
              {AREA_OPTIONS.map((area) => (
                <button
                  key={area}
                  onClick={() => setAreaFilter(area as Area | '전체')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    areaFilter === area
                      ? 'bg-sky-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle filters */}
          <div className="flex flex-col gap-2 justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                  verifiedOnly ? 'bg-sky-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    verifiedOnly ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">학교 인증만</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                onClick={() => setProfRecommendedOnly(!profRecommendedOnly)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                  profRecommendedOnly ? 'bg-sky-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    profRecommendedOnly ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">교수 추천만</span>
            </label>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
        총{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">{filtered.length}명</strong>
        {' '}·{' '}
        학교인증{' '}
        <strong className="text-sky-700 dark:text-sky-300">{verifiedCount}명</strong>
        {' '}·{' '}
        교수추천{' '}
        <strong className="text-amber-600 dark:text-amber-400">{profCount}명</strong>
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
          <p className="text-zinc-500">조건에 맞는 학생이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((student) => (
            <Link key={student.studentId} href={`/students/${student.studentId}`} className="block hover:opacity-90 transition">
              <StudentTrustCard student={student} compact={true} />
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
