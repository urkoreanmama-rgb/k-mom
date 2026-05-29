import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from './review-form'

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: workId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: work } = await supabase
    .from('work_histories')
    .select('*')
    .eq('id', workId)
    .maybeSingle()
  if (!work) notFound()
  if (![work.student_id, work.employer_id].includes(user.id)) notFound()

  const isEmployer = user.id === work.employer_id
  const counterpartId = isEmployer ? work.student_id : work.employer_id

  const [{ data: counterpart }, { data: myReview }, { data: theirReview }] =
    await Promise.all([
      supabase.from('users').select('name').eq('id', counterpartId).single(),
      supabase
        .from('reviews')
        .select('*')
        .eq('work_history_id', workId)
        .eq('reviewer_id', user.id)
        .maybeSingle(),
      supabase
        .from('reviews')
        .select('*')
        .eq('work_history_id', workId)
        .eq('reviewer_id', counterpartId)
        .maybeSingle(),
    ])

  const bothRevealed =
    !!myReview?.revealed_at || !!theirReview?.revealed_at

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href={isEmployer ? '/employer/work' : '/student/history'}
        className="text-sm text-zinc-500 hover:underline"
      >
        ← 내 알바로
      </Link>

      <h1 className="mt-4 text-3xl font-bold">평가</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {counterpart?.name} · {work.start_date} ~ {work.end_date ?? '진행중'}
      </p>

      {work.status !== 'completed' && (
        <div className="mt-8 rounded-2xl bg-amber-50 p-5 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          근무가 종료된 후에 평가할 수 있어요.
        </div>
      )}

      {work.status === 'completed' && !myReview && (
        <ReviewForm workId={workId} isEmployer={isEmployer} />
      )}

      {work.status === 'completed' && myReview && !bothRevealed && (
        <div className="mt-8 rounded-2xl bg-amber-50 p-5 dark:bg-amber-950/40">
          <p className="font-medium text-amber-900 dark:text-amber-200">
            내 평가는 제출됐어요 ✓
          </p>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
            상대방도 평가를 제출하면 양쪽이 동시에 공개됩니다 (편향 방지).
          </p>
        </div>
      )}

      {work.status === 'completed' && bothRevealed && (
        <div className="mt-8 space-y-4">
          <RevealedReview
            title={`나의 평가 (→ ${counterpart?.name})`}
            score={myReview!.score}
            comment={myReview!.comment}
            items={myReview!.items_json}
          />
          <RevealedReview
            title={`${counterpart?.name}의 평가 (→ 나)`}
            score={theirReview!.score}
            comment={theirReview!.comment}
            items={theirReview!.items_json}
            highlight
          />
        </div>
      )}
    </main>
  )
}

function RevealedReview({
  title,
  score,
  comment,
  items,
  highlight = false,
}: {
  title: string
  score: number
  comment: string | null
  items: Record<string, unknown> | null
  highlight?: boolean
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30'
          : 'rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900'
      }
    >
      <p className="text-xs text-zinc-500">{title}</p>
      <p className="mt-1 text-2xl font-bold">
        {'★'.repeat(score)}
        <span className="text-zinc-300">{'★'.repeat(5 - score)}</span>
        <span className="ml-2 text-sm font-normal text-zinc-500">{score}/5</span>
      </p>
      {comment && (
        <p className="mt-3 whitespace-pre-wrap text-sm">{comment}</p>
      )}
      {items && Object.keys(items).length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-1 text-xs text-zinc-600 dark:text-zinc-400">
          {Object.entries(items).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span>{labelOf(k)}</span>
              <span className="font-medium">{String(v)}/5</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function labelOf(key: string): string {
  return (
    {
      punctuality: '시간 준수',
      attitude: '업무 태도',
      communication: '한국어 소통',
      legality: '합법성',
      wage_payment: '임금 지급',
      environment: '근무 환경',
    } as Record<string, string>
  )[key] ?? key
}
