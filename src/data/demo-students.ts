// 투자자 시현용 더미 학생 데이터 (50명)
// 명세: studentId, name, nickname, nationality, visaType, schoolVerified,
//      languages, koreanLevel, topikLevel, availableDays, availableTimeSlots,
//      availableAreas, preferredJobTypes, workExperience,
//      partTimePermissionExperience, introduction, isPublic, contactStatus,
//      professorRecommended, reliabilityScore, punctualityScore, noShowRisk,
//      averageEmployerRating, rehireRate, strengths, badges,
//      workHistory, totalWorkHours, schoolName
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

export type StudentBadge =
  | '학교 소속 확인'
  | '교수 추천'
  | 'D-2 학생'
  | '한국어 일상대화 가능'
  | '알바 이력 있음'
  | '성실도 우수'
  | '재고용 의향 높음'

export interface WorkHistoryItem {
  workId: string
  companyName: string
  businessType: string
  startDate: string   // 'YYYY-MM'
  endDate: string     // 'YYYY-MM' or '현재'
  workDays: DayOfWeek[]
  timeSlot: TimeSlot
  jobType: JobType
  employerRated: boolean
  studentRated: boolean
  rehireIntent: boolean
  status: 'completed' | 'active'
}

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
  professorRecommended: boolean
  reliabilityScore: number        // 0–5
  punctualityScore: number        // 0–5
  noShowRisk: 'low' | 'medium' | 'high'
  averageEmployerRating: number   // 0–5
  rehireRate: number              // 0–100 (percentage)
  strengths: string[]
  badges: StudentBadge[]
  workHistory: WorkHistoryItem[]
  totalWorkHours: number
  schoolName: string
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
    professorRecommended: true,
    reliabilityScore: 4.8,
    punctualityScore: 4.9,
    noShowRisk: 'low',
    averageEmployerRating: 4.7,
    rehireRate: 95,
    strengths: ['손님 응대', '베트남어·한국어 이중 언어', '시간 약속 철저'],
    badges: ['학교 소속 확인', '교수 추천', 'D-2 학생', '한국어 일상대화 가능', '알바 이력 있음', '성실도 우수', '재고용 의향 높음'],
    workHistory: [
      {
        workId: 'wh-001-1',
        companyName: '쌀국수 호아 대림점',
        businessType: '베트남 음식',
        startDate: '2023-09',
        endDate: '2024-05',
        workDays: ['금', '토'],
        timeSlot: '저녁',
        jobType: '홀서빙',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
      {
        workId: 'wh-001-2',
        companyName: '카페 글로우 홍대',
        businessType: '카페',
        startDate: '2024-09',
        endDate: '현재',
        workDays: ['월', '수'],
        timeSlot: '오후',
        jobType: '손님 응대',
        employerRated: false,
        studentRated: false,
        rehireIntent: true,
        status: 'active',
      },
    ],
    totalWorkHours: 220,
    schoolName: '서울미디어대학원대학교',
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
    professorRecommended: false,
    reliabilityScore: 4.2,
    punctualityScore: 4.0,
    noShowRisk: 'low',
    averageEmployerRating: 4.1,
    rehireRate: 80,
    strengths: ['주방 경험', '베트남 요리 지식'],
    badges: ['학교 소속 확인', 'D-2 학생', '알바 이력 있음'],
    workHistory: [
      {
        workId: 'wh-002-1',
        companyName: '베트남 포하노이',
        businessType: '베트남 음식',
        startDate: '2023-03',
        endDate: '2024-03',
        workDays: ['화', '목', '토'],
        timeSlot: '저녁',
        jobType: '주방 보조',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
    ],
    totalWorkHours: 150,
    schoolName: '한양대학교',
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
    professorRecommended: true,
    reliabilityScore: 4.9,
    punctualityScore: 5.0,
    noShowRisk: 'low',
    averageEmployerRating: 4.8,
    rehireRate: 100,
    strengths: ['3개 언어', '면세점 경험', '글로벌 고객 응대'],
    badges: ['학교 소속 확인', '교수 추천', 'D-2 학생', '한국어 일상대화 가능', '알바 이력 있음', '성실도 우수', '재고용 의향 높음'],
    workHistory: [
      {
        workId: 'wh-003-1',
        companyName: 'K뷰티 명동',
        businessType: '화장품',
        startDate: '2023-06',
        endDate: '2023-11',
        workDays: ['토', '일'],
        timeSlot: '오전',
        jobType: '상품 설명',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
      {
        workId: 'wh-003-2',
        companyName: '코스메틱 에뛰드 명동',
        businessType: '화장품',
        startDate: '2024-03',
        endDate: '현재',
        workDays: ['월', '수', '금'],
        timeSlot: '오후',
        jobType: '손님 응대',
        employerRated: false,
        studentRated: false,
        rehireIntent: true,
        status: 'active',
      },
    ],
    totalWorkHours: 310,
    schoolName: '이화여자대학교',
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
    professorRecommended: false,
    reliabilityScore: 4.3,
    punctualityScore: 4.2,
    noShowRisk: 'low',
    averageEmployerRating: 4.4,
    rehireRate: 75,
    strengths: ['중국어', 'K뷰티'],
    badges: ['학교 소속 확인', 'D-2 학생', '알바 이력 있음', '한국어 일상대화 가능'],
    workHistory: [
      {
        workId: 'wh-004-1',
        companyName: 'K뷰티 명동',
        businessType: '화장품',
        startDate: '2023-10',
        endDate: '2024-02',
        workDays: ['토', '일'],
        timeSlot: '오후',
        jobType: '상품 설명',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
    ],
    totalWorkHours: 120,
    schoolName: '연세대학교',
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
    professorRecommended: false,
    reliabilityScore: 3.2,
    punctualityScore: 3.0,
    noShowRisk: 'medium',
    averageEmployerRating: 3.1,
    rehireRate: 40,
    strengths: ['중국어'],
    badges: ['D-2 학생'],
    workHistory: [],
    totalWorkHours: 0,
    schoolName: '홍익대학교',
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
    professorRecommended: true,
    reliabilityScore: 4.6,
    punctualityScore: 4.7,
    noShowRisk: 'low',
    averageEmployerRating: 4.5,
    rehireRate: 90,
    strengths: ['TOPIK 6급', '8년 한국 거주', '통역'],
    badges: ['학교 소속 확인', '교수 추천', 'D-2 학생', '한국어 일상대화 가능', '알바 이력 있음', '성실도 우수'],
    workHistory: [
      {
        workId: 'wh-006-1',
        companyName: '편의점 GS25 대림점',
        businessType: '편의점',
        startDate: '2022-09',
        endDate: '2023-03',
        workDays: ['화', '목'],
        timeSlot: '오후',
        jobType: '계산',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
      {
        workId: 'wh-006-2',
        companyName: '카페 글로우 홍대',
        businessType: '카페',
        startDate: '2023-09',
        endDate: '2024-06',
        workDays: ['화', '토'],
        timeSlot: '오전',
        jobType: '손님 응대',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
    ],
    totalWorkHours: 280,
    schoolName: '고려대학교',
  },
  // ── 영어권 (홍대·이태원·전 지역) ──
  {
    studentId: 's-007',
    name: "James O'Brien",
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
    professorRecommended: false,
    reliabilityScore: 4.0,
    punctualityScore: 3.9,
    noShowRisk: 'low',
    averageEmployerRating: 4.0,
    rehireRate: 70,
    strengths: ['영어 원어민', '카페 바리스타 경력'],
    badges: ['학교 소속 확인', '알바 이력 있음', '한국어 일상대화 가능'],
    workHistory: [
      {
        workId: 'wh-007-1',
        companyName: '카페 글로우 홍대',
        businessType: '카페',
        startDate: '2024-03',
        endDate: '2024-08',
        workDays: ['월', '수'],
        timeSlot: '저녁',
        jobType: '기타',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
    ],
    totalWorkHours: 95,
    schoolName: '서강대학교 어학당',
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
    professorRecommended: true,
    reliabilityScore: 4.5,
    punctualityScore: 4.6,
    noShowRisk: 'low',
    averageEmployerRating: 4.4,
    rehireRate: 85,
    strengths: ['영어·한국어 이중 언어', '홀서빙 경력 풍부'],
    badges: ['학교 소속 확인', '교수 추천', 'D-2 학생', '한국어 일상대화 가능', '알바 이력 있음', '성실도 우수'],
    workHistory: [
      {
        workId: 'wh-008-1',
        companyName: '분식천국 건대점',
        businessType: '분식',
        startDate: '2023-09',
        endDate: '2024-06',
        workDays: ['수', '금', '토'],
        timeSlot: '오후',
        jobType: '홀서빙',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
    ],
    totalWorkHours: 190,
    schoolName: '성균관대학교',
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
    professorRecommended: false,
    reliabilityScore: 3.9,
    punctualityScore: 4.1,
    noShowRisk: 'low',
    averageEmployerRating: 3.8,
    rehireRate: 65,
    strengths: ['러시아어', '중앙아시아 음식 지식'],
    badges: ['학교 소속 확인', 'D-2 학생', '알바 이력 있음'],
    workHistory: [
      {
        workId: 'wh-009-1',
        companyName: '한식당 어머니밥상',
        businessType: '한식',
        startDate: '2023-06',
        endDate: '2023-10',
        workDays: ['월', '수'],
        timeSlot: '저녁',
        jobType: '주방 보조',
        employerRated: true,
        studentRated: true,
        rehireIntent: false,
        status: 'completed',
      },
    ],
    totalWorkHours: 80,
    schoolName: '국민대학교',
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
    professorRecommended: true,
    reliabilityScore: 4.4,
    punctualityScore: 4.5,
    noShowRisk: 'low',
    averageEmployerRating: 4.3,
    rehireRate: 80,
    strengths: ['러시아어', '뷰티 매장 경력', '동유럽 고객 응대'],
    badges: ['학교 소속 확인', '교수 추천', 'D-2 학생', '한국어 일상대화 가능', '알바 이력 있음'],
    workHistory: [
      {
        workId: 'wh-010-1',
        companyName: '뷰티 스킨케어 홍대',
        businessType: '화장품',
        startDate: '2023-09',
        endDate: '2024-03',
        workDays: ['화', '토'],
        timeSlot: '오전',
        jobType: '상품 설명',
        employerRated: true,
        studentRated: true,
        rehireIntent: true,
        status: 'completed',
      },
    ],
    totalWorkHours: 145,
    schoolName: '덕성여자대학교',
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
      professorRecommended: false,
      reliabilityScore: 3.8,
      punctualityScore: 3.7,
      noShowRisk: 'low' as const,
      averageEmployerRating: 3.9,
      rehireRate: 65,
      strengths: [],
      badges: [] as StudentBadge[],
      workHistory: [] as WorkHistoryItem[],
      totalWorkHours: 0,
      schoolName: '서울 소재 대학교',
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
    professorRecommended: false,
    reliabilityScore: 3.8,
    punctualityScore: 3.7,
    noShowRisk: 'low' as const,
    averageEmployerRating: 3.9,
    rehireRate: 65,
    strengths: [],
    badges: [] as StudentBadge[],
    workHistory: [] as WorkHistoryItem[],
    totalWorkHours: 0,
    schoolName: '서울 소재 대학교',
  })
}

// 학교 이름은 시현용으로 익명 처리 (대학 A/B/C 식). 학교 소속 확인은 별도 boolean.
export function getStudentById(id: string): DemoStudent | undefined {
  return DEMO_STUDENTS.find((s) => s.studentId === id)
}
