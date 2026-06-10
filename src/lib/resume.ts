// 잡코리아·알바몬 스타일 자체 이력서 양식
// student_profiles.resume_json 에 저장. 학생이 항목별로 채우고
// 업주에게 보낼 때 포맷팅된 형태로 표시.

export interface ResumeData {
  basicInfo: {
    fullName?: string
    nationality?: string
    visaType?: string
    birthYear?: number
    phone?: string
    address?: string
  }
  education: ResumeEducation[]
  experience: ResumeExperience[]
  certifications: ResumeCertification[]
  languages: ResumeLanguage[]
  selfIntroduction?: string
  preferences: {
    desiredHourlyWage?: number
    desiredAreas?: string[]
    desiredJobTypes?: string[]
    availabilityNote?: string
    // 구조화된 근무 조건 (업주 검색 매칭용)
    availableDays?: string[]    // ['월','화','수','목','금','토','일']
    availableTimeSlots?: string[] // ['오전','오후','저녁']
    workDuration?: string       // '단기' | '한 달 이상' | '세 달 이상' | '장기'
  }
}

export interface ResumeEducation {
  school: string
  major: string
  grade: string // '1학년' | '2학년' | '3학년' | '4학년' | '대학원' | '졸업' | '수료'
  startDate: string // 'YYYY-MM'
  endDate: string // 'YYYY-MM' or '재학중'
}

export interface ResumeExperience {
  company: string
  role: string
  startDate: string // 'YYYY-MM'
  endDate: string // 'YYYY-MM' or '재직중'
  description: string
}

export interface ResumeCertification {
  name: string
  issuer: string
  date: string // 'YYYY-MM'
}

export interface ResumeLanguage {
  language: string // '한국어' | '영어' | '베트남어' 등
  level: string // 'TOPIK 5급' | '비즈니스' | '일상 회화' | '원어민'
}

/**
 * 빈 이력서 초기값
 */
export function emptyResume(): ResumeData {
  return {
    basicInfo: {},
    education: [],
    experience: [],
    certifications: [],
    languages: [],
    selfIntroduction: '',
    preferences: {},
  }
}

/**
 * 이력서 완성도 (0~100%) — 폼 UX용
 */
export function resumeCompleteness(r: ResumeData): number {
  let filled = 0
  let total = 0

  // basicInfo 필수 4개
  total += 4
  if (r.basicInfo.fullName) filled++
  if (r.basicInfo.nationality) filled++
  if (r.basicInfo.visaType) filled++
  if (r.basicInfo.phone) filled++

  // education 최소 1개
  total += 1
  if (r.education.length > 0) filled++

  // experience 최소 1개 (없으면 OK지만 점수 +)
  total += 1
  if (r.experience.length > 0) filled++

  // languages 최소 1개
  total += 1
  if (r.languages.length > 0) filled++

  // selfIntroduction 30자 이상
  total += 1
  if ((r.selfIntroduction ?? '').trim().length >= 30) filled++

  return Math.round((filled / total) * 100)
}
