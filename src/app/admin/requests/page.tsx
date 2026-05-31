import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DEMO_REQUESTS, type DemoEmployerRequest, type PaymentStatus } from '@/data/demo-requests'
import type { MatchCriteria } from '@/lib/match'
import type {
  Area,
  DayOfWeek,
  JobType,
  Language,
  TimeSlot,
} from '@/data/demo-students'

export const metadata = { title: '업주 요청 관리 · K-MOM' }

const STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: '조건 확인만 (결제 전)',
  paid: '✓ 1만 원 결제 완료',
  refunded: '환불 완료',
  waitlist: '⏳ 대기 등록',
}
const STATUS_CHIP: Record<PaymentStatus, string> = {
  pending: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  refunded: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  waitlist: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
}

type CombinedRequest = DemoEmployerRequest & {
  source: 'seed' | 'live'
  isDemo?: boolean
}

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string }>
}) {
  const { status, source } = await searchParams
  const supabase = await createClient()

  // 실제 DB 요청 가져오기 (RLS: platform_admin이면 전체, 아니면 본인 요청만)
  const { data: dbReqs } = await supabase
    .from('employer_match_requests')
    .select('*')
    .order('created_at', { ascending: false })

  // DB 요청을 화면에 맞는 형태로 정규화
  const liveRequests: CombinedRequest[] = (dbReqs ?? []).map((r) => {
    const c = r.criteria as unknown as MatchCriteria
    return {
      id: r.id,
      employerName: r.is_demo ? '(시연 모드)' : '실 사용자',
      businessName: r.is_demo ? '시연 요청' : `요청 ${r.id.slice(0, 8)}`,
      industry: '-',
      area: ((c.areas as string[]) ?? []).join('·') || '-',
      requiredLanguages: (c.requiredLanguages ?? []) as Language[],
      workDays: (c.workDays ?? []) as DayOfWeek[],
      workTimeSlots: (c.workTimeSlots ?? []) as TimeSlot[],
      jobTypes: (c.jobTypes ?? []) as JobType[],
      candidateCount: r.candidate_count,
      paymentStatus: r.payment_status as PaymentStatus,
      revealedCandidateIds: (r.revealed_candidate_ids as string[]) ?? [],
      contactRequestedIds: (r.contact_requested_ids as string[]) ?? [],
      waitlisted: r.waitlisted,
      adminNote: r.admin_note ?? '',
      createdAt: r.created_at,
      source: 'live',
      isDemo: r.is_demo,
    }
  })

  const seedRequests: CombinedRequest[] = DEMO_REQUESTS.map((r) => ({
    ...r,
    source: 'seed',
  }))

  // 합치고 정렬
  let all = [...liveRequests, ...seedRequests].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  // 필터
  if (status && status !== 'all') {
    all = all.filter((r) => r.paymentStatus === status)
  }
  if (source === 'live') all = all.filter((r) => r.source === 'live')
  if (source === 'seed') all = all.filter((r) => r.source === 'seed')

  const totals = {
    all: liveRequests.length + seedRequests.length,
    pending: [...liveRequests, ...seedRequests].filter((r) => r.paymentStatus === 'pending').length,
    paid: [...liveRequests, ...seedRequests].filter((r) => r.paymentStatus === 'paid').length,
    waitlist: [...liveRequests, ...seedRequests].filter((r) => r.paymentStatus === 'waitlist').length,
    live: liveRequests.length,
    seed: seedRequests.length,
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Link href="/admin/dashboard" className="text-sm text-zinc-500 hover:underline">
        ← 대시보드로
      </Link>
      <h1 className="mt-4 text-3xl font-bold">업주 요청 관리</h1>
      <p className="mt-1 text-sm text-zinc-500">
        실제 DB 요청 + 시드 더미가 함께 표시됩니다. 필터로 분리해서 볼 수 있어요.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <FilterTab href="/admin/requests" active={!status || status === 'all'} label={`전체 ${totals.all}`} />
        <FilterTab href="/admin/requests?status=pending" active={status === 'pending'} label={`조건 확인 ${totals.pending}`} />
        <FilterTab href="/admin/requests?status=paid" active={status === 'paid'} label={`결제 완료 ${totals.paid}`} />
        <FilterTab href="/admin/requests?status=waitlist" active={status === 'waitlist'} label={`대기 등록 ${totals.waitlist}`} />
        <span className="mx-2 self-center text-zinc-400">|</span>
        <FilterTab href="/admin/requests?source=live" active={source === 'live'} label={`라이브 ${totals.live}`} />
        <FilterTab href="/admin/requests?source=seed" active={source === 'seed'} label={`시드 ${totals.seed}`} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <Th>소스</Th>
              <Th>업주·매장</Th>
              <Th>업종 · 지역</Th>
              <Th>조건</Th>
              <Th className="text-right">후보 수</Th>
              <Th>결제 상태</Th>
              <Th>열람·연락</Th>
              <Th>관리자 메모</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
            {all.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <Td>
                  <span
                    className={
                      r.source === 'live'
                        ? 'rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                        : 'rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800'
                    }
                  >
                    {r.source === 'live' ? '🟣 LIVE' : '시드'}
                  </span>
                  {r.isDemo && (
                    <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      DEMO
                    </span>
                  )}
                </Td>
                <Td>
                  <div className="font-medium">{r.businessName}</div>
                  <div className="text-xs text-zinc-500">{r.employerName}</div>
                </Td>
                <Td>
                  <div>{r.industry}</div>
                  <div className="text-xs text-zinc-500">{r.area}</div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {r.requiredLanguages.map((l) => (
                      <span
                        key={l}
                        className="rounded-md bg-sky-100 px-1.5 py-0.5 text-xs text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {r.workDays.join('')} · {r.workTimeSlots.join('·')} ·{' '}
                    {r.jobTypes.join('·')}
                  </div>
                </Td>
                <Td className="text-right">
                  <span
                    className={
                      r.candidateCount >= 5
                        ? 'font-bold text-emerald-700 dark:text-emerald-400'
                        : r.candidateCount >= 2
                          ? 'font-bold text-amber-700 dark:text-amber-400'
                          : 'font-bold text-red-700 dark:text-red-400'
                    }
                  >
                    {r.candidateCount}명
                  </span>
                </Td>
                <Td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CHIP[r.paymentStatus]}`}
                  >
                    {STATUS_LABEL[r.paymentStatus]}
                  </span>
                </Td>
                <Td>
                  <div className="text-xs">
                    열람 <strong>{r.revealedCandidateIds.length}</strong> · 연락{' '}
                    <strong>{r.contactRequestedIds.length}</strong>
                  </div>
                  {r.revealedCandidateIds.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-zinc-500">
                      {r.revealedCandidateIds.map((id) => (
                        <span key={id} className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
                          {id}
                        </span>
                      ))}
                    </div>
                  )}
                </Td>
                <Td>
                  <p className="max-w-[200px] text-xs italic text-zinc-600 dark:text-zinc-400">
                    {r.adminNote || '—'}
                  </p>
                </Td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-zinc-500">
                  해당 조건의 요청이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        ※ <strong>🟣 LIVE</strong>는 employer_match_requests 테이블의 실 데이터입니다. <strong>시드</strong>는 시현 안내용 더미 30건.
      </p>
    </main>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400 ${className}`}
    >
      {children}
    </th>
  )
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white dark:bg-white dark:text-zinc-900'
          : 'rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
      }
    >
      {label}
    </Link>
  )
}
