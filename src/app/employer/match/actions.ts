'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { processPayment } from '@/lib/payment'
import { countMatching, type MatchCriteria } from '@/lib/match'
import { getScenarioById } from '@/data/demo-scenarios'
import type {
  Area,
  DayOfWeek,
  JobType,
  KoreanLevel,
  Language,
  TimeSlot,
} from '@/data/demo-students'
import type {
  DocReadiness,
  HiringExperience,
  WorkDuration,
} from '@/lib/match'

const REQUEST_COOKIE = 'kmom_match_request_id'
const COOKIE_OPTS = {
  httpOnly: false,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24시간 (시연 중 페이지 닫아도 살아있게)
}

function getAll(fd: FormData, key: string): string[] {
  return fd.getAll(key).map(String)
}

function buildCriteria(formData: FormData): MatchCriteria {
  return {
    requiredLanguages: getAll(formData, 'requiredLanguages') as Language[],
    workDays: getAll(formData, 'workDays') as DayOfWeek[],
    workTimeSlots: getAll(formData, 'workTimeSlots') as TimeSlot[],
    areas: getAll(formData, 'areas') as Area[],
    jobTypes: getAll(formData, 'jobTypes') as JobType[],
    koreanLevel: (formData.get('koreanLevel') as KoreanLevel) || null,
    duration: (formData.get('duration') as WorkDuration) || null,
    hourlyWage: Number(formData.get('hourlyWage')) || null,
    hasForeignHiringExperience:
      (formData.get('hasForeignHiringExperience') as HiringExperience) || null,
    docReadiness: (formData.get('docReadiness') as DocReadiness) || null,
  }
}

/**
 * DB에 employer_match_requests 생성 + 쿠키에 ID 저장
 * 로그인된 업주면 employer_id 자동 설정. 익명 시연은 employer_id=null + is_demo=true.
 */
async function createRequest(criteria: MatchCriteria, isDemo = false): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const candidateCount = countMatching(criteria)

  const { data, error } = await supabase
    .from('employer_match_requests')
    .insert({
      employer_id: user?.id ?? null,
      criteria: criteria as unknown as Record<string, unknown>,
      candidate_count: candidateCount,
      payment_status: 'pending',
      is_demo: isDemo || !user,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('createRequest failed:', error)
    return null
  }

  const store = await cookies()
  store.set(REQUEST_COOKIE, data.id, COOKIE_OPTS)
  return data.id
}

async function loadRequestId(): Promise<string | null> {
  const store = await cookies()
  return store.get(REQUEST_COOKIE)?.value ?? null
}

/**
 * Step 1 (직접 폼) — 조건 입력 → DB INSERT → preview로
 */
export async function submitCriteria(formData: FormData): Promise<void> {
  const criteria = buildCriteria(formData)
  const requestId = await createRequest(criteria)
  if (!requestId) redirect('/employer/match?error=create_failed')
  redirect('/employer/match/preview')
}

/**
 * Step 1 (시연 시나리오 원클릭) — 미리 정의된 조건으로 DB INSERT
 */
export async function submitDemoScenario(formData: FormData): Promise<void> {
  const id = String(formData.get('scenario_id') ?? '')
  const scenario = getScenarioById(id)
  if (!scenario) redirect('/employer/match')

  const requestId = await createRequest(scenario.criteria, true /* 시연 모드 마킹 */)
  if (!requestId) redirect('/employer/match?error=create_failed')
  redirect('/employer/match/preview')
}

/**
 * Step 3 — 1만 원 결제 시현 → DB의 payment_status 업데이트 → result로
 */
export async function payAndReveal(): Promise<void> {
  const requestId = await loadRequestId()
  if (!requestId) redirect('/employer/match')

  const supabase = await createClient()
  const { data: req } = await supabase
    .from('employer_match_requests')
    .select('id, candidate_count')
    .eq('id', requestId)
    .maybeSingle()
  if (!req) redirect('/employer/match')

  const result = await processPayment({
    orderId: `match_${requestId}`,
    productName: '조건맞춤 유학생 후보 미리보기팩',
    amount: 10000,
  })

  if (!result.success) {
    redirect('/employer/match/preview?error=payment_failed')
  }

  // 결제 성공 시 revealed_candidate_ids는 result 페이지에서 픽업 후 별도 update
  await supabase
    .from('employer_match_requests')
    .update({
      payment_status: 'paid',
      payment_transaction_id: result.transactionId,
      paid_at: result.paidAt,
    })
    .eq('id', requestId)

  revalidatePath('/admin/requests')
  redirect('/employer/match/result')
}

/**
 * Step 2 분기: 후보 부족 시 무료 대기 등록
 */
export async function joinWaitlist(): Promise<void> {
  const requestId = await loadRequestId()
  if (!requestId) redirect('/employer/match')

  const supabase = await createClient()
  await supabase
    .from('employer_match_requests')
    .update({ payment_status: 'waitlist', waitlisted: true })
    .eq('id', requestId)

  const store = await cookies()
  store.delete(REQUEST_COOKIE)
  revalidatePath('/admin/requests')
  redirect('/employer/match/waitlist-done')
}

/**
 * 후보 카드에서 연락 요청 클릭 — DB의 contact_requested_ids 배열에 추가
 */
export async function requestContact(studentId: string): Promise<{ ok: true }> {
  const requestId = await loadRequestId()
  if (!requestId) return { ok: true }

  const supabase = await createClient()
  const { data: req } = await supabase
    .from('employer_match_requests')
    .select('contact_requested_ids')
    .eq('id', requestId)
    .maybeSingle()
  if (!req) return { ok: true }

  const existing = (req.contact_requested_ids as string[]) ?? []
  if (!existing.includes(studentId)) {
    await supabase
      .from('employer_match_requests')
      .update({ contact_requested_ids: [...existing, studentId] })
      .eq('id', requestId)
    revalidatePath('/admin/requests')
  }
  return { ok: true }
}

/**
 * 결제 후 result 페이지가 호출 — 후보 3명 ID를 revealed_candidate_ids에 저장
 */
export async function recordRevealedCandidates(ids: string[]): Promise<void> {
  const requestId = await loadRequestId()
  if (!requestId) return
  const supabase = await createClient()
  await supabase
    .from('employer_match_requests')
    .update({ revealed_candidate_ids: ids })
    .eq('id', requestId)
  revalidatePath('/admin/requests')
}

/**
 * 현재 활성 요청 가져오기 (preview/result 페이지에서 사용)
 */
export async function getCurrentRequest() {
  const requestId = await loadRequestId()
  if (!requestId) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('employer_match_requests')
    .select('*')
    .eq('id', requestId)
    .maybeSingle()
  return data
}
