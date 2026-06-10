'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DEMO_EMPLOYERS } from '@/data/demo-employers'
import EmployerTrustCard from '@/components/EmployerTrustCard'

const AREA_OPTIONS = ['전체', '대림', '건대', '홍대', '명동', '기타'] as const
const BUSINESS_TYPES = ['전체', '베트남 음식', '화장품', '카페', '분식', '편의점', '중식', '일식주점', '한식'] as const

export default function EmployersPage() {
  const [certifiedOnly, setCertifiedOnly] = useState(false)
  const [hideRiskFlag, setHideRiskFlag] = useState(false)
  const [areaFilter, setAreaFilter] = useState<string>('전체')
  const [bizTypeFilter, setBizTypeFilter] = useState<string>('전체')

  const filtered = useMemo(() => {
    return DEMO_EMPLOYERS.filter((e) => {
      if (certifiedOnly && !e.certified) return false
      if (hideRiskFlag && e.riskFlag) return false
      if (areaFilter !== '전체' && e.area !== areaFilter) return false
      if (bizTypeFilter !== '전체') {
        const lower = e.businessType.toLowerCase()
        const filterLower = bizTypeFilter.toLowerCase()
        if (!lower.includes(filterLower.replace('음식', '').trim())) {
          // more permissive match
          if (!e.businessType.includes(bizTypeFilter.replace('음식', '').trim())) return false
        }
      }
      return true
    })
  }, [certifiedOnly, hideRiskFlag, areaFilter, bizTypeFilter])

  const certifiedCount = filtered.filter((e) => e.certified).length
  const riskCount = filtered.filter((e) => e.riskFlag).length

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
          ← 대시보드
        </Link>
        <h1 className="mt-3 text-3xl font-bold">업체 신뢰 프로필</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          등록 업체 30곳 · K-MOM 인증 업체 8곳
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap gap-4">
          {/* Area */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">지역</p>
            <div className="flex flex-wrap gap-1.5">
              {AREA_OPTIONS.map((area) => (
                <button
                  key={area}
                  onClick={() => setAreaFilter(area)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    areaFilter === area
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Business type */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">업종</p>
            <div className="flex flex-wrap gap-1.5">
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setBizTypeFilter(type)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    bizTypeFilter === type
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-2 justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                onClick={() => setCertifiedOnly(!certifiedOnly)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                  certifiedOnly ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    certifiedOnly ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">인증 업체만</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                onClick={() => setHideRiskFlag(!hideRiskFlag)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                  hideRiskFlag ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    hideRiskFlag ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">주의 신호 제외</span>
            </label>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
        총{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">{filtered.length}곳</strong>
        {' '}·{' '}
        인증 업체{' '}
        <strong className="text-emerald-700 dark:text-emerald-300">{certifiedCount}곳</strong>
        {riskCount > 0 && (
          <>
            {' '}·{' '}
            주의 신호{' '}
            <strong className="text-orange-600 dark:text-orange-400">{riskCount}곳</strong>
          </>
        )}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
          <p className="text-zinc-500">조건에 맞는 업체가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((employer) => (
            <Link key={employer.companyId} href={`/employers/${employer.companyId}`} className="block hover:opacity-90 transition">
              <EmployerTrustCard employer={employer} compact={true} />
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
