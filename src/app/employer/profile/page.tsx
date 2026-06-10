import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmployerProfileForm from './profile-form'
import { getEmployerTrust, fillDemoTrust } from '@/lib/employer-trust'

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

  // 실제 평가 데이터에서 신뢰 지표 자동 산정
  // (배지는 reviews 누적의 부산물)
  const rawTrust = await getEmployerTrust(supabase, user.id)
  const stored = employer?.certification_level ?? 'bronze'
  const demoFilled = fillDemoTrust(stored, rawTrust.reviewCount, rawTrust.avgRating)
  const isDemoFilled = rawTrust.reviewCount < 5 && demoFilled.count > 0

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
  const myBadge = certBadges[demoFilled.computedLevel]

  // 다음 등급까지
  let nextHint: { target: string; need: string } | null = null
  if (demoFilled.computedLevel === 'bronze') {
    const needCount = Math.max(0, 5 - demoFilled.count)
    nextHint = {
      target: '🥈 SILVER',
      need: needCount > 0
        ? `평가 ${needCount}건 더 + 평균 4.0↑ 유지`
        : `현재 건수 충족, 평균 4.0↑ 유지 시 자동 승급`,
    }
  } else if (demoFilled.computedLevel === 'silver') {
    const needCount = Math.max(0, 20 - demoFilled.count)
    nextHint = {
      target: '🥇 GOLD',
      need: needCount > 0
        ? `평가 ${needCount}건 더 + 평균 4.5↑ 유지`
        : `현재 건수 충족, 평균 4.5↑ 유지 시 자동 승급`,
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">내 가게 정보</h1>
      <p className="mt-1 text-sm text-zinc-500">
        학생이 보는 정보입니다. 정확하게 작성하면 학생이 안심하고 응합니다.
      </p>

      {/* 인증 등급 카드 — 실제 평가 근거 명시 */}
      <section className="mt-6 rounded-2xl border-2 border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              내 인증 등급
            </p>
            <p
              className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-bold ${myBadge.color}`}
            >
              {myBadge.label}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{myBadge.perks}</p>
          </div>
          {/* 실 평점·건수 */}
          <div className="rounded-xl bg-zinc-50 px-4 py-3 text-center dark:bg-zinc-800">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ★ {demoFilled.avg.toFixed(1)}
            </p>
            <p className="text-xs text-zinc-500">학생 {demoFilled.count}명 평가</p>
          </div>
        </div>

        {/* "왜 이 배지인가" 설명 */}
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs dark:bg-emerald-950/30">
          <p className="font-bold text-emerald-900 dark:text-emerald-200">
            💡 이 배지는 마케팅이 아닙니다 — 매칭 데이터의 부산물입니다
          </p>
          <p className="mt-1 text-emerald-800 dark:text-emerald-300">
            학생들이 실제로 일해보고 평가한 점수가 누적되면 자동으로 등급이 올라갑니다.
            등급이 오를수록 학생들이 먼저 지원하는 가게가 됩니다.
          </p>
        </div>

        {/* 다음 등급까지 진행도 */}
        {nextHint && (
          <div className="mt-3 rounded-xl border border-dashed border-zinc-300 p-3 text-xs dark:border-zinc-700">
            <p className="font-bold text-zinc-700 dark:text-zinc-300">
              다음 등급: {nextHint.target}
            </p>
            <p className="mt-1 text-zinc-500">{nextHint.need}</p>
          </div>
        )}

        {isDemoFilled && (
          <p className="mt-3 text-[11px] text-zinc-400">
            ※ 시연용 데모 평점입니다. 실제 운영 시에는 누적된 학생 평가만 반영됩니다.
          </p>
        )}
      </section>

      <EmployerProfileForm user={me!} employer={employer ?? null} />
    </main>
  )
}
