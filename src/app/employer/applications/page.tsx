import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { markApplicationRead } from '@/app/actions/applications'

export const metadata = { title: '받은 이력서 · K-MOM' }

export default async function EmployerApplicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 받은 지원서 + 학생 user 정보 + 학생 프로필 + 이력서 본문
  const { data: applications } = await supabase
    .from('student_applications')
    .select('*')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })

  if (!applications || applications.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">받은 이력서</h1>
        <p className="mt-1 text-sm text-zinc-500">
          학생이 직접 이력서를 보내면 여기에 표시됩니다.
        </p>
        <div className="mt-10 rounded-2xl border-2 border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          📭 아직 받은 이력서가 없어요.
          <br />
          학생이 "업주 둘러보기"에서 우리 가게에 지원하면 알려드립니다.
        </div>
      </main>
    )
  }

  const studentIds = applications.map((a) => a.student_id)
  const [usersRes, profilesRes] = await Promise.all([
    supabase
      .from('users')
      .select('id, name, nationality, visa_type')
      .in('id', studentIds),
    supabase
      .from('student_profiles')
      .select('user_id, topik_level, verified_badge, resume_text, intro, skills, total_work_hours')
      .in('user_id', studentIds),
  ])
  const userMap = new Map((usersRes.data ?? []).map((u) => [u.id, u]))
  const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.user_id, p]))

  const unreadCount = applications.filter((a) => a.status === 'sent').length

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">받은 이력서</h1>
          <p className="mt-1 text-sm text-zinc-500">
            전체 {applications.length}건 · 안 읽음 {unreadCount}건
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {applications.map((a) => {
          const u = userMap.get(a.student_id)
          const p = profileMap.get(a.student_id)
          const isUnread = a.status === 'sent'

          return (
            <article
              key={a.id}
              className={
                isUnread
                  ? 'rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-5 dark:border-emerald-800 dark:bg-emerald-950/20'
                  : 'rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900'
              }
            >
              <header className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{u?.name ?? '(이름 없음)'}</h3>
                    {p?.verified_badge && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        ✓ 학교 인증
                      </span>
                    )}
                    {isUnread && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {u?.nationality ?? '-'} · {u?.visa_type ?? '비자 미입력'} ·
                    {' TOPIK '}
                    {p?.topik_level && p.topik_level !== 'none'
                      ? p.topik_level.replace('level_', '') + '급'
                      : '없음'}
                    {p?.total_work_hours ? ` · 누적 ${p.total_work_hours}h` : ''}
                  </p>
                </div>
                <div className="text-right text-xs text-zinc-500">
                  {new Date(a.created_at).toLocaleString('ko-KR')}
                </div>
              </header>

              {a.message && (
                <div className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                  💬 "{a.message}"
                </div>
              )}

              {/* 이력서 본문 */}
              <details className="mt-4 group" open={isUnread}>
                <summary className="cursor-pointer text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                  📄 이력서 펼쳐 보기
                </summary>
                <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  {p?.intro && (
                    <p className="mb-3 text-sm italic text-zinc-600 dark:text-zinc-400">
                      "{p.intro}"
                    </p>
                  )}
                  {p?.skills && p.skills.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {p.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-800 dark:text-zinc-200">
                    {p?.resume_text ?? '(이력서 본문이 없습니다)'}
                  </pre>
                </div>
              </details>

              <div className="mt-4 flex gap-2">
                {isUnread && (
                  <form
                    action={async () => {
                      'use server'
                      await markApplicationRead(a.id)
                    }}
                  >
                    <button className="h-9 rounded-lg bg-zinc-900 px-4 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900">
                      ✓ 읽음 처리
                    </button>
                  </form>
                )}
                <Link
                  href={`/employer/students/${a.student_id}`}
                  className="inline-flex h-9 items-center rounded-lg border border-zinc-300 px-4 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  학생 프로필 전체 보기 →
                </Link>
              </div>

              {a.read_at && (
                <p className="mt-2 text-xs text-zinc-400">
                  읽음: {new Date(a.read_at).toLocaleString('ko-KR')}
                </p>
              )}
            </article>
          )
        })}
      </div>
    </main>
  )
}
