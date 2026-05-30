// 투자자 시현용 — 관리자 페이지에 보일 더미 업주 요청 30건
// 명세: 업주명·매장명·업종·지역·필요언어·요일·시간·업무유형·후보수·결제상태·열람·연락·대기·메모

import type {
  Area,
  DayOfWeek,
  JobType,
  Language,
  TimeSlot,
} from './demo-students'

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'waitlist'

export interface DemoEmployerRequest {
  id: string
  employerName: string // 담당자
  businessName: string // 매장명
  industry: string // 업종
  area: Area | string // 지역
  requiredLanguages: Language[]
  workDays: DayOfWeek[]
  workTimeSlots: TimeSlot[]
  jobTypes: JobType[]
  candidateCount: number
  paymentStatus: PaymentStatus
  revealedCandidateIds: string[]
  contactRequestedIds: string[]
  waitlisted: boolean
  adminNote: string
  createdAt: string // ISO
}

function ago(daysAgo: number, h = 9): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(h, 30, 0, 0)
  return d.toISOString()
}

export const DEMO_REQUESTS: DemoEmployerRequest[] = [
  // 결제 완료 — 9건
  {
    id: 'r-001',
    employerName: '김지영',
    businessName: '미스터 포 대림점',
    industry: '베트남 음식점',
    area: '대림',
    requiredLanguages: ['베트남어'],
    workDays: ['월', '화', '수', '목', '금'],
    workTimeSlots: ['저녁'],
    jobTypes: ['홀서빙', '주방 보조'],
    candidateCount: 7,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-001', 's-002', 's-003'],
    contactRequestedIds: ['s-001'],
    waitlisted: false,
    adminNote: '서류 안내 메일 발송 완료',
    createdAt: ago(1, 14),
  },
  {
    id: 'r-002',
    employerName: '박상민',
    businessName: '에뛰드하우스 명동본점',
    industry: '화장품 매장',
    area: '명동',
    requiredLanguages: ['중국어', '영어'],
    workDays: ['금', '토', '일'],
    workTimeSlots: ['오후', '저녁'],
    jobTypes: ['상품 설명', '손님 응대'],
    candidateCount: 12,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-004', 's-006', 's-010'],
    contactRequestedIds: ['s-004', 's-006'],
    waitlisted: false,
    adminNote: '주말 인력 시급함. 면접 일정 조율 중',
    createdAt: ago(2, 11),
  },
  {
    id: 'r-003',
    employerName: '이수정',
    businessName: '카페 글로우 홍대',
    industry: '카페',
    area: '홍대',
    requiredLanguages: ['영어'],
    workDays: ['수', '목', '금', '토'],
    workTimeSlots: ['오후'],
    jobTypes: ['홀서빙', '계산'],
    candidateCount: 9,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-007', 's-008'],
    contactRequestedIds: ['s-008'],
    waitlisted: false,
    adminNote: '',
    createdAt: ago(3),
  },
  {
    id: 'r-004',
    employerName: '최영호',
    businessName: '두타몰 면세점',
    industry: '면세점',
    area: '명동',
    requiredLanguages: ['중국어', '러시아어'],
    workDays: ['월', '화', '수', '목', '금', '토', '일'],
    workTimeSlots: ['오전', '오후'],
    jobTypes: ['상품 설명', '계산'],
    candidateCount: 6,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-003', 's-010'],
    contactRequestedIds: ['s-010'],
    waitlisted: false,
    adminNote: '러시아어 가능자 추가 발굴 필요',
    createdAt: ago(4),
  },
  {
    id: 'r-005',
    employerName: '한지수',
    businessName: '레인보우 한정식',
    industry: '한식당',
    area: '건대',
    requiredLanguages: ['영어', '중국어'],
    workDays: ['화', '목', '토'],
    workTimeSlots: ['저녁'],
    jobTypes: ['홀서빙', '손님 응대'],
    candidateCount: 5,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-006', 's-008'],
    contactRequestedIds: [],
    waitlisted: false,
    adminNote: '',
    createdAt: ago(5),
  },
  {
    id: 'r-006',
    employerName: '서민호',
    businessName: '동대문 의류 ABC',
    industry: '의류 매장',
    area: '기타',
    requiredLanguages: ['러시아어'],
    workDays: ['금', '토', '일'],
    workTimeSlots: ['오후', '저녁'],
    jobTypes: ['상품 설명', '계산'],
    candidateCount: 4,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-009', 's-010'],
    contactRequestedIds: ['s-009'],
    waitlisted: false,
    adminNote: '동대문 러시아권 매장 — 단골 거래 가능성',
    createdAt: ago(6),
  },
  {
    id: 'r-007',
    employerName: '정유라',
    businessName: '쌀국수 호아',
    industry: '베트남 음식점',
    area: '대림',
    requiredLanguages: ['베트남어'],
    workDays: ['월', '수', '금'],
    workTimeSlots: ['저녁'],
    jobTypes: ['주방 보조'],
    candidateCount: 8,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-002'],
    contactRequestedIds: ['s-002'],
    waitlisted: false,
    adminNote: '계약 성사. 6/1 출근',
    createdAt: ago(7),
  },
  {
    id: 'r-008',
    employerName: '강민철',
    businessName: 'K뷰티 홍대',
    industry: '화장품 매장',
    area: '홍대',
    requiredLanguages: ['중국어'],
    workDays: ['목', '금', '토'],
    workTimeSlots: ['오후'],
    jobTypes: ['상품 설명'],
    candidateCount: 6,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-004', 's-006'],
    contactRequestedIds: [],
    waitlisted: false,
    adminNote: '아직 연락 요청 없음 — 리마인드 필요',
    createdAt: ago(8),
  },
  {
    id: 'r-009',
    employerName: '윤다영',
    businessName: '글로벌 카페 건대',
    industry: '카페',
    area: '건대',
    requiredLanguages: ['영어', '베트남어'],
    workDays: ['화', '수', '목'],
    workTimeSlots: ['오전', '오후'],
    jobTypes: ['홀서빙', '계산'],
    candidateCount: 5,
    paymentStatus: 'paid',
    revealedCandidateIds: ['s-001'],
    contactRequestedIds: ['s-001'],
    waitlisted: false,
    adminNote: '',
    createdAt: ago(9),
  },

  // 조건 확인만 했고 결제 안 한 사람 — 21건 (총 30건 중)
  ...Array.from({ length: 17 }, (_, i): DemoEmployerRequest => {
    const idx = i + 10
    const areas: Area[] = ['대림', '건대', '홍대', '명동']
    const langs: Language[][] = [
      ['베트남어'],
      ['중국어'],
      ['영어'],
      ['러시아어'],
      ['중국어', '영어'],
    ]
    return {
      id: `r-${String(idx).padStart(3, '0')}`,
      employerName: `${['김', '이', '박', '최', '정'][i % 5]}${['수정', '민호', '지영', '영민', '하늘'][i % 5]}`,
      businessName: `매장 ${idx}`,
      industry: ['카페', '음식점', '편의점', '의류', '화장품'][i % 5],
      area: areas[i % 4],
      requiredLanguages: langs[i % langs.length],
      workDays: ['월', '수', '금'],
      workTimeSlots: ['오후'],
      jobTypes: ['홀서빙'],
      candidateCount: 5 + (i % 6),
      paymentStatus: 'pending',
      revealedCandidateIds: [],
      contactRequestedIds: [],
      waitlisted: false,
      adminNote: '',
      createdAt: ago(10 + i),
    }
  }),

  // 후보 부족 → 대기 등록 — 4건
  {
    id: 'r-027',
    employerName: '오현지',
    businessName: '몽골 전통식당',
    industry: '음식점',
    area: '기타',
    requiredLanguages: ['기타'],
    workDays: ['월', '화', '수'],
    workTimeSlots: ['저녁'],
    jobTypes: ['주방 보조'],
    candidateCount: 1,
    paymentStatus: 'waitlist',
    revealedCandidateIds: [],
    contactRequestedIds: [],
    waitlisted: true,
    adminNote: '몽골어 인력 부족 — 추가 모집 필요',
    createdAt: ago(11),
  },
  {
    id: 'r-028',
    employerName: '신준호',
    businessName: '심야 PC방',
    industry: 'PC방',
    area: '기타',
    requiredLanguages: ['중국어'],
    workDays: ['금', '토'],
    workTimeSlots: ['저녁'],
    jobTypes: ['손님 응대'],
    candidateCount: 0,
    paymentStatus: 'waitlist',
    revealedCandidateIds: [],
    contactRequestedIds: [],
    waitlisted: true,
    adminNote: '심야 시간대 + 중국어 동시 가능 인력 매우 부족',
    createdAt: ago(13),
  },
  {
    id: 'r-029',
    employerName: '배소영',
    businessName: '태국 마사지',
    industry: '미용',
    area: '홍대',
    requiredLanguages: ['기타'],
    workDays: ['수', '목', '금'],
    workTimeSlots: ['오후'],
    jobTypes: ['손님 응대'],
    candidateCount: 1,
    paymentStatus: 'waitlist',
    revealedCandidateIds: [],
    contactRequestedIds: [],
    waitlisted: true,
    adminNote: '태국어 인력 모집 공지 페이스북 게재',
    createdAt: ago(15),
  },
  {
    id: 'r-030',
    employerName: '문가람',
    businessName: '필리핀 식당 마닐라',
    industry: '음식점',
    area: '기타',
    requiredLanguages: ['영어'],
    workDays: ['일'],
    workTimeSlots: ['저녁'],
    jobTypes: ['홀서빙'],
    candidateCount: 1,
    paymentStatus: 'waitlist',
    revealedCandidateIds: [],
    contactRequestedIds: [],
    waitlisted: true,
    adminNote: '일요일 저녁만 가능자 매우 적음',
    createdAt: ago(17),
  },
]
