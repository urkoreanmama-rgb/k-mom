import Link from 'next/link'
import { redirect } from 'next/navigation'
import { filterStudents, pickTopThree, type MatchCriteria } from '@/lib/match'
import CandidatePreviewCard from '@/components/CandidatePreviewCard'
import { getCurrentRequest } from '../actions'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: '후보 미리보기 · K-MOM' }

export default async function ResultPage() {
  const request = await getCurrentRequest()

  if (!request) redirect('/employer/match')
  if (request.payment_status !== 'paid') redirect('/employer/match/preview')

  const criteria = request.criteria as unknown as MatchCriteria
  const matched = filterStudents(criteria)
  const top3 = pickTopThree(matched)
  const overflowCount = Math.max(0, matched.length - 3)

  // revealed_candidate_ids 인라인 업데이트 (server action 호출 X — 페이지 렌더 안정성)
  try {
    const supabase = await createClient()
    await supabase
      .from('employer_match_requests')
      .update({ revealed_candidate_ids: top3.map((s) => s.studentId) })
      .eq('id', request.id)
  } catch (e) {
    // 업데이트 실패해도 카드는 보여줘야 함 — silent fail
    console.error('Failed to record revealed candidates:', e)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        STEP 4 / 4 · 결제 완료
      </p>
      <h1 className="mt-2 text-3xl font-bold">조건맞춤 후보 3명 미리보기</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        조건에 맞는 학생 중 학교 소속 확인 + TOPIK + 경험을 종합해 상위 3명을 보여드립니다.
        {overflowCount > 0 && ` (전체 ${matched.length}명 중)`}
      </p>

      <ol className="mt-6 grid grid-cols-4 gap-1 text-center text-xs">
        <li className="rounded-l-md bg-zinc-200 px-3 py-2 dark:bg-zinc-700">1. 조건 ✓</li>
        <li className="bg-zinc-200 px-3 py-2 dark:bg-zinc-700">2. 후보 수 ✓</li>
        <li className="bg-zinc-200 px-3 py-2 dark:bg-zinc-700">3. 결제 ✓</li>
        <li className="rounded-r-md bg-emerald-600 px-3 py-2 font-semibold text-white">
          4. 후보 ✓
        </li>
      </ol>

      <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
        ✓ 결제 완료 (1만 원) · 상품명: 조건맞춤 유학생 후보 미리보기팩
        {request.payment_transaction_id && (
          <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">
            거래ID: {request.payment_transaction_id.slice(0, 20)}...
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {top3.length === 0 ? (
          <div className="col-span-full rounded-xl border-2 border-dashed p-10 text-center text-sm text-zinc-500">
            조건에 맞는 후보가 없습니다.
          </div>
        ) : (
          top3.map((s) => <CandidatePreviewCard key={s.studentId} student={s} />)
        )}
      </div>

      {overflowCount > 0 && (
        <p className="mt-6 rounded-xl bg-zinc-50 px-4 py-3 text-center text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
          이 조건에 맞는 후보가 <strong>{overflowCount}명 더</strong> 있습니다. 추가 미리보기는
          K-MOM 운영팀에 문의해주세요.
        </p>
      )}

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p className="font-semibold text-zinc-700 dark:text-zinc-300">
          K-MOM은 조건에 맞는 후보를 사전 필터링합니다.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>학교 소속 확인 — 학생이 등록한 학교 정보를 표시합니다 (학교 보증 아님)</li>
          <li>D-2 시간제취업 기본 체크리스트가 적용됩니다</li>
          <li>최종 확인은 학교와 출입국 기준에 따릅니다</li>
          <li>연락처는 요청 후 관리자 확인을 거쳐 전달됩니다</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/employer/match"
          className="inline-flex h-11 items-center rounded-lg border border-zinc-300 px-5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          다른 조건으로 다시 찾기
        </Link>
      </div>
    </main>
  )
}
