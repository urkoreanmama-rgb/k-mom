// 투자자 시현용 대시보드 메트릭 — 명세서 정확한 수치 사용
// 실제 운영 시 Supabase 쿼리로 교체 가능하도록 단일 export로 분리.

export interface DemoMetrics {
  registeredStudents: number
  inquiredEmployers: number
  candidateCountConfirmedEmployers: number
  paidEmployers: number
  conversionRatePct: number
  contactRequests: number
  waitlistedEmployers: number
}

export const DEMO_METRICS: DemoMetrics = {
  registeredStudents: 50,
  inquiredEmployers: 30,
  candidateCountConfirmedEmployers: 30,
  paidEmployers: 9,
  conversionRatePct: 30,
  contactRequests: 15,
  waitlistedEmployers: 4,
}

// 실제 데이터 모드로 교체할 때 사용할 함수 시그니처 — 지금은 더미 반환
export async function fetchMetrics(): Promise<DemoMetrics> {
  // TODO: Supabase에서 실제 집계
  // const { data } = await supabase.rpc('compute_kpi_metrics')
  return DEMO_METRICS
}
