'use server'

import { redirect } from 'next/navigation'
import { processPayment } from '@/lib/payment'
import {
  clearSession,
  markPaid,
  readCriteria,
  saveCriteria,
} from '@/lib/match-session'
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
  MatchCriteria,
  WorkDuration,
} from '@/lib/match'

function getAll(fd: FormData, key: string): string[] {
  return fd.getAll(key).map(String)
}

/**
 * 시연 시나리오 ID를 받아 미리 정의된 criteria로 바로 진입
 * — 투자자 시연용 원클릭 버튼이 호출
 */
export async function submitDemoScenario(formData: FormData): Promise<void> {
  const id = String(formData.get('scenario_id') ?? '')
  const scenario = getScenarioById(id)
  if (!scenario) redirect('/employer/match')
  await saveCriteria(scenario.criteria)
  redirect('/employer/match/preview')
}

export async function submitCriteria(formData: FormData): Promise<void> {
  const criteria: MatchCriteria = {
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
  await saveCriteria(criteria)
  redirect('/employer/match/preview')
}

/**
 * 결제 시현 — 700ms 대기 후 paid 처리 → 결과 페이지로 이동
 */
export async function payAndReveal(): Promise<void> {
  const criteria = await readCriteria()
  if (!criteria) redirect('/employer/match')

  const result = await processPayment({
    orderId: `match_${Date.now()}`,
    productName: '조건맞춤 유학생 후보 미리보기팩',
    amount: 10000,
  })

  if (!result.success) {
    redirect('/employer/match/preview?error=payment_failed')
  }

  await markPaid(result.transactionId)
  redirect('/employer/match/result')
}

/**
 * 후보 부족 시 무료 대기 등록
 */
export async function joinWaitlist(): Promise<void> {
  // TODO: Supabase에 employer_id + criteria 저장 (지금은 시현용 noop)
  await clearSession()
  redirect('/employer/match/waitlist-done')
}

/**
 * 연락 요청 (시현용 — 알림만)
 */
export async function requestContact(_studentId: string): Promise<{ ok: true }> {
  // TODO: contact_requests 테이블 insert + 관리자 알림
  return { ok: true }
}
