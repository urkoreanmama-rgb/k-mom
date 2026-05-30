// 시연용 미리 채워진 3가지 시나리오
// 각 시나리오는 매칭 결과의 3가지 분기(충분 / 부족 / 매우 부족)에 대응

import type { MatchCriteria } from '@/lib/match'

export interface DemoScenario {
  id: string
  emoji: string
  title: string
  subtitle: string
  expectedCount: string // 사용자에게 미리 보여주는 예상 수
  tone: 'green' | 'amber' | 'red'
  criteria: MatchCriteria
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'enough',
    emoji: '🟢',
    title: '후보 충분 — 베트남어 식당',
    subtitle: '대림 베트남 식당, 평일 저녁 홀서빙',
    expectedCount: '5명 이상 예상',
    tone: 'green',
    criteria: {
      requiredLanguages: ['베트남어'],
      workDays: ['월', '수', '금', '토'],
      workTimeSlots: ['저녁'],
      areas: ['대림'],
      jobTypes: ['홀서빙', '주방 보조'],
      koreanLevel: '일상 대화 가능',
      duration: 'three_month',
      hourlyWage: 10500,
      hasForeignHiringExperience: 'has',
      docReadiness: 'ready',
    },
  },
  {
    id: 'few',
    emoji: '🟡',
    title: '후보 부족 — 러시아어 매장',
    subtitle: '명동 면세점, 주말 오전 상품 설명',
    expectedCount: '2~4명 예상',
    tone: 'amber',
    criteria: {
      requiredLanguages: ['러시아어'],
      workDays: ['토', '일'],
      workTimeSlots: ['오전'],
      areas: ['명동'],
      jobTypes: ['상품 설명', '계산'],
      koreanLevel: '중급 이상',
      duration: 'long',
      hourlyWage: 12000,
      hasForeignHiringExperience: 'none',
      docReadiness: 'needs_help',
    },
  },
  {
    id: 'short',
    emoji: '🔴',
    title: '매우 부족 — 심야 + 희귀 언어',
    subtitle: '몽골어 가능자 + 일요일 심야',
    expectedCount: '1명 이하',
    tone: 'red',
    criteria: {
      requiredLanguages: ['기타'],
      workDays: ['일'],
      workTimeSlots: ['저녁'],
      areas: ['홍대'],
      jobTypes: ['주방 보조'],
      koreanLevel: '중급 이상',
      duration: 'short',
      hourlyWage: 13000,
      hasForeignHiringExperience: 'none',
      docReadiness: 'unsure',
    },
  },
]

export function getScenarioById(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.id === id)
}
