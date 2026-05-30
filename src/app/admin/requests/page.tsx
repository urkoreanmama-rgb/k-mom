import Link from 'next/link'
import { DEMO_REQUESTS, type PaymentStatus } from '@/data/demo-requests'

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

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const requests =
    status && status !== 'all'
      ? DEMO_REQUESTS.filter((r) => r.paymentStatus === status)
      : DEMO_REQUESTS

  const totals = {
    all: DEMO_REQUESTS.length,
    pending: DEMO_REQUESTS.filter((r) => r.paymentStatus === 'pending').length,
    paid: DEMO_REQUESTS.filter((r) => r.paymentStatus === 'paid').length,
    waitlist: DEMO_REQUESTS.filter((r) => r.paymentStatus === 'waitlist').length,
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Link
        href="/admin/dashboard"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← 대시보드로
      </Link>
      <h1 className="mt-4 text-3xl font-bold">업주 요청 관리</h1>
      <p className="mt-1 text-sm text-zinc-500">
        조건 검색 / 결제 / 연락 요청 / 대기 등록 — 모든 업주 요청 현황 (시현용 더미 30건)
      </p>

      {/* 필터 탭 */}
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <FilterTab href="/admin/requests" active={!status || status === 'all'} label={`전체 ${totals.all}`} />
        <FilterTab href="/admin/requests?status=pending" active={status === 'pending'} label={`조건 확인 ${totals.pending}`} />
        <FilterTab href="/admin/requests?status=paid" active={status === 'paid'} label={`결제 완료 ${totals.paid}`} />
        <FilterTab href="/admin/requests?status=waitlist" active={status === 'waitlist'} label={`대기 등록 ${totals.waitlist}`} />
      </div>

      {/* 요청 테이블 */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
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
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
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
            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-zinc-500">
                  해당 상태의 요청이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        ※ 위 데이터는 src/data/demo-requests.ts 의 시현용 더미입니다. 실제
        운영 시 Supabase의 employer_match_requests 테이블로 교체하세요.
      </p>
    </main>
  )
}

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400 ${className}`}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>
}

function FilterTab({
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
          ? 'rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white dark:bg-white dark:text-zinc-900'
          : 'rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
      }
    >
      {label}
    </Link>
  )
}
