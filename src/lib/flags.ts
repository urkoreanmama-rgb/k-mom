// 환경변수 기반 기능 플래그 — DB·코드는 같지만 UI/접근을 토글
// 운영 전환 체크리스트: 모든 DEMO_MODE/KAKAO_ENABLED 분기 점검 후
// 필요한 것만 true로, 시연 코드는 점진 제거.

/**
 * 시연 모드:
 *   - true: 역할별 페르소나 카드, 시나리오 원클릭, proxy 우회 노출
 *   - false: 일반 사용자에게 깔끔한 랜딩, 인증 필수
 *
 * 기본값: true (현재 단계)
 * 운영 전환 시 Vercel env에서 false 설정.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'

/**
 * 카카오 로그인 활성화 — Kakao Developers + Supabase 설정 완료 후 true.
 * 기본값: false (코드는 있지만 버튼 숨김)
 */
export const KAKAO_ENABLED = process.env.NEXT_PUBLIC_KAKAO_ENABLED === 'true'

/**
 * 결제 프로바이더 — payment.ts와 동기화
 */
export const PAYMENT_PROVIDER = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ||
  'demo') as 'demo' | 'toss' | 'kakao' | 'iamport'
