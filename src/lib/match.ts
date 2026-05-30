// 업주 조건 → 학생 후보 필터링
// 명세: 필요 언어 / 요일 / 시간대 / 지역 / 업무유형 / 한국어 수준 / 기간 / 시급 / 채용경험 / 서류 준비
// 결과: 후보 수 + 후보 리스트 (단, 결제 전엔 리스트 노출 금지)

import {
  DEMO_STUDENTS,
  type Area,
  type DayOfWeek,
  type DemoStudent,
  type JobType,
  type KoreanLevel,
  type Language,
  type TimeSlot,
} from '@/data/demo-students'

export type WorkDuration = 'short' | 'one_month' | 'three_month' | 'long'
export type HiringExperience = 'has' | 'none'
export type DocReadiness = 'ready' | 'needs_help' | 'unsure'

export interface MatchCriteria {
  requiredLanguages: Language[]
  workDays: DayOfWeek[]
  workTimeSlots: TimeSlot[]
  areas: Area[] | string[]
  jobTypes: JobType[]
  koreanLevel: KoreanLevel | null
  duration: WorkDuration | null
  hourlyWage: number | null
  hasForeignHiringExperience: HiringExperience | null
  docReadiness: DocReadiness | null
}

/**
 * 한국어 수준 비교 (요청 수준 이상이면 통과)
 */
const KO_RANK: Record<KoreanLevel, number> = {
  기초: 1,
  '일상 대화 가능': 2,
  '중급 이상': 3,
}

/**
 * 학생 한 명이 조건에 맞는지 평가
 * — 강한 매치(필수): 언어 · 한국어수준 (있을 경우)
 * — 약한 매치(가산): 요일 · 시간대 · 지역 · 업무 (하나만 겹쳐도 통과)
 */
export function matchesCriteria(student: DemoStudent, c: MatchCriteria): boolean {
  // 학생이 공개 상태가 아니면 제외
  if (!student.isPublic || student.contactStatus !== 'available') return false

  // 1) 필요 언어 — 학생이 그 중 하나라도 사용 가능해야
  if (c.requiredLanguages.length > 0) {
    const ok = c.requiredLanguages.some((lang) => student.languages.includes(lang))
    if (!ok) return false
  }

  // 2) 한국어 수준 — 요청한 수준 이상이어야
  if (c.koreanLevel) {
    if (KO_RANK[student.koreanLevel] < KO_RANK[c.koreanLevel]) return false
  }

  // 3) 요일 — 겹치는 게 하나라도 있으면 OK
  if (c.workDays.length > 0) {
    const ok = c.workDays.some((d) => student.availableDays.includes(d))
    if (!ok) return false
  }

  // 4) 시간대 — 겹치는 게 하나라도 있으면 OK
  if (c.workTimeSlots.length > 0) {
    const ok = c.workTimeSlots.some((t) => student.availableTimeSlots.includes(t))
    if (!ok) return false
  }

  // 5) 지역 — 겹치는 게 하나라도 있으면 OK
  if (c.areas.length > 0) {
    const ok = c.areas.some((a) => student.availableAreas.includes(a as Area))
    if (!ok) return false
  }

  // 6) 업무 유형 — 겹치는 게 하나라도 있으면 OK
  if (c.jobTypes.length > 0) {
    const ok = c.jobTypes.some((j) => student.preferredJobTypes.includes(j))
    if (!ok) return false
  }

  // 시급, 기간, 채용경험, 서류준비 등은 시현용으로 필터에 적용하지 않음
  // (실제로는 학생 측 희망시급·기간 필드가 있어야 비교 가능)

  return true
}

export function filterStudents(c: MatchCriteria): DemoStudent[] {
  return DEMO_STUDENTS.filter((s) => matchesCriteria(s, c))
}

export function countMatching(c: MatchCriteria): number {
  return filterStudents(c).length
}

/**
 * 결제 후 보여줄 후보 3명을 선정하는 로직
 * — TOPIK 높은 순 + 학교 인증 우선 + 알바 경험 있는 순
 */
export function pickTopThree(students: DemoStudent[]): DemoStudent[] {
  return [...students]
    .sort((a, b) => {
      const verified = Number(b.schoolVerified) - Number(a.schoolVerified)
      if (verified !== 0) return verified
      const topik = b.topikLevel - a.topikLevel
      if (topik !== 0) return topik
      return b.workExperience.length - a.workExperience.length
    })
    .slice(0, 3)
}

/**
 * 후보 수에 따른 분기 메시지 (명세 그대로)
 */
export function getCountMessage(count: number): {
  level: 'enough' | 'few' | 'short'
  title: string
  detail: string
} {
  if (count >= 5) {
    return {
      level: 'enough',
      title: `조건에 맞는 유학생 후보가 현재 ${count}명 있습니다.`,
      detail: '1만 원 결제 후 후보 3명을 확인할 수 있습니다.',
    }
  }
  if (count >= 2) {
    return {
      level: 'few',
      title: `조건에 맞는 후보가 현재 ${count}명입니다.`,
      detail: '조건을 조금 넓히면 더 많은 후보를 볼 수 있습니다.',
    }
  }
  return {
    level: 'short',
    title: '현재 조건에 맞는 후보가 부족합니다.',
    detail: '무료 대기 등록을 하시겠어요? 조건이 맞는 후보가 등록되면 알려드립니다.',
  }
}
