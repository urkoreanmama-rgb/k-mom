// 투자자 시현용 더미 리뷰 데이터 (양방향)
// 학생→업체, 업체→학생 리뷰 혼합. Supabase reviews 테이블로 교체 가능.

export type ReviewerRole = 'student' | 'employer'

export interface ReviewRatings {
  // 학생이 업체를 평가할 때
  wageOnTime?: number          // 급여 약속 날 지급
  jobMatchAccuracy?: number    // 공고 내용 일치
  workEnvironment?: number     // 근무 환경 안전
  studentRespect?: number      // 외국인 학생 존중
  documentSupport?: number     // 서류 준비 협조
  wouldReturn?: number         // 다시 일하고 싶음 (0 or 1)

  // 업체가 학생을 평가할 때
  punctuality?: number         // 약속 시간 출근
  noShow?: number              // 무단결근 없음 (0 or 1)
  workAttitude?: number        // 업무 태도 성실
  customerService?: number     // 손님 응대 적절
  koreanCommunication?: number // 한국어 소통
  wouldRehire?: number         // 다시 채용 (0 or 1)
}

export interface DemoReview {
  reviewId: string
  studentId: string
  companyId: string
  reviewerRole: ReviewerRole
  ratings: ReviewRatings
  comment: string
  createdAt: string  // ISO date string
  isVisible: boolean
  isVerified: boolean
}

export const DEMO_REVIEWS: DemoReview[] = [
  // ── 업체가 학생을 평가 (employer → student) ──
  {
    reviewId: 'rv-001',
    studentId: 's-001',
    companyId: 'e-001',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 5,
      noShow: 1,
      workAttitude: 5,
      customerService: 5,
      koreanCommunication: 4,
      wouldRehire: 1,
    },
    comment: '화 학생은 항상 시간 전에 도착하고 손님 응대가 탁월합니다. 베트남어·한국어 모두 능숙하여 우리 가게에 최적입니다. 다음 학기에도 꼭 다시 일해줬으면 합니다.',
    createdAt: '2024-05-20T10:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-002',
    studentId: 's-003',
    companyId: 'e-012',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 5,
      noShow: 1,
      workAttitude: 5,
      customerService: 5,
      koreanCommunication: 5,
      wouldRehire: 1,
    },
    comment: '안 학생은 3개 국어를 구사하며 중국·동남아 관광객 응대에 최고입니다. 성실성과 책임감은 알바생 중 최상위. 정규 계약 제안도 고민 중입니다.',
    createdAt: '2024-06-01T09:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-003',
    studentId: 's-006',
    companyId: 'e-003',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 5,
      noShow: 1,
      workAttitude: 4,
      customerService: 5,
      koreanCommunication: 5,
      wouldRehire: 1,
    },
    comment: '유안 씨는 TOPIK 6급답게 한국어 수준이 출중합니다. 외국인 손님과 한국어 손님 모두에게 자연스럽게 응대합니다. 강력 추천합니다.',
    createdAt: '2024-06-15T14:30:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-004',
    studentId: 's-002',
    companyId: 'e-010',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 4,
      noShow: 1,
      workAttitude: 4,
      customerService: 4,
      koreanCommunication: 3,
      wouldRehire: 1,
    },
    comment: '민 학생은 주방 일에 숙련되어 있고 베트남 음식에 대한 이해도가 높습니다. 한국어는 기본 소통 수준이나 주방 환경에서는 충분합니다. 재고용했습니다.',
    createdAt: '2024-03-10T11:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-005',
    studentId: 's-008',
    companyId: 'e-004',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 5,
      noShow: 1,
      workAttitude: 5,
      customerService: 4,
      koreanCommunication: 4,
      wouldRehire: 1,
    },
    comment: 'Sarah는 영어·한국어 모두 유창하고 서비스 마인드가 뛰어납니다. 교포 출신이라 한국 문화 이해도가 높아 손님들에게 좋은 반응을 얻었습니다.',
    createdAt: '2024-06-20T16:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-006',
    studentId: 's-004',
    companyId: 'e-002',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 4,
      noShow: 1,
      workAttitude: 4,
      customerService: 5,
      koreanCommunication: 4,
      wouldRehire: 1,
    },
    comment: 'Jia 학생은 중국어 대화를 원하는 고객에게 탁월합니다. 상품 지식도 빠르게 익혀서 도움이 많이 됐습니다. 시간 약속도 잘 지키는 편입니다.',
    createdAt: '2024-02-28T10:30:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-007',
    studentId: 's-010',
    companyId: 'e-008',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 5,
      noShow: 1,
      workAttitude: 4,
      customerService: 5,
      koreanCommunication: 4,
      wouldRehire: 1,
    },
    comment: 'Elena는 러시아어권 고객을 위한 우리 매장의 핵심 인력입니다. 뷰티 지식도 있고 전문적으로 응대합니다. 다음 학기 재계약 예정.',
    createdAt: '2024-03-05T15:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-008',
    studentId: 's-005',
    companyId: 'e-005',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 3,
      noShow: 0,
      workAttitude: 3,
      customerService: 3,
      koreanCommunication: 2,
      wouldRehire: 0,
    },
    comment: 'Xiao 학생은 중국어는 능숙하지만 한국어 소통에 어려움이 있었습니다. 무단 결근도 한 차례 있었고 업무 적응이 더뎠습니다. 재고용은 어렵습니다.',
    createdAt: '2024-01-15T09:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  // ── 학생이 업체를 평가 (student → employer) ──
  {
    reviewId: 'rv-009',
    studentId: 's-001',
    companyId: 'e-001',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 5,
      jobMatchAccuracy: 5,
      workEnvironment: 5,
      studentRespect: 5,
      documentSupport: 5,
      wouldReturn: 1,
    },
    comment: '사장님이 베트남 동포라 의사소통이 편했고, 급여는 항상 약속 날에 받았어요. 근무 환경도 쾌적하고 유학생 서류도 잘 도와줬습니다. 정말 추천하는 곳이에요.',
    createdAt: '2024-05-22T18:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-010',
    studentId: 's-003',
    companyId: 'e-002',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 5,
      jobMatchAccuracy: 4,
      workEnvironment: 5,
      studentRespect: 5,
      documentSupport: 4,
      wouldReturn: 1,
    },
    comment: '명동 K뷰티는 깨끗하고 관리가 잘 된 매장이에요. 처음 일할 때 교육도 충분히 해줬고, 외국인 학생이라고 차별 없이 대우해줬어요. 급여도 정확히 지급.',
    createdAt: '2023-11-30T20:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-011',
    studentId: 's-006',
    companyId: 'e-003',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 4,
      jobMatchAccuracy: 4,
      workEnvironment: 5,
      studentRespect: 4,
      documentSupport: 3,
      wouldReturn: 1,
    },
    comment: '카페 분위기 좋고 일하기 편한 환경이에요. 급여는 제때 받았고 동료들도 친절했습니다. 서류 관련해서 처음에 안내가 부족했지만 물어보면 잘 도와줬어요.',
    createdAt: '2024-06-18T19:30:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-012',
    studentId: 's-002',
    companyId: 'e-010',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 5,
      jobMatchAccuracy: 4,
      workEnvironment: 4,
      studentRespect: 5,
      documentSupport: 4,
      wouldReturn: 1,
    },
    comment: '베트남 동포 가게라서 말도 통하고 편했어요. 주방 환경도 괜찮고 사장님이 유학생 사정을 잘 이해해 주셔서 수업 일정 조정도 유연하게 해줬습니다.',
    createdAt: '2024-03-15T21:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-013',
    studentId: 's-005',
    companyId: 'e-005',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 4,
      jobMatchAccuracy: 3,
      workEnvironment: 3,
      studentRespect: 3,
      documentSupport: 2,
      wouldReturn: 0,
    },
    comment: '급여는 제때 나왔지만 공고 내용과 실제 업무가 달랐어요. 서류 준비도 알아서 해야 했고, 외국인이라는 이유로 처음에 무시당하는 느낌이 들었어요.',
    createdAt: '2024-01-20T22:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-014',
    studentId: 's-008',
    companyId: 'e-004',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 5,
      jobMatchAccuracy: 5,
      workEnvironment: 4,
      studentRespect: 5,
      documentSupport: 5,
      wouldReturn: 1,
    },
    comment: '분식천국 사장님은 외국인 학생에게 정말 친절해요. 서류도 체계적으로 도와줬고 수업 끝나고 오후 시간대에 맞춰서 스케줄 조정도 해줬어요. 강력 추천!',
    createdAt: '2024-06-25T17:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-015',
    studentId: 's-009',
    companyId: 'e-009',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 4,
      jobMatchAccuracy: 4,
      workEnvironment: 4,
      studentRespect: 4,
      documentSupport: 3,
      wouldReturn: 0,
    },
    comment: '한식당이라 한국어 능숙하지 않아서 처음에 힘들었지만 사장님이 기다려줬어요. 급여는 정확했고 환경도 괜찮았습니다. 제 한국어 수준이 올라가면 다시 지원할 것 같아요.',
    createdAt: '2023-10-15T20:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-016',
    studentId: 's-010',
    companyId: 'e-008',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 5,
      jobMatchAccuracy: 5,
      workEnvironment: 5,
      studentRespect: 5,
      documentSupport: 5,
      wouldReturn: 1,
    },
    comment: '뷰티 스킨케어 홍대는 정말 최고의 알바 경험이었어요. 러시아어로 응대할 수 있어서 재미있었고, 사장님이 학생 입장을 배려해줘서 공부와 일을 병행하기 좋았어요.',
    createdAt: '2024-03-10T18:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-017',
    studentId: 's-007',
    companyId: 'e-003',
    reviewerRole: 'student',
    ratings: {
      wageOnTime: 4,
      jobMatchAccuracy: 4,
      workEnvironment: 5,
      studentRespect: 4,
      documentSupport: 3,
      wouldReturn: 1,
    },
    comment: 'English-friendly cafe, very comfortable atmosphere. Manager speaks some English and was patient with my Korean. Pay was on time. Document help was a bit unclear initially but manageable.',
    createdAt: '2024-08-20T15:00:00Z',
    isVisible: true,
    isVerified: true,
  },
  {
    reviewId: 'rv-018',
    studentId: 's-004',
    companyId: 'e-012',
    reviewerRole: 'employer',
    ratings: {
      punctuality: 4,
      noShow: 1,
      workAttitude: 5,
      customerService: 5,
      koreanCommunication: 4,
      wouldRehire: 1,
    },
    comment: 'Jia는 중국어 고객 응대에서 탁월한 능력을 발휘했습니다. 상품 지식 습득도 빠르고 팀워크가 좋았습니다. 다음 시즌에도 함께 하고 싶습니다.',
    createdAt: '2023-12-20T11:00:00Z',
    isVisible: true,
    isVerified: true,
  },
]

export function getReviewsByStudentId(studentId: string): DemoReview[] {
  return DEMO_REVIEWS.filter((r) => r.studentId === studentId)
}

export function getReviewsByCompanyId(companyId: string): DemoReview[] {
  return DEMO_REVIEWS.filter((r) => r.companyId === companyId)
}

export function getEmployerReviewsForStudent(studentId: string): DemoReview[] {
  return DEMO_REVIEWS.filter((r) => r.studentId === studentId && r.reviewerRole === 'employer')
}

export function getStudentReviewsForCompany(companyId: string): DemoReview[] {
  return DEMO_REVIEWS.filter((r) => r.companyId === companyId && r.reviewerRole === 'student')
}
