import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchMyWorks } from '@/lib/work'
import WorkHistoryCard from '@/components/WorkHistoryCard'

export default async function StudentHistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const works = await fetchMyWorks(supabase, user.id, 'student')

  const totalHours = works
    .filter((w) => w.work.status === 'completed')
    .reduce((sum, w) => {
      if (!w.work.end_date) return sum
      const weeks = Math.max(
        1,
        Math.round(
          (new Date(w.work.end_date).getTime() - new Date(w.work.start_date).getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        ),
      )
      return sum + (w.work.hours_per_week ?? 0) * weeks
    }, 0)

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">내 알바 이력</h1>
      <p className="mt-1 text-sm text-zinc-500">
        총 누적 근무 {totalHours.toLocaleString()}시간 · 완료 {works.filter((w) => w.work.status === 'completed').length}건
      </p>

      <div className="mt-8 space-y-3">
        {works.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
            아직 알바 이력이 없어요.
            <br />
            업주가 고용 등록을 하면 여기에 표시됩니다.
          </div>
        ) : (
          works.map((w) => (
            <WorkHistoryCard
              key={w.work.id}
              work={w.work}
              counterpartName={w.counterpartName}
              counterpartLabel={w.counterpartLabel}
              viewer="student"
              myReviewSubmitted={w.myReviewSubmitted}
              bothRevealed={w.bothRevealed}
            />
          ))
        )}
      </div>
    </main>
  )
}
