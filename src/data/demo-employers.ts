// 투자자 시현용 더미 업체 데이터 (12개)
// 실제 운영 시 Supabase employer_profiles 쿼리로 교체

export type EmployerBadge =
  | 'K-MOM 인증 업체'
  | '임금 지급 우수'
  | '근무 환경 우수'
  | '서류 협조 우수'
  | '외국인 학생 채용 경험 있음'
  | '학생 재근무 의향 높음'

export interface EmployerReviewSummary {
  wageOnTime: number        // 0–5
  jobMatchAccuracy: number  // 0–5
  workEnvironment: number   // 0–5
  studentRespect: number    // 0–5
  documentSupport: number   // 0–5
  rehireIntent: number      // 0–100%
  totalReviews: number
}

export interface HiringHistoryItem {
  studentNickname: string
  period: string           // e.g. '2024.03 – 2024.09'
  jobType: string
  rehired: boolean
}

export interface DemoEmployer {
  companyId: string
  companyName: string
  businessType: string
  area: string
  requiredLanguages: string[]
  hiringExperience: boolean     // 외국인 유학생 채용 경험
  certified: boolean            // K-MOM 인증 여부
  trustScore: number            // 0–5 overall
  reviewSummary: EmployerReviewSummary
  hiringHistory: HiringHistoryItem[]
  badges: EmployerBadge[]
  riskFlag: boolean
  riskNote?: string
  description: string           // 업체 소개
  contactEmail?: string
}

export const DEMO_EMPLOYERS: DemoEmployer[] = [
  {
    companyId: 'e-001',
    companyName: '쌀국수 호아 대림점',
    businessType: '베트남 음식',
    area: '대림',
    requiredLanguages: ['베트남어', '한국어'],
    hiringExperience: true,
    certified: true,
    trustScore: 4.8,
    reviewSummary: {
      wageOnTime: 5.0,
      jobMatchAccuracy: 4.8,
      workEnvironment: 4.7,
      studentRespect: 4.9,
      documentSupport: 4.8,
      rehireIntent: 95,
      totalReviews: 8,
    },
    hiringHistory: [
      { studentNickname: '화', period: '2023.09 – 2024.05', jobType: '홀서빙', rehired: true },
      { studentNickname: '란', period: '2023.03 – 2023.09', jobType: '주방 보조', rehired: true },
      { studentNickname: '호아', period: '2022.09 – 2023.03', jobType: '홀서빙', rehired: false },
      { studentNickname: '두엑', period: '2024.06 – 현재', jobType: '홀서빙', rehired: false },
    ],
    badges: ['K-MOM 인증 업체', '임금 지급 우수', '근무 환경 우수', '서류 협조 우수', '외국인 학생 채용 경험 있음', '학생 재근무 의향 높음'],
    riskFlag: false,
    description: '대림동 베트남 동포 밀집 상권의 인기 쌀국수 전문점. 베트남어 가능 학생을 선호하며, 외국인 유학생 채용 이력 8건 이상. 급여 정시 지급 100% 기록.',
    contactEmail: 'hoa.dalim@gmail.com',
  },
  {
    companyId: 'e-002',
    companyName: 'K뷰티 명동',
    businessType: '화장품',
    area: '명동',
    requiredLanguages: ['중국어', '영어', '한국어'],
    hiringExperience: true,
    certified: true,
    trustScore: 4.5,
    reviewSummary: {
      wageOnTime: 4.6,
      jobMatchAccuracy: 4.4,
      workEnvironment: 4.5,
      studentRespect: 4.6,
      documentSupport: 4.3,
      rehireIntent: 85,
      totalReviews: 6,
    },
    hiringHistory: [
      { studentNickname: '안', period: '2023.06 – 2023.11', jobType: '상품 설명', rehired: true },
      { studentNickname: 'Jia', period: '2023.10 – 2024.02', jobType: '상품 설명', rehired: true },
      { studentNickname: 'Meng', period: '2024.03 – 현재', jobType: '손님 응대', rehired: false },
    ],
    badges: ['K-MOM 인증 업체', '임금 지급 우수', '외국인 학생 채용 경험 있음', '학생 재근무 의향 높음'],
    riskFlag: false,
    description: '명동 핵심 상권 K뷰티 편집숍. 중국·동남아 관광객 대상 상품 설명 가능 학생 필요. 공고 내용 정확하고 근무 환경 쾌적하다는 평이 많음.',
    contactEmail: 'hr@kbeauty-myeongdong.co.kr',
  },
  {
    companyId: 'e-003',
    companyName: '카페 글로우 홍대',
    businessType: '카페',
    area: '홍대',
    requiredLanguages: ['영어', '한국어'],
    hiringExperience: true,
    certified: false,
    trustScore: 4.2,
    reviewSummary: {
      wageOnTime: 4.3,
      jobMatchAccuracy: 4.0,
      workEnvironment: 4.4,
      studentRespect: 4.2,
      documentSupport: 3.9,
      rehireIntent: 75,
      totalReviews: 5,
    },
    hiringHistory: [
      { studentNickname: '화', period: '2024.09 – 현재', jobType: '손님 응대', rehired: false },
      { studentNickname: 'James', period: '2024.03 – 2024.08', jobType: '기타', rehired: true },
      { studentNickname: '유안', period: '2023.09 – 2024.06', jobType: '손님 응대', rehired: true },
    ],
    badges: ['외국인 학생 채용 경험 있음', '근무 환경 우수'],
    riskFlag: false,
    description: '홍대 감성 카페. 외국인 손님 비율 40% 이상으로 영어·다국어 응대 필요. 자유로운 분위기, 교통 편리. 서류 안내는 다소 늦을 수 있다는 후기 있음.',
    contactEmail: 'glow.cafe.hongdae@naver.com',
  },
  {
    companyId: 'e-004',
    companyName: '분식천국 건대점',
    businessType: '분식',
    area: '건대',
    requiredLanguages: ['한국어'],
    hiringExperience: true,
    certified: true,
    trustScore: 4.6,
    reviewSummary: {
      wageOnTime: 4.8,
      jobMatchAccuracy: 4.6,
      workEnvironment: 4.5,
      studentRespect: 4.7,
      documentSupport: 4.5,
      rehireIntent: 88,
      totalReviews: 7,
    },
    hiringHistory: [
      { studentNickname: 'Sarah', period: '2023.09 – 2024.06', jobType: '홀서빙', rehired: true },
      { studentNickname: '응안', period: '2023.03 – 2023.09', jobType: '홀서빙', rehired: true },
      { studentNickname: 'Aigul', period: '2024.03 – 현재', jobType: '계산', rehired: false },
    ],
    badges: ['K-MOM 인증 업체', '임금 지급 우수', '근무 환경 우수', '서류 협조 우수', '외국인 학생 채용 경험 있음', '학생 재근무 의향 높음'],
    riskFlag: false,
    description: '건대입구 역세권 분식 전문점. 학생 고객층으로 항상 활기참. 야간 영업 없이 오후 9시 마감, 주부 및 학생 파트타이머 친화적. K-MOM 인증 1호점.',
    contactEmail: 'buntcheon.konkuk@kakao.com',
  },
  {
    companyId: 'e-005',
    companyName: '중화요리 팔선생',
    businessType: '중식',
    area: '명동',
    requiredLanguages: ['중국어', '한국어'],
    hiringExperience: true,
    certified: false,
    trustScore: 3.8,
    reviewSummary: {
      wageOnTime: 3.9,
      jobMatchAccuracy: 3.7,
      workEnvironment: 3.8,
      studentRespect: 3.9,
      documentSupport: 3.5,
      rehireIntent: 60,
      totalReviews: 4,
    },
    hiringHistory: [
      { studentNickname: 'Pei', period: '2023.06 – 2023.12', jobType: '홀서빙', rehired: false },
      { studentNickname: 'Yu', period: '2024.03 – 2024.09', jobType: '주방 보조', rehired: false },
    ],
    badges: ['외국인 학생 채용 경험 있음'],
    riskFlag: false,
    description: '명동 중식당. 중국어 가능 학생 선호. 급여 지급은 정상이나 근무 환경 개선 여지 있다는 후기. 서류 처리가 다소 느린 편.',
    contactEmail: 'palseonsaeng@naver.com',
  },
  {
    companyId: 'e-006',
    companyName: '편의점 GS25 대림점',
    businessType: '편의점',
    area: '대림',
    requiredLanguages: ['한국어'],
    hiringExperience: true,
    certified: false,
    trustScore: 3.5,
    reviewSummary: {
      wageOnTime: 3.8,
      jobMatchAccuracy: 3.4,
      workEnvironment: 3.5,
      studentRespect: 3.4,
      documentSupport: 3.2,
      rehireIntent: 50,
      totalReviews: 3,
    },
    hiringHistory: [
      { studentNickname: '유안', period: '2022.09 – 2023.03', jobType: '계산', rehired: true },
      { studentNickname: 'Bat', period: '2023.09 – 2024.03', jobType: '계산', rehired: false },
    ],
    badges: ['외국인 학생 채용 경험 있음'],
    riskFlag: false,
    description: '대림동 GS25 편의점. 심야 및 조기 근무 포함. 업무는 단순하나 야간 근무 시 외국인 학생 배려 미흡하다는 일부 후기. 서류 안내 불충분 사례 있음.',
    contactEmail: 'gs25dalim@gmail.com',
  },
  {
    companyId: 'e-007',
    companyName: '이자카야 도쿄밤',
    businessType: '일식주점',
    area: '홍대',
    requiredLanguages: ['한국어', '영어'],
    hiringExperience: true,
    certified: false,
    trustScore: 2.9,
    reviewSummary: {
      wageOnTime: 2.5,
      jobMatchAccuracy: 3.0,
      workEnvironment: 3.1,
      studentRespect: 2.8,
      documentSupport: 2.6,
      rehireIntent: 30,
      totalReviews: 3,
    },
    hiringHistory: [
      { studentNickname: 'Anna', period: '2023.06 – 2023.09', jobType: '홀서빙', rehired: false },
      { studentNickname: 'Dmitri', period: '2023.10 – 2024.01', jobType: '홀서빙', rehired: false },
    ],
    badges: [],
    riskFlag: true,
    riskNote: '임금 지급 지연 신고 1건 (2024년 1월, 해당 학생 확인됨)',
    description: '홍대 이자카야. 심야 영업 전문. 과거 임금 지급 지연 신고 이력 있어 K-MOM 모니터링 대상. 현재 개선 여부 확인 중.',
    contactEmail: undefined,
  },
  {
    companyId: 'e-008',
    companyName: '뷰티 스킨케어 홍대',
    businessType: '화장품',
    area: '홍대',
    requiredLanguages: ['러시아어', '영어', '한국어'],
    hiringExperience: true,
    certified: true,
    trustScore: 4.7,
    reviewSummary: {
      wageOnTime: 4.8,
      jobMatchAccuracy: 4.7,
      workEnvironment: 4.8,
      studentRespect: 4.9,
      documentSupport: 4.6,
      rehireIntent: 92,
      totalReviews: 5,
    },
    hiringHistory: [
      { studentNickname: 'Elena', period: '2023.09 – 2024.03', jobType: '상품 설명', rehired: true },
      { studentNickname: 'Nargiza', period: '2024.03 – 현재', jobType: '손님 응대', rehired: false },
      { studentNickname: 'Maria', period: '2023.03 – 2023.09', jobType: '상품 설명', rehired: false },
    ],
    badges: ['K-MOM 인증 업체', '임금 지급 우수', '근무 환경 우수', '서류 협조 우수', '외국인 학생 채용 경험 있음', '학생 재근무 의향 높음'],
    riskFlag: false,
    description: '홍대 러시아·동유럽 관광객 대상 스킨케어 전문 매장. 러시아어·영어 가능 학생 우대. 급여 정시 지급, 친절한 교육 환경으로 재고용률 높음.',
    contactEmail: 'beautyskinhongdae@gmail.com',
  },
  {
    companyId: 'e-009',
    companyName: '한식당 어머니밥상',
    businessType: '한식',
    area: '건대',
    requiredLanguages: ['한국어'],
    hiringExperience: true,
    certified: false,
    trustScore: 4.0,
    reviewSummary: {
      wageOnTime: 4.1,
      jobMatchAccuracy: 3.9,
      workEnvironment: 4.0,
      studentRespect: 4.2,
      documentSupport: 3.8,
      rehireIntent: 65,
      totalReviews: 4,
    },
    hiringHistory: [
      { studentNickname: 'Alex', period: '2023.06 – 2023.10', jobType: '주방 보조', rehired: false },
      { studentNickname: 'Otgon', period: '2024.03 – 현재', jobType: '주방 보조', rehired: false },
    ],
    badges: ['외국인 학생 채용 경험 있음'],
    riskFlag: false,
    description: '건대 한식 가정식 전문점. 따뜻한 분위기로 학생들에게 인기. 급여는 정상이나 한국어 의사소통 기본 수준 요구. 서류 안내는 다소 느린 편.',
    contactEmail: 'omma.bapsang@naver.com',
  },
  {
    companyId: 'e-010',
    companyName: '베트남 포하노이',
    businessType: '베트남음식',
    area: '대림',
    requiredLanguages: ['베트남어', '한국어'],
    hiringExperience: true,
    certified: true,
    trustScore: 4.4,
    reviewSummary: {
      wageOnTime: 4.5,
      jobMatchAccuracy: 4.3,
      workEnvironment: 4.4,
      studentRespect: 4.6,
      documentSupport: 4.2,
      rehireIntent: 80,
      totalReviews: 5,
    },
    hiringHistory: [
      { studentNickname: '민', period: '2023.03 – 2024.03', jobType: '주방 보조', rehired: true },
      { studentNickname: '란', period: '2022.09 – 2023.03', jobType: '홀서빙', rehired: false },
      { studentNickname: '호아', period: '2024.06 – 현재', jobType: '홀서빙', rehired: false },
    ],
    badges: ['K-MOM 인증 업체', '임금 지급 우수', '외국인 학생 채용 경험 있음', '학생 재근무 의향 높음'],
    riskFlag: false,
    description: '대림동 정통 베트남 쌀국수 전문점. 베트남어 능통 학생 우선. 점주 한국 거주 10년 이상의 베트남 교포로 학생 눈높이에 맞는 배려.',
    contactEmail: 'phohanoi.dalim@gmail.com',
  },
  {
    companyId: 'e-011',
    companyName: '스터디카페 브레인',
    businessType: '카페',
    area: '기타',
    requiredLanguages: ['한국어'],
    hiringExperience: false,
    certified: false,
    trustScore: 3.2,
    reviewSummary: {
      wageOnTime: 3.4,
      jobMatchAccuracy: 3.1,
      workEnvironment: 3.3,
      studentRespect: 3.2,
      documentSupport: 2.9,
      rehireIntent: 45,
      totalReviews: 2,
    },
    hiringHistory: [
      { studentNickname: 'Danar', period: '2024.03 – 2024.06', jobType: '기타', rehired: false },
    ],
    badges: [],
    riskFlag: false,
    description: '동작구 스터디카페. 외국인 유학생 채용 경험 적어 초기 적응 시 커뮤니케이션 어려움 보고됨. 급여는 정상 지급, 야간 근무 없음.',
    contactEmail: 'brain.studycafe@naver.com',
  },
  {
    companyId: 'e-012',
    companyName: '코스메틱 에뛰드 명동',
    businessType: '화장품',
    area: '명동',
    requiredLanguages: ['중국어', '영어', '베트남어', '한국어'],
    hiringExperience: true,
    certified: true,
    trustScore: 4.9,
    reviewSummary: {
      wageOnTime: 5.0,
      jobMatchAccuracy: 4.9,
      workEnvironment: 5.0,
      studentRespect: 4.9,
      documentSupport: 4.8,
      rehireIntent: 98,
      totalReviews: 9,
    },
    hiringHistory: [
      { studentNickname: '안', period: '2024.03 – 현재', jobType: '손님 응대', rehired: false },
      { studentNickname: 'Jia', period: '2023.06 – 2023.12', jobType: '상품 설명', rehired: true },
      { studentNickname: 'Elena', period: '2023.03 – 2023.09', jobType: '상품 설명', rehired: true },
      { studentNickname: 'Putri', period: '2024.06 – 현재', jobType: '손님 응대', rehired: false },
    ],
    badges: ['K-MOM 인증 업체', '임금 지급 우수', '근무 환경 우수', '서류 협조 우수', '외국인 학생 채용 경험 있음', '학생 재근무 의향 높음'],
    riskFlag: false,
    description: '명동 에뛰드 플래그십 스토어. 다국어 가능 학생 최우선. 급여 100% 정시 지급, 유학생 서류 체계적 지원, 재고용률 최고 수준. K-MOM 파트너사.',
    contactEmail: 'etude.myeongdong@amorepacific.com',
  },
]

export function getEmployerById(id: string): DemoEmployer | undefined {
  return DEMO_EMPLOYERS.find((e) => e.companyId === id)
}

export function getCertifiedEmployers(): DemoEmployer[] {
  return DEMO_EMPLOYERS.filter((e) => e.certified)
}

export function getFlaggedEmployers(): DemoEmployer[] {
  return DEMO_EMPLOYERS.filter((e) => e.riskFlag)
}
