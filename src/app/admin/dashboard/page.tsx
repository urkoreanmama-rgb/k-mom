import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ count: studentCount }, { count: employerCount }, { count: reviewCount }] =
    await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
    ])

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">K-MOM 운영자</h1>
      <p className="mt-1 text-sm text-zinc-500">플랫폼 전체 현황</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="학생" value={studentCount ?? 0} />
        <Stat label="업주" value={employerCount ?? 0} />
        <Stat label="평가 누적" value={reviewCount ?? 0} />
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  )
}
