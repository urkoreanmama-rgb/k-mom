// 합법 채용 가능성 사전 확인 — 학생 프로필을 게이트키퍼 체크리스트로 변환
import type { StudentProfile, User } from './supabase/types'
import {
  formatTopikLevel,
  formatVisaType,
  getWeeklyWorkLimit,
  topikLevelToNumber,
} from './visa-rules'

export type ComplianceLevel = 'ok' | 'warn' | 'fail' | 'info'

export interface ComplianceItem {
  key: string
  label: string
  value: string
  level: ComplianceLevel
  hint?: string
}

interface BuildInput {
  user: Pick<User, 'visa_type' | 'nationality'>
  profile: Pick<
    StudentProfile,
    'topik_level' | 'verified_badge' | 'total_work_hours'
  > | null
  // 학적/출입국 상태가 스키마에 없을 수도 있어서 옵셔널
  enrollmentStatus?: 'enrolled' | 'on_leave' | 'graduated' | 'unknown'
  immigrationPermitStatus?: 'not_applied' | 'applied' | 'approved' | 'unknown'
  isSemester?: boolean
}

export function buildComplianceChecklist({
  user,
  profile,
  enrollmentStatus = 'unknown',
  immigrationPermitStatus = 'unknown',
  isSemester = true,
}: BuildInput): ComplianceItem[] {
  const items: ComplianceItem[] = []

  // 1. 비자 유형
  if (!user.visa_type) {
    items.push({
      key: 'visa',
      label: '비자 유형',
      value: '미입력',
      level: 'fail',
      hint: '학생이 비자 종류를 입력해야 합법 채용 가능성을 확인할 수 있어요.',
    })
  } else if (user.visa_type === 'other') {
    items.push({
      key: 'visa',
      label: '비자 유형',
      value: '기타 (D-2/D-4 아님)',
      level: 'fail',
      hint: '시간제취업이 허용되지 않는 비자입니다.',
    })
  } else {
    items.push({
      key: 'visa',
      label: '비자 유형',
      value: `${formatVisaType(user.visa_type)} 확인됨`,
      level: 'ok',
    })
  }

  // 2. 학적 상태
  items.push({
    key: 'enrollment',
    label: '학적 상태',
    value:
      enrollmentStatus === 'enrolled'
        ? '재학중'
        : enrollmentStatus === 'on_leave'
          ? '휴학'
          : enrollmentStatus === 'graduated'
            ? '졸업/수료'
            : '미확인',
    level:
      enrollmentStatus === 'enrolled'
        ? 'ok'
        : enrollmentStatus === 'unknown'
          ? 'info'
          : 'fail',
    hint:
      enrollmentStatus === 'on_leave' || enrollmentStatus === 'graduated'
        ? '재학중이 아닌 경우 시간제취업 허가가 제한될 수 있습니다.'
        : enrollmentStatus === 'unknown'
          ? '학교 인증 연동 시 자동 확인됩니다.'
          : undefined,
  })

  // 3. TOPIK 수준
  const topik = profile?.topik_level ?? 'none'
  const topikNum = topikLevelToNumber(topik)
  items.push({
    key: 'topik',
    label: 'TOPIK 한국어 능력',
    value: formatTopikLevel(topik),
    level: topikNum >= 4 ? 'ok' : topik === 'none' ? 'warn' : 'warn',
    hint:
      topikNum >= 4
        ? '4급 이상 — 학기 중 추가 시간 허용됩니다.'
        : '4급 미만 — 학기 중 주 15시간으로 제한됩니다.',
  })

  // 4. 근무 가능 시간 (자동 계산)
  const semesterLimit = getWeeklyWorkLimit({
    visaType: user.visa_type,
    topikLevel: topik,
    isSemester: true,
  })
  const vacationLimit = getWeeklyWorkLimit({
    visaType: user.visa_type,
    topikLevel: topik,
    isSemester: false,
  })
  items.push({
    key: 'hours',
    label: '주당 합법 근무 시간',
    value:
      semesterLimit === 0
        ? '근무 불가'
        : `학기 ${semesterLimit}h / 방학 ${vacationLimit === Infinity ? '무제한' : vacationLimit + 'h'}`,
    level: semesterLimit === 0 ? 'fail' : 'ok',
    hint: isSemester
      ? `지금은 학기 중 기준이 적용됩니다. (주 ${semesterLimit}시간)`
      : `지금은 방학 중 기준이 적용됩니다.`,
  })

  // 5. 허용 업종 (D-2/D-4 공통 — 단순 표시)
  items.push({
    key: 'industry',
    label: '허용 업종 가이드',
    value: '제조·식당·번역·교육보조 등 (단순노무 가능)',
    level: 'info',
    hint: '유흥업·사행성·미풍양속 저해 업종은 불가. 자세한 업종은 출입국·외국인관서 안내를 참고하세요.',
  })

  // 6. 필요 서류 체크리스트
  items.push({
    key: 'docs',
    label: '필요 서류',
    value: '근로계약서 · 시간제취업 확인서 · 성적/출석증명 · TOPIK 증빙',
    level: 'info',
    hint: '서류 누락 시 출입국 허가가 반려될 수 있습니다.',
  })

  // 7. 학교 인증
  items.push({
    key: 'school',
    label: '학교 인증',
    value: profile?.verified_badge ? '인증 완료' : '미인증',
    level: profile?.verified_badge ? 'ok' : 'warn',
    hint: profile?.verified_badge
      ? '학교 국제처가 재학 사실을 확인했습니다.'
      : '학생이 소속 학교를 등록했지만 아직 학교 인증을 받지 않았습니다.',
  })

  // 8. 출입국 허가 상태
  items.push({
    key: 'immigration',
    label: '시간제취업 허가',
    value:
      immigrationPermitStatus === 'approved'
        ? '허가 완료'
        : immigrationPermitStatus === 'applied'
          ? '신청 중'
          : immigrationPermitStatus === 'not_applied'
            ? '신청 전'
            : '미확인',
    level:
      immigrationPermitStatus === 'approved'
        ? 'ok'
        : immigrationPermitStatus === 'applied'
          ? 'warn'
          : immigrationPermitStatus === 'not_applied'
            ? 'fail'
            : 'info',
    hint:
      immigrationPermitStatus === 'not_applied'
        ? '근무 시작 전 반드시 출입국·외국인관서장의 허가를 받아야 합니다 (출입국관리법 제20조).'
        : immigrationPermitStatus === 'applied'
          ? '허가 결과를 기다리는 중입니다. 결과 확인 후 근무 시작하세요.'
          : undefined,
  })

  return items
}

/**
 * 전체 합법성 종합 등급
 */
export function summarizeCompliance(items: ComplianceItem[]): {
  level: ComplianceLevel
  label: string
  okCount: number
  warnCount: number
  failCount: number
} {
  let okCount = 0
  let warnCount = 0
  let failCount = 0
  for (const item of items) {
    if (item.level === 'ok') okCount++
    else if (item.level === 'warn') warnCount++
    else if (item.level === 'fail') failCount++
  }
  if (failCount > 0) {
    return { level: 'fail', label: '채용 전 점검 필요', okCount, warnCount, failCount }
  }
  if (warnCount > 0) {
    return { level: 'warn', label: '주의 항목 있음', okCount, warnCount, failCount }
  }
  return { level: 'ok', label: '합법 채용 가능', okCount, warnCount, failCount }
}
