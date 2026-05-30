// 시현용 — 업주 매칭 흐름의 단계 간 상태를 쿠키에 저장
// 4단계 (조건 입력 → 후보 수 → 결제 → 후보 카드) 동안 criteria + paid 플래그 유지

import { cookies } from 'next/headers'
import type { MatchCriteria } from './match'

const CRITERIA_KEY = 'kmom_match_criteria'
const PAID_KEY = 'kmom_match_paid'

const COOKIE_OPTS = {
  httpOnly: false, // 클라이언트에서도 읽을 수 있게 (필요 시)
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60, // 1시간
}

export async function saveCriteria(criteria: MatchCriteria): Promise<void> {
  const store = await cookies()
  store.set(CRITERIA_KEY, JSON.stringify(criteria), COOKIE_OPTS)
}

export async function readCriteria(): Promise<MatchCriteria | null> {
  const store = await cookies()
  const raw = store.get(CRITERIA_KEY)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as MatchCriteria
  } catch {
    return null
  }
}

export async function markPaid(transactionId: string): Promise<void> {
  const store = await cookies()
  store.set(PAID_KEY, transactionId, COOKIE_OPTS)
}

export async function isPaid(): Promise<boolean> {
  const store = await cookies()
  return !!store.get(PAID_KEY)?.value
}

export async function clearSession(): Promise<void> {
  const store = await cookies()
  store.delete(CRITERIA_KEY)
  store.delete(PAID_KEY)
}
