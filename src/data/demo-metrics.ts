// 투자자 시현용 대시보드 메트릭 — 명세서 정확한 수치 사용
// 실제 운영 시 Supabase 쿼리로 교체 가능하도록 단일 export로 분리.

export interface DemoMetrics {
  // 기존 지표
  registeredStudents: number
  inquiredEmployers: number
  candidateCountConfirmedEmployers: number
  paidEmployers: number
  conversionRatePct: number
  contactRequests: number
  waitlistedEmployers: number

  // 새 지표 (명세서 기준)
  registeredCompanies: number
  certifiedCompanies: number
  totalReviews: number
  professorRecommendedStudents: number
  candidateMatchRequests: number
  previewPayments: number
  studentSatisfaction: number      // 4.6
  companyTrustAverage: number      // 4.5
}

export const DEMO_METRICS: DemoMetrics = {
  registeredStudents: 50,
  inquiredEmployers: 30,
  candidateCountConfirmedEmployers: 30,
  paidEmployers: 9,
  conversionRatePct: 30,
  contactRequests: 18,
  waitlistedEmployers: 4,
  registeredCompanies: 30,
  certifiedCompanies: 8,
  totalReviews: 42,
  professorRecommendedStudents: 12,
  candidateMatchRequests: 18,
  previewPayments: 9,
  studentSatisfaction: 4.6,
  companyTrustAverage: 4.5,
}

// 실제 데이터 모드로 교체할 때 사용할 함수 시그니처 — 지금은 더미 반환
export async function fetchMetrics(): Promise<DemoMetrics> {
  // TODO: Supabase에서 실제 집계
  // const { data } = await supabase.rpc('compute_kpi_metrics')
  return DEMO_METRICS
}
