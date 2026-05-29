import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatTopikLevel, formatVisaType } from '@/lib/visa-rules'
import type { TopikLevel } from '@/lib/supabase/types'

export default async function EmployerSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ topik?: string; q?: string }>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let query = supabase
    .from('student_profiles')
    .select('user_id, topik_level, intro, skills, verified_badge, total_work_hours, users(name, nationality, visa_type)')
    .order('total_work_hours', { ascending: false })
    .limit(30)

  if (sp.topik && sp.topik !== 'all') {
    query = query.eq('topik_level', sp.topik as TopikLevel)
  }

  const { data: students, error } = await query

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">학생 프로필 열람</h1>
          <p className="mt-1 text-sm text-zinc-500">
            합법 채용 가능성을 카드 한 장에서 사전 확인하세요.
          </p>
        </div>
        <span className="text-sm text-zinc-500">{students?.length ?? 0}명</span>
      </div>

      <form className="mt-6 flex flex-wrap gap-3">
        <select
          name="topik"
          defaultValue={sp.topik ?? 'all'}
          className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="all">TOPIK 전체</option>
          <option value="level_6">6급</option>
          <option value="level_5">5급</option>
          <option value="level_4">4급</option>
          <option value="level_3">3급</option>
          <option value="none">없음</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          필터 적용
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error.message}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {(students ?? []).map((s) => {
          const u = Array.isArray(s.users) ? s.users[0] : s.users
          return (
            <Link
              key={s.user_id}
              href={`/employer/students/${s.user_id}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{u?.name ?? '이름 없음'}</p>
                  <p className="text-xs text-zinc-500">
                    {u?.nationality ?? '국적 미입력'} · {formatVisaType(u?.visa_type ?? null)}
                  </p>
                </div>
                {s.verified_badge && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    학교 인증
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
                {s.intro ?? '자기소개가 아직 없습니다.'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                  TOPIK {formatTopikLevel(s.topik_level)}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                  누적 {s.total_work_hours}h
                </span>
              </div>
            </Link>
          )
        })}
        {students?.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
            아직 등록된 학생이 없거나 필터에 맞는 학생이 없습니다.
          </div>
        )}
      </div>
    </main>
  )
}
