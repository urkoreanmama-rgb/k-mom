import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCountMessage, type MatchCriteria } from '@/lib/match'
import { getCurrentRequest, payAndReveal, joinWaitlist } from '../actions'

export const metadata = { title: '후보 수 확인 · K-MOM' }

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const request = await getCurrentRequest()
  if (!request) redirect('/employer/match')

  const criteria = request.criteria as unknown as MatchCriteria
  const count = request.candidate_count
  const msg = getCountMessage(count)

  const summary: { label: string; value: string }[] = [
    { label: '필요 언어', value: criteria.requiredLanguages.join(', ') || '-' },
    { label: '근무 요일', value: criteria.workDays.join(', ') || '-' },
    { label: '시간대', value: criteria.workTimeSlots.join(', ') || '-' },
    { label: '지역', value: (criteria.areas as string[]).join(', ') || '-' },
    { label: '업무', value: criteria.jobTypes.join(', ') || '-' },
    { label: '한국어 수준', value: criteria.koreanLevel ?? '-' },
  ]

  const stepColor = msg.level === 'enough' ? 'emerald' : msg.level === 'few' ? 'amber' : 'red'

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/employer/match" className="text-sm text-zinc-500 hover:underline">
        ← 조건 다시 입력
      </Link>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        STEP 2 / 4
      </p>
      <h1 className="mt-2 text-3xl font-bold">조건에 맞는 후보 수</h1>

      <ol className="mt-6 grid grid-cols-4 gap-1 text-center text-xs">
        <li className="rounded-l-md bg-zinc-200 px-3 py-2 dark:bg-zinc-700">1. 조건</li>
        <li className="bg-emerald-600 px-3 py-2 font-semibold text-white">2. 후보 수 ✓</li>
        <li className="border border-zinc-200 px-3 py-2 text-zinc-400 dark:border-zinc-800">3. 결제</li>
        <li className="rounded-r-md border border-zinc-200 px-3 py-2 text-zinc-400 dark:border-zinc-800">4. 후보</li>
      </ol>

      <section
        className={
          stepColor === 'emerald'
            ? 'mt-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-8 dark:border-emerald-800 dark:bg-emerald-950/30'
            : stepColor === 'amber'
              ? 'mt-8 rounded-2xl border-2 border-amber-300 bg-amber-50 p-8 dark:border-amber-800 dark:bg-amber-950/30'
              : 'mt-8 rounded-2xl border-2 border-red-300 bg-red-50 p-8 dark:border-red-800 dark:bg-red-950/30'
        }
      >
        <div className="flex items-center gap-4">
          <span
            className={
              stepColor === 'emerald'
                ? 'text-6xl font-bold text-emerald-700 dark:text-emerald-300'
                : stepColor === 'amber'
                  ? 'text-6xl font-bold text-amber-700 dark:text-amber-300'
                  : 'text-6xl font-bold text-red-700 dark:text-red-300'
            }
          >
            {count}
          </span>
          <span className="text-2xl text-zinc-500">명</span>
        </div>
        <p className="mt-4 text-lg font-semibold">{msg.title}</p>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{msg.detail}</p>

        {msg.level === 'enough' && (
          <form action={payAndReveal} className="mt-6">
            <button
              type="submit"
              className="inline-flex h-12 items-center rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              💳 1만 원 결제하고 후보 3명 미리보기 →
            </button>
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
              상품명: 조건맞춤 유학생 후보 미리보기팩
            </p>
          </form>
        )}

        {msg.level === 'few' && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/employer/match"
              className="inline-flex h-11 items-center rounded-lg border border-amber-700 bg-white px-5 text-sm font-medium text-amber-800 hover:bg-amber-50 dark:bg-zinc-900 dark:text-amber-200"
            >
              조건 넓혀서 다시 검색
            </Link>
            <form action={payAndReveal}>
              <button
                type="submit"
                className="inline-flex h-11 items-center rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                그래도 결제하고 보기 (1만 원)
              </button>
            </form>
          </div>
        )}

        {msg.level === 'short' && (
          <form action={joinWaitlist} className="mt-6">
            <button
              type="submit"
              className="inline-flex h-12 items-center rounded-lg bg-zinc-900 px-6 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
            >
              무료 대기 등록하기
            </button>
            <p className="mt-2 text-xs text-zinc-500">
              결제 없이 등록 — 조건에 맞는 후보가 들어오면 알려드립니다
            </p>
          </form>
        )}
      </section>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          결제 처리 중 오류가 발생했어요. 다시 시도해주세요.
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-semibold">입력한 조건</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {summary.map((s) => (
            <div key={s.label}>
              <dt className="text-xs text-zinc-500">{s.label}</dt>
              <dd className="font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
        {request.is_demo && (
          <p className="mt-3 text-xs text-zinc-400">
            ※ 이 요청은 시연 모드로 기록되었습니다 (admin 화면에서 구분 표시).
          </p>
        )}
      </section>
    </main>
  )
}
