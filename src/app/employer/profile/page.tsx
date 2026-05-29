import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmployerProfileForm from './profile-form'

export default async function EmployerProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: me }, { data: employer }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('employers').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  // 인증 등급별 가게 수 (참고용 통계)
  const certBadges: Record<string, { label: string; color: string; perks: string }> = {
    bronze: {
      label: '🥉 브론즈',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      perks: '기본 — 학생 일부 열람, 무료 연락 1회',
    },
    silver: {
      label: '🥈 실버',
      color: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200',
      perks: '쌍방 평가 5건 이상 + 평균 4.0↑ — 연락권 할인',
    },
    gold: {
      label: '🥇 골드',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      perks: '20건+ 평균 4.5↑ — 검색 우선 노출, 서류 자동화',
    },
  }
  const myBadge = certBadges[employer?.certification_level ?? 'bronze']

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">내 가게 정보</h1>
      <p className="mt-1 text-sm text-zinc-500">
        학생이 보는 정보입니다. 정확하게 작성하면 학생이 안심하고 응합니다.
      </p>

      {/* 인증 등급 카드 */}
      <section className="mt-6 rounded-2xl border-2 border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              내 인증 등급
            </p>
            <p className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-bold ${myBadge.color}`}>
              {myBadge.label}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{myBadge.perks}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          ※ 등급은 쌍방 평가가 누적되면 자동으로 산정됩니다.
        </p>
      </section>

      <EmployerProfileForm user={me!} employer={employer ?? null} />
    </main>
  )
}
