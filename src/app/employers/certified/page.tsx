import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'K-MOM 플랫폼 기준 우수 업체 · K-MOM',
}

const CONDITIONS = [
  { label: '누적 평가 건수', standard: '5건 이상' },
  { label: '임금 지급 신뢰도', standard: '4.5점 이상' },
  { label: '근무 환경 점수', standard: '4.3점 이상' },
  { label: '서류 협조도', standard: '4.0점 이상' },
  { label: '학생 재근무 의향률', standard: '70% 이상' },
  { label: '주의 신호', standard: '없음' },
]

const BENEFITS = [
  '학생에게 우선 노출',
  'K-MOM 플랫폼 기준 우수 업체 배지 표시',
  '조건에 맞는 학생 후보 우선 추천',
  '학교 모니터링 화면에서 안전 업체로 표시',
  '반복 채용 시 서류 안내 간소화',
]

export default function CertifiedEmployersPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/employers"
        className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
      >
        ← 업체 목록으로
      </Link>

      {/* Header */}
      <div className="mt-6 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 mb-3">
          ✅ 우수 업체 제도 안내
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          K-MOM 플랫폼 기준 우수 업체
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          학생의 평가를 기반으로 K-MOM 플랫폼이 인정하는 신뢰 업체입니다.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
          현재 K-MOM 플랫폼 기준 우수 업체: 8곳
        </p>
      </div>

      {/* Conditions table */}
      <section className="mb-8 rounded-2xl border border-emerald-200 bg-white dark:border-emerald-800 dark:bg-zinc-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100 dark:border-emerald-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">우수 업체 선정 기준</h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            아래 6가지 조건을 모두 충족해야 합니다.
          </p>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {CONDITIONS.map((cond) => (
            <div key={cond.label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{cond.label}</span>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg">
                {cond.standard}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">우수 업체 혜택</h2>
        <ul className="space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold">
                ✓
              </span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Link to list */}
      <div className="mb-8 flex">
        <Link
          href="/employers?certified=true"
          className="inline-flex h-11 items-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 transition"
        >
          우수 업체 목록 보기 →
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          이 등급은 K-MOM 플랫폼 내 학생 평가를 기반으로 운영됩니다. 정부 또는 학교의 공식 인증이 아닙니다.
        </p>
      </div>
    </main>
  )
}
