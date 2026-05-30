import Link from 'next/link'
import MatchCriteriaForm from './criteria-form'

export const metadata = {
  title: '맞춤 후보 찾기 · K-MOM',
}

export default function MatchEntryPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/employer/search" className="text-sm text-zinc-500 hover:underline">
        ← 다른 흐름으로
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
        <p className="mt-1 text-xs text-zinc-500">
          ※ 일반 구인 공고의 대체가 아닙니다. 공고를 올리기 전 외국어 가능 유학생이 실제로
          있는지 확인하는 사전 검증 서비스입니다.
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

      <div className="mt-8">
        <MatchCriteriaForm />
      </div>
    </main>
  )
}
