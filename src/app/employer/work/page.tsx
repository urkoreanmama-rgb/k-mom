import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchMyWorks } from '@/lib/work'
import WorkHistoryCard from '@/components/WorkHistoryCard'
import Link from 'next/link'

export default async function EmployerWorkPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const works = await fetchMyWorks(supabase, user.id, 'employer')

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">진행 중인 채용</h1>
        <Link
          href="/employer/search"
          className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-300"
        >
          + 학생 프로필 열람
        </Link>
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        서류 준비 패키지 진행 상황과 근무 기록을 관리하세요.
      </p>

      <div className="mt-8 space-y-3">
        {works.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
            아직 진행 중인 채용이 없어요.
            <br />
            <Link href="/employer/search" className="mt-2 inline-block font-medium underline">
              학생 프로필 열람 →
            </Link>
          </div>
        ) : (
          works.map((w) => (
            <WorkHistoryCard
              key={w.work.id}
              work={w.work}
              counterpartName={w.counterpartName}
              counterpartLabel={w.counterpartLabel}
              viewer="employer"
              myReviewSubmitted={w.myReviewSubmitted}
              bothRevealed={w.bothRevealed}
            />
          ))
        )}
      </div>
    </main>
  )
}
