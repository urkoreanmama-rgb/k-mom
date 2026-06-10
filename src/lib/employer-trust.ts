// 업주 신뢰도 — 학생들의 실제 평가 데이터에서 자동 산정
// "K-MOM 배지는 매칭 데이터의 부산물" 모델 구현
//
// 평점 산정:
//   reviews 테이블에서 reviewee_id = employer_id 이고 revealed_at != null 인 평가들의
//   score 평균과 건수를 집계.
// 등급 산정:
//   GOLD:   20건 이상 + 평균 4.5+
//   SILVER:  5건 이상 + 평균 4.0+
//   BRONZE: 그 외 (신규 또는 평가 누적 중)

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, EmployerCertLevel } from './supabase/types'

export interface EmployerTrust {
  employerId: string
  reviewCount: number
  avgRating: number          // 0~5
  computedLevel: EmployerCertLevel
  // 다음 등급까지 남은 건수·점수 (UI 안내용)
  toNextLevel: {
    target: EmployerCertLevel | null
    needReviews: number
    needAvgAtLeast: number
  } | null
}

export function computeLevel(reviewCount: number, avgRating: number): EmployerCertLevel {
  if (reviewCount >= 20 && avgRating >= 4.5) return 'gold'
  if (reviewCount >= 5 && avgRating >= 4.0) return 'silver'
  return 'bronze'
}

function toNextLevel(
  reviewCount: number,
  avgRating: number,
  current: EmployerCertLevel,
): EmployerTrust['toNextLevel'] {
  if (current === 'bronze') {
    return {
      target: 'silver',
      needReviews: Math.max(0, 5 - reviewCount),
      needAvgAtLeast: 4.0,
    }
  }
  if (current === 'silver') {
    return {
      target: 'gold',
      needReviews: Math.max(0, 20 - reviewCount),
      needAvgAtLeast: 4.5,
    }
  }
  return null
}

/**
 * 한 명의 업주에 대한 신뢰 지표 계산
 */
export async function getEmployerTrust(
  supabase: SupabaseClient<Database>,
  employerId: string,
): Promise<EmployerTrust> {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('score')
    .eq('reviewee_id', employerId)
    .not('revealed_at', 'is', null)

  const list = reviews ?? []
  const count = list.length
  const sum = list.reduce((acc, r) => acc + (r.score ?? 0), 0)
  const avg = count > 0 ? sum / count : 0
  const level = computeLevel(count, avg)

  return {
    employerId,
    reviewCount: count,
    avgRating: avg,
    computedLevel: level,
    toNextLevel: toNextLevel(count, avg, level),
  }
}

/**
 * 여러 업주 한 번에 (학생 둘러보기에서 사용)
 */
export async function getEmployersTrust(
  supabase: SupabaseClient<Database>,
  employerIds: string[],
): Promise<Map<string, EmployerTrust>> {
  const map = new Map<string, EmployerTrust>()
  if (employerIds.length === 0) return map

  const { data: reviews } = await supabase
    .from('reviews')
    .select('reviewee_id, score')
    .in('reviewee_id', employerIds)
    .not('revealed_at', 'is', null)

  // 업주별로 집계
  const grouped = new Map<string, number[]>()
  for (const r of reviews ?? []) {
    const arr = grouped.get(r.reviewee_id as string) ?? []
    arr.push(r.score)
    grouped.set(r.reviewee_id as string, arr)
  }

  for (const id of employerIds) {
    const scores = grouped.get(id) ?? []
    const count = scores.length
    const sum = scores.reduce((a, b) => a + b, 0)
    const avg = count > 0 ? sum / count : 0
    const level = computeLevel(count, avg)
    map.set(id, {
      employerId: id,
      reviewCount: count,
      avgRating: avg,
      computedLevel: level,
      toNextLevel: toNextLevel(count, avg, level),
    })
  }

  return map
}

/**
 * 데모 시연용 — 데모 업주에 가짜 평점 보정
 * (실제 reviews 데이터가 부족해도 시연에서 멋지게 보이려고)
 *
 * employers.user_id 중 데모 계정의 경우 그 가게의 certification_level을
 * 기준으로 가상 reviewCount/avgRating 부여.
 */
export function fillDemoTrust(
  storedLevel: EmployerCertLevel,
  realCount: number,
  realAvg: number,
): { count: number; avg: number; computedLevel: EmployerCertLevel } {
  // 실 데이터가 충분하면 그대로 사용
  if (realCount >= 5) {
    return {
      count: realCount,
      avg: realAvg,
      computedLevel: computeLevel(realCount, realAvg),
    }
  }
  // 데모 보정 — 등급에 맞춘 가상 수치
  if (storedLevel === 'gold') return { count: 24, avg: 4.7, computedLevel: 'gold' }
  if (storedLevel === 'silver') return { count: 8, avg: 4.2, computedLevel: 'silver' }
  return {
    count: realCount,
    avg: realAvg,
    computedLevel: 'bronze',
  }
}
