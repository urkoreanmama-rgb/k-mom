// 업주 매칭 요청 CSV — 운영자용 (LIVE + 시드 통합)
import { createClient } from '@/lib/supabase/server'
import { csvResponse, toCsv, timestampSuffix } from '@/lib/csv'
import { DEMO_REQUESTS } from '@/data/demo-requests'
import type { MatchCriteria } from '@/lib/match'

export async function GET() {
  const supabase = await createClient()

  // 실 DB 요청
  const { data: liveRows } = await supabase
    .from('employer_match_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const rows: Array<Array<string | number | null | undefined>> = [
    [
      '소스',
      '요청 ID',
      '업주명/매장',
      '업종',
      '지역',
      '필요 언어',
      '근무 요일',
      '시간대',
      '업무',
      '후보 수',
      '결제 상태',
      '열람 학생 수',
      '연락 요청 학생 수',
      '관리자 메모',
      '시연 여부',
      '생성일',
    ],
  ]

  // LIVE 추가
  for (const r of liveRows ?? []) {
    const c = r.criteria as unknown as MatchCriteria
    rows.push([
      'LIVE',
      r.id.slice(0, 8),
      r.is_demo ? '(시연 모드)' : '실 사용자',
      '-',
      ((c?.areas as string[]) ?? []).join('·'),
      (c?.requiredLanguages ?? []).join('·'),
      (c?.workDays ?? []).join(''),
      (c?.workTimeSlots ?? []).join('·'),
      (c?.jobTypes ?? []).join('·'),
      r.candidate_count,
      r.payment_status,
      (r.revealed_candidate_ids as string[] | null)?.length ?? 0,
      (r.contact_requested_ids as string[] | null)?.length ?? 0,
      r.admin_note ?? '',
      r.is_demo ? 'Y' : 'N',
      r.created_at?.slice(0, 10) ?? '',
    ])
  }

  // 시드 추가
  for (const r of DEMO_REQUESTS) {
    rows.push([
      'SEED',
      r.id,
      `${r.employerName} / ${r.businessName}`,
      r.industry,
      String(r.area),
      r.requiredLanguages.join('·'),
      r.workDays.join(''),
      r.workTimeSlots.join('·'),
      r.jobTypes.join('·'),
      r.candidateCount,
      r.paymentStatus,
      r.revealedCandidateIds.length,
      r.contactRequestedIds.length,
      r.adminNote,
      'N',
      r.createdAt?.slice(0, 10) ?? '',
    ])
  }

  return csvResponse(
    `kmom-match-requests-${timestampSuffix()}.csv`,
    toCsv(rows),
  )
}
