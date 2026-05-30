// 투자자 시현용 더미 학생 데이터 (50명)
// 명세: studentId, name, nickname, nationality, visaType, schoolVerified,
//      languages, koreanLevel, topikLevel, availableDays, availableTimeSlots,
//      availableAreas, preferredJobTypes, workExperience,
//      partTimePermissionExperience, introduction, isPublic, contactStatus
//
// 나중에 Supabase 실제 데이터로 교체할 수 있도록 인터페이스로 분리.

export type Language = '베트남어' | '중국어' | '영어' | '러시아어' | '기타'
export type KoreanLevel = '기초' | '일상 대화 가능' | '중급 이상'
export type DayOfWeek = '월' | '화' | '수' | '목' | '금' | '토' | '일'
export type TimeSlot = '오전' | '오후' | '저녁'
export type Area = '대림' | '건대' | '홍대' | '명동' | '기타'
export type JobType =
  | '홀서빙'
  | '손님 응대'
  | '계산'
  | '상품 설명'
  | '주방 보조'
  | '기타'
export type ContactStatus = 'available' | 'pending' | 'unavailable'

export interface DemoStudent {
  studentId: string
  name: string
  nickname: string
  nationality: string
  visaType: 'D-2-1' | 'D-2-2' | 'D-2-3' | 'D-2-4' | 'D-4'
  schoolVerified: boolean
  languages: Language[]
  koreanLevel: KoreanLevel
  topikLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6
  availableDays: DayOfWeek[]
  availableTimeSlots: TimeSlot[]
  availableAreas: Area[]
  preferredJobTypes: JobType[]
  workExperience: string[] // 예: ['카페 6개월', '편의점 3개월']
  partTimePermissionExperience: boolean
  introduction: string
  isPublic: boolean
  contactStatus: ContactStatus
}

const WEEKDAYS: DayOfWeek[] = ['월', '화', '수', '목', '금']
const WEEKEND: DayOfWeek[] = ['토', '일']
const ALL_DAYS: DayOfWeek[] = ['월', '화', '수', '목', '금', '토', '일']

// 시드 학생들 — 50명. 실제 사용 시 Supabase student_profiles 쿼리로 교체
export const DEMO_STUDENTS: DemoStudent[] = [
  // ── 베트남어 가능 학생들 (대림 중심) ──
  {
    studentId: 's-001',
    name: '응우옌 티 화',
    nickname: '화',
    nationality: '베트남',
    visaType: 'D-2-2',
    schoolVerified: true,
    languages: ['베트남어', '영어'],
    koreanLevel: '중급 이상',
    topikLevel: 4,
    availableDays: ['월', '수', '금', '토'],
    availableTimeSlots: ['오후', '저녁'],
    availableAreas: ['대림', '건대'],
    preferredJobTypes: ['홀서빙', '손님 응대', '계산'],
    workExperience: ['베트남 식당 홀 8개월', '카페 3개월'],
    partTimePermissionExperience: true,
    introduction: '베트남 동포 가게에서 일한 경험 있어요. 손님 응대 자신 있습니다.',
    isPublic: true,
    contactStatus: 'available',
  },
  {
    studentId: 's-002',
    name: '레 반 민',
    nickname: '민',
    nationality: '베트남',
    visaType: 'D-2-2',
    schoolVerified: true,
    languages: ['베트남어'],
    koreanLevel: '일상 대화 가능',
    topikLevel: 3,
    availableDays: ['화', '목', '금', '토', '일'],
    availableTimeSlots: ['저녁'],
    availableAreas: ['대림'],
    preferredJobTypes: ['주방 보조', '홀서빙'],
    workExperience: ['포(쌀국수) 식당 1년'],
    partTimePermissionExperience: true,
    introduction: '주방 일 자신 있어요. 베트남 음식 메뉴 잘 알고 있습니다.',
    isPublic: true,
    contactStatus: 'available',
  },
  {
    studentId: 's-003',
    name: '팜 응옥 안',
    nickname: '안',
    nationality: '베트남',
    visaType: 'D-2-3',
    schoolVerified: true,
    languages: ['베트남어', '영어', '중국어'],
    koreanLevel: '중급 이상',
    topikLevel: 5,
    availableDays: ALL_DAYS,
    availableTimeSlots: ['오전', '오후'],
    availableAreas: ['홍대', '대림', '명동'],
    preferredJobTypes: ['상품 설명', '손님 응대', '계산'],
    workExperience: ['면세점 화장품 매장 5개월'],
    partTimePermissionExperience: true,
    introduction: '면세점 경험 있고 3개 언어 가능합니다. 책임감 있게 일합니다.',
    isPublic: true,
    contactStatus: 'available',
  },
  // ── 중국어 가능 (명동·홍대 위주) ──
  {
    studentId: 's-004',
    name: '왕 지아',
    nickname: 'Jia',
    nationality: '중국',
    visaType: 'D-2-2',
    schoolVerified: true,
    languages: ['중국어', '영어'],
    koreanLevel: '중급 이상',
    topikLevel: 5,
    availableDays: ['월', '수', '목', '토'],
    availableTimeSlots: ['오후', '저녁'],
    availableAreas: ['명동', '홍대'],
    preferredJobTypes: ['상품 설명', '손님 응대'],
    workExperience: ['화장품 매장 4개월'],
    partTimePermissionExperience: true,
    introduction: '중국인 관광객 많은 곳 추천. K뷰티 상품에 관심 많아요.',
    isPublic: true,
    contactStatus: 'available',
  },
  {
    studentId: 's-005',
    name: '리 시아오',
    nickname: 'Xiao',
    nationality: '중국',
    visaType: 'D-2-2',
    schoolVerified: false,
    languages: ['중국어'],
    koreanLevel: '일상 대화 가능',
    topikLevel: 3,
    availableDays: ['금', '토', '일'],
    availableTimeSlots: ['저녁'],
    availableAreas: ['명동'],
    preferredJobTypes: ['홀서빙', '계산'],
    workExperience: [],
    partTimePermissionExperience: false,
    introduction: '주말 일자리 찾고 있어요.',
    isPublic: true,
    contactStatus: 'available',
  },
  {
    studentId: 's-006',
    name: '장 위안',
    nickname: '유안',
    nationality: '중국',
    visaType: 'D-2-3',
    schoolVerified: true,
    languages: ['중국어', '영어'],
    koreanLevel: '중급 이상',
    topikLevel: 6,
    availableDays: ['화', '목', '토'],
    availableTimeSlots: ['오전', '오후'],
    availableAreas: ['홍대', '명동'],
    preferredJobTypes: ['상품 설명', '손님 응대'],
    workExperience: ['편의점 6개월', '카페 4개월'],
    partTimePermissionExperience: true,
    introduction: '한국 8년차. 통역도 도와드릴 수 있어요.',
    isPublic: true,
    contactStatus: 'available',
  },
  // ── 영어권 (홍대·이태원·전 지역) ──
  {
    studentId: 's-007',
    name: 'James O\'Brien',
    nickname: 'James',
    nationality: '미국',
    visaType: 'D-4',
    schoolVerified: true,
    languages: ['영어'],
    koreanLevel: '기초',
    topikLevel: 2,
    availableDays: ['월', '화', '수', '목'],
    availableTimeSlots: ['저녁'],
    availableAreas: ['홍대', '기타'],
    preferredJobTypes: ['손님 응대', '기타'],
    workExperience: ['바리스타 1년 (본국)'],
    partTimePermissionExperience: true,
    introduction: 'Native English speaker. 한국어 공부 중. 카페 경험.',
    isPublic: true,
    contactStatus: 'available',
  },
  {
    studentId: 's-008',
    name: 'Sarah Kim',
    nickname: 'Sarah',
    nationality: '캐나다',
    visaType: 'D-2-2',
    schoolVerified: true,
    languages: ['영어'],
    koreanLevel: '중급 이상',
    topikLevel: 4,
    availableDays: ['수', '금', '토', '일'],
    availableTimeSlots: ['오후', '저녁'],
    availableAreas: ['홍대', '건대'],
    preferredJobTypes: ['홀서빙', '상품 설명'],
    workExperience: ['레스토랑 홀 10개월'],
    partTimePermissionExperience: true,
    introduction: '교포 출신. 영어 원어민이면서 한국 문화 잘 알아요.',
    isPublic: true,
    contactStatus: 'available',
  },
  // ── 러시아어권 (대림·동대문) ──
  {
    studentId: 's-009',
    name: '알렉세이 페트로프',
    nickname: 'Alex',
    nationality: '우즈베키스탄',
    visaType: 'D-2-2',
    schoolVerified: true,
    languages: ['러시아어', '영어'],
    koreanLevel: '일상 대화 가능',
    topikLevel: 3,
    availableDays: ['월', '수', '금'],
    availableTimeSlots: ['오후', '저녁'],
    availableAreas: ['대림', '기타'],
    preferredJobTypes: ['주방 보조', '홀서빙'],
    workExperience: ['중앙아시아 식당 4개월'],
    partTimePermissionExperience: true,
    introduction: '러시아어권 손님 응대 가능합니다.',
    isPublic: true,
    contactStatus: 'available',
  },
  {
    studentId: 's-010',
    name: '엘레나 이바노바',
    nickname: 'Elena',
    nationality: '카자흐스탄',
    visaType: 'D-2-3',
    schoolVerified: true,
    languages: ['러시아어', '영어'],
    koreanLevel: '중급 이상',
    topikLevel: 4,
    availableDays: ['화', '목', '토'],
    availableTimeSlots: ['오전', '오후'],
    availableAreas: ['홍대', '명동'],
    preferredJobTypes: ['상품 설명', '손님 응대'],
    workExperience: ['뷰티 매장 6개월'],
    partTimePermissionExperience: false,
    introduction: '러시아어 통역도 가능. 뷰티 매장 경험.',
    isPublic: true,
    contactStatus: 'available',
  },
]

// 학생 수를 더 채워서 50명 만들기 — 위 10명을 기반으로 변형
const NATIONALITIES = ['베트남', '중국', '몽골', '우즈베키스탄', '카자흐스탄', '미국', '러시아', '인도네시아', '필리핀', '태국']
const NAMES_BY_NAT: Record<string, { name: string; nick: string }[]> = {
  베트남: [
    { name: '응우옌 반 호아', nick: '호아' },
    { name: '쩐 티 란', nick: '란' },
    { name: '레 티 응안', nick: '응안' },
    { name: '팜 반 두엑', nick: '두엑' },
  ],
  중국: [
    { name: '왕 페이', nick: 'Pei' },
    { name: '천 위', nick: 'Yu' },
    { name: '리 후이', nick: 'Hui' },
    { name: '장 멍', nick: 'Meng' },
  ],
  몽골: [
    { name: '바트', nick: 'Bat' },
    { name: '오트곤', nick: 'Otgon' },
  ],
  우즈베키스탄: [
    { name: '아지즈', nick: 'Aziz' },
    { name: '나르기자', nick: 'Nargiza' },
  ],
  카자흐스탄: [
    { name: '아이굴', nick: 'Aigul' },
    { name: '다나르', nick: 'Danar' },
  ],
  미국: [
    { name: 'David Lee', nick: 'David' },
    { name: 'Emma Park', nick: 'Emma' },
  ],
  러시아: [
    { name: '안나 페트로바', nick: 'Anna' },
    { name: '드미트리 코노프', nick: 'Dmitri' },
  ],
  인도네시아: [{ name: 'Putri Sari', nick: 'Putri' }],
  필리핀: [{ name: 'Maria Santos', nick: 'Maria' }],
  태국: [{ name: 'Niran Sookjai', nick: 'Niran' }],
}

const NAT_TO_LANG: Record<string, Language[]> = {
  베트남: ['베트남어'],
  중국: ['중국어'],
  몽골: ['기타'],
  우즈베키스탄: ['러시아어'],
  카자흐스탄: ['러시아어'],
  미국: ['영어'],
  러시아: ['러시아어'],
  인도네시아: ['영어'],
  필리핀: ['영어'],
  태국: ['기타'],
}

let nextId = 11
for (const nat of NATIONALITIES) {
  for (const person of NAMES_BY_NAT[nat] ?? []) {
    if (DEMO_STUDENTS.length >= 50) break
    const langs: Language[] = [...NAT_TO_LANG[nat]]
    if (Math.random() > 0.4) langs.push('영어')
    const topik = (Math.random() > 0.5 ? 4 : 3) as 3 | 4
    DEMO_STUDENTS.push({
      studentId: `s-${String(nextId).padStart(3, '0')}`,
      name: person.name,
      nickname: person.nick,
      nationality: nat,
      visaType: Math.random() > 0.7 ? 'D-2-3' : 'D-2-2',
      schoolVerified: Math.random() > 0.25,
      languages: langs,
      koreanLevel: topik >= 4 ? '중급 이상' : '일상 대화 가능',
      topikLevel: topik,
      availableDays:
        Math.random() > 0.5 ? WEEKDAYS : Math.random() > 0.5 ? WEEKEND : ALL_DAYS,
      availableTimeSlots:
        Math.random() > 0.6 ? ['오후', '저녁'] : Math.random() > 0.5 ? ['오전'] : ['저녁'],
      availableAreas: [
        ['대림', '건대', '홍대', '명동'][Math.floor(Math.random() * 4)] as Area,
        'kitchen-fallback',
      ].filter((v) => v !== 'kitchen-fallback') as Area[],
      preferredJobTypes: ['홀서빙', '손님 응대', '계산', '상품 설명', '주방 보조'].slice(
        0,
        2 + Math.floor(Math.random() * 2),
      ) as JobType[],
      workExperience: Math.random() > 0.3 ? ['편의점 4개월'] : [],
      partTimePermissionExperience: Math.random() > 0.3,
      introduction: `${nat} 출신 유학생. 성실하게 일할 자신 있어요.`,
      isPublic: true,
      contactStatus: 'available',
    })
    nextId++
  }
}

// 50명 정확히 채우기
while (DEMO_STUDENTS.length < 50) {
  const i = DEMO_STUDENTS.length
  DEMO_STUDENTS.push({
    studentId: `s-${String(i + 1).padStart(3, '0')}`,
    name: `유학생 ${i + 1}`,
    nickname: `S${i + 1}`,
    nationality: '베트남',
    visaType: 'D-2-2',
    schoolVerified: true,
    languages: ['베트남어'],
    koreanLevel: '일상 대화 가능',
    topikLevel: 3,
    availableDays: WEEKDAYS,
    availableTimeSlots: ['오후'],
    availableAreas: ['대림'],
    preferredJobTypes: ['홀서빙'],
    workExperience: [],
    partTimePermissionExperience: false,
    introduction: '성실하게 일하겠습니다.',
    isPublic: true,
    contactStatus: 'available',
  })
}

// 학교 이름은 시현용으로 익명 처리 (대학 A/B/C 식). 학교 소속 확인은 별도 boolean.
export function getStudentById(id: string): DemoStudent | undefined {
  return DEMO_STUDENTS.find((s) => s.studentId === id)
}
