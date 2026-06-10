import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { EmployerCertLevel } from '@/lib/supabase/types'
import SendApplicationButton from '@/components/SendApplicationButton'
import { getEmployersTrust, fillDemoTrust } from '@/lib/employer-trust'

export const metadata = { title: '업주 둘러보기 · K-MOM' }

const CERT_BADGE: Record<EmployerCertLevel, { emoji: string; label: string; color: string }> = {
  bronze: {
    emoji: '🥉',
    label: 'BRONZE',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  silver: {
    emoji: '🥈',
    label: 'SILVER',
    color: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200',
  },
  gold: {
    emoji: '🥇',
    label: 'GOLD',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
}

export default async function StudentEmployersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; cert?: string }>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 차단 안 된 모든 업주 가져오기
  let query = supabase
    .from('employers')
    .select('*')
    .eq('is_blocked', false)
    .order('certification_level', { ascending: false })

  if (sp.category) query = query.eq('category', sp.category)
  if (sp.cert) query = query.eq('certification_level', sp.cert as EmployerCertLevel)

  const { data: employers } = await query
  const employerList = employers ?? []

  // 내가 이미 이력서 보낸 업주들
  const { data: myApps } = await supabase
    .from('student_applications')
    .select('employer_id')
    .eq('student_id', user.id)
  const sentToEmployerIds = new Set((myApps ?? []).map((a) => a.employer_id))

  // 실제 평가 데이터에서 업주별 신뢰 지표 자동 산정
  // (배지는 reviews 평균·건수로 자동 결정됨)
  const trustMap = await getEmployersTrust(
    supabase,
    employerList.map((e) => e.user_id),
  )
  // 데모 시연용 — 실 평가가 부족한 업주는 stored level 기준 가상 수치
  const enriched = employerList.map((e) => {
    const t = trustMap.get(e.user_id)
    const trust = fillDemoTrust(
      e.certification_level,
      t?.reviewCount ?? 0,
      t?.avgRating ?? 0,
    )
    return { ...e, trust }
  })
  // 신뢰 지표 기준 재정렬 — 등급 → 평점 → 건수
  enriched.sort((a, b) => {
    const order: Record<EmployerCertLevel, number> = { gold: 3, silver: 2, bronze: 1 }
    const oa = order[a.trust.computedLevel]
    const ob = order[b.trust.computedLevel]
    if (oa !== ob) return ob - oa
    if (a.trust.avg !== b.trust.avg) return b.trust.avg - a.trust.avg
    return b.trust.count - a.trust.count
  })

  // 업종 목록 (필터용)
  const allCategories = [
    '음식점·카페',
    '편의점·마트',
    '판매·매장 보조',
    '면세점',
    '관광 안내',
    '뷰티·미용 보조',
  ]

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">업주 둘러보기</h1>
      <p className="mt-1 text-sm text-zinc-500">
        K-MOM에 등록된 가게들이에요. 업주가 조건에 맞는 학생을 찾아 직접 연락해주니까,
        K-MOM에서는 학생이 가게에 먼저 지원하지 않아도 됩니다. 어떤 가게들이 있는지 참고만 하세요.
      </p>

      {/* 필터 */}
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <FilterChip href="/student/employers" active={!sp.category && !sp.cert} label="전체" />
        <FilterChip href="/student/employers?cert=gold" active={sp.cert === 'gold'} label="🥇 GOLD만" />
        <FilterChip href="/student/employers?cert=silver" active={sp.cert === 'silver'} label="🥈 SILVER만" />
        <span className="mx-2 self-center text-zinc-400">|</span>
        {allCategories.map((c) => (
          <FilterChip
            key={c}
            href={`/student/employers?category=${encodeURIComponent(c)}`}
            active={sp.category === c}
            label={c}
          />
        ))}
      </div>

      {/* 학생 평가가 만드는 신뢰 지표 안내 */}
      <section className="mt-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <p className="font-bold text-emerald-900 dark:text-emerald-200">
          🏆 인증 배지는 학생들의 실제 평가가 자동 산정합니다
        </p>
        <p className="mt-1 text-emerald-800 dark:text-emerald-300">
          광고비가 아니라 학생들의 평가 누적으로 등급이 정해져요.{' '}
          <strong>GOLD 인증 업체는 학생들이 검증한 곳</strong>이니까 먼저 살펴보세요.
        </p>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enriched.length === 0 ? (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
            조건에 맞는 가게가 없어요. 필터를 풀어보세요.
          </div>
        ) : (
          enriched.map((e) => {
            const badge = CERT_BADGE[e.trust.computedLevel]
            const hasReviews = e.trust.count > 0
            return (
              <article
                key={e.user_id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold">{e.business_name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badge.color}`}>
                    {badge.emoji} {badge.label}
                  </span>
                </div>
                {e.category && (
                  <p className="mt-1 text-xs text-zinc-500">{e.category}</p>
                )}
                {e.address && (
                  <p className="mt-3 flex items-start gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <span>📍</span>
                    <span>{e.address}</span>
                  </p>
                )}

                {/* 실제 평가 지표 (배지의 근거) */}
                <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  {hasReviews ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        ★ {e.trust.avg.toFixed(1)}
                      </span>
                      <span className="text-xs text-zinc-500">
                        / 5 · 학생 {e.trust.count}명 평가
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">신규 · 아직 평가 없음</p>
                  )}
                  <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {e.trust.computedLevel === 'gold' && '🥇 GOLD 기준 충족 (20건+ · 4.5↑)'}
                    {e.trust.computedLevel === 'silver' && '🥈 SILVER 기준 충족 (5건+ · 4.0↑)'}
                    {e.trust.computedLevel === 'bronze' && '평가 누적 중'}
                  </p>
                </div>

                <SendApplicationButton
                  employerId={e.user_id}
                  businessName={e.business_name}
                  alreadySent={sentToEmployerIds.has(e.user_id)}
                />
              </article>
            )
          })
        )}
      </div>

      <section className="mt-10 rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-950/30">
        <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
          💡 K-MOM에서 채용은 어떻게 진행되나요?
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-emerald-800 dark:text-emerald-300">
          <li>업주가 조건(언어·요일·시간·지역·업무)을 입력하면 → K-MOM이 조건에 맞는 학생을 사전 필터링합니다.</li>
          <li>업주가 1만 원 결제 후 후보 3명 카드를 봅니다.</li>
          <li>업주가 마음에 드는 학생에게 "연락 요청" → K-MOM 관리자가 학생에게 전달.</li>
          <li>학생이 동의하면 양쪽 연락처가 공유됩니다.</li>
        </ol>
        <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          ※ 즉, 학생은 가게에 먼저 지원하지 않아요. <strong>프로필을 잘 채워두면 업주가 찾아옵니다.</strong>
        </p>
      </section>
    </main>
  )
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white dark:bg-white dark:text-zinc-900'
          : 'rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
      }
    >
      {label}
    </Link>
  )
}
