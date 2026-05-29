// D-2 비자 합법 근무 시간 계산 (학기 중 기준)
// 기존 유학생-아르바이트-체커 로직 재사용
//
// 참고: 출입국관리법 제20조, 법무부 고시
// 방학 중 + TOPIK 4급 이상은 무제한 (별도 처리)

import type { TopikLevel, VisaType } from './supabase/types'

export interface WorkLimitInput {
  visaType: VisaType | null
  topikLevel: TopikLevel
  isSemester: boolean  // true: 학기 중 / false: 방학 중
}

/**
 * 주당 허용 근무 시간 반환 (학기 중 기준)
 * 방학 중 + TOPIK 4급↑ → Infinity 반환
 * 불가능한 경우 0 반환
 */
export function getWeeklyWorkLimit({ visaType, topikLevel, isSemester }: WorkLimitInput): number {
  if (!visaType) return 0
  if (visaType === 'other') return 0

  const topikLevelNum = topikLevelToNumber(topikLevel)

  // 방학 중 + TOPIK 4급 이상 → 무제한
  if (!isSemester && topikLevelNum >= 4) {
    return Infinity
  }

  // D-4 (어학연수)
  if (visaType === 'D-4') {
    if (topikLevelNum >= 5) return 25
    if (topikLevelNum === 4) return 20
    return 15
  }

  // D-2 계열
  // D-2-3 (석사), D-2-4 (박사) — 대학원생
  if (visaType === 'D-2-3' || visaType === 'D-2-4') {
    if (topikLevelNum >= 5) return 35
    if (topikLevelNum === 4) return 30
    return 15
  }

  // D-2 학사 (D-2-2) 및 기타 D-2 (방문학생 D-2-8 포함)
  if (topikLevelNum >= 5) return 30
  if (topikLevelNum === 4) return 25
  return 15
}

export function topikLevelToNumber(level: TopikLevel): number {
  switch (level) {
    case 'level_6': return 6
    case 'level_5': return 5
    case 'level_4': return 4
    case 'level_3': return 3
    case 'level_2': return 2
    case 'level_1': return 1
    default: return 0
  }
}

/**
 * 사람이 읽기 좋은 라벨
 */
export function formatVisaType(visa: VisaType | null): string {
  if (!visa) return '미입력'
  switch (visa) {
    case 'D-2-1': return 'D-2-1 전문학사'
    case 'D-2-2': return 'D-2-2 학사'
    case 'D-2-3': return 'D-2-3 석사'
    case 'D-2-4': return 'D-2-4 박사'
    case 'D-2-6': return 'D-2-6 교환학생'
    case 'D-2-7': return 'D-2-7 일·학습연계'
    case 'D-2-8': return 'D-2-8 단기유학'
    case 'D-4': return 'D-4 어학연수'
    case 'other': return '기타'
  }
}

export function formatTopikLevel(level: TopikLevel): string {
  if (level === 'none') return '없음/만료'
  return `${level.replace('level_', '')}급`
}
