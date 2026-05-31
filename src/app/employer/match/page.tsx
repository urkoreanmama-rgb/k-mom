import Link from 'next/link'
import MatchCriteriaForm from './criteria-form'
import ScenarioCards from './scenario-cards'
import { DEMO_MODE } from '@/lib/flags'

export const metadata = {
  title: '맞춤 후보 찾기 · K-MOM',
}

export default async function MatchEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← 홈으로
      </Link>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          STEP 1 / 4
        </p>
        <h1 className="mt-2 text-3xl font-bold">조건맞춤 유학생 후보 찾기</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          외국어 가능 D-2 유학생을 사전 필터링합니다. 조건에 맞는 후보 수를 먼저 확인하고,
          충분할 때만 1만 원에 후보 3명 미리보기를 받아보세요.
        </p>
      </header>

      {/* 진행 단계 표시 */}
      <ol className="mt-8 grid grid-cols-4 gap-1 text-center text-xs">
        {['조건 입력', '후보 수 확인', '결제', '후보 3명 확인'].map((step, i) => (
          <li
            key={step}
            className={
              i === 0
                ? 'rounded-l-md bg-emerald-600 px-3 py-2 font-semibold text-white'
                : 'border border-zinc-200 px-3 py-2 text-zinc-500 dark:border-zinc-800'
            }
          >
            {i + 1}. {step}
          </li>
        ))}
      </ol>

      {error === 'create_failed' && (
        <div className="mt-6 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm dark:border-red-800 dark:bg-red-950/30">
          <p className="font-semibold text-red-800 dark:text-red-200">
            ⚠️ 요청 저장 실패 — Supabase에 SQL을 먼저 실행해주세요
          </p>
          <p className="mt-1 text-xs text-red-700 dark:text-red-300">
            <code className="rounded bg-red-100 px-1 dark:bg-red-900/60">employer_match_requests</code> 테이블이 없습니다. Phase 2-A 통합 SQL을 실행하면 작동합니다.
          </p>
        </div>
      )}

      {/* 시연 모드 카드 — DEMO_MODE 켜진 경우만 노출 */}
      {DEMO_MODE && (
        <div className="mt-8">
          <ScenarioCards />
        </div>
      )}

      {/* 실 사용자는 폼을 메인, 시연자는 폼이 접혀있음 */}
      {DEMO_MODE ? (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            또는 조건을 직접 수정하기 (펼치기)
          </summary>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">
              아래 폼은 첫 시나리오 값으로 미리 채워져 있습니다. 일부만 바꿔서 다른 조건도 시험해보세요.
            </p>
            <div className="mt-4">
              <MatchCriteriaForm />
            </div>
          </div>
        </details>
      ) : (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <MatchCriteriaForm />
        </div>
      )}
    </main>
  )
}
