// 결제 처리 — 추후 토스페이먼츠·카카오페이·아임포트로 교체할 수 있도록 추상화.
// 시현용 MVP에서는 setTimeout으로 가짜 성공 응답을 돌려줌.

export type PaymentProvider = 'demo' | 'toss' | 'kakao' | 'iamport'

export interface PaymentRequest {
  orderId: string
  productName: string
  amount: number
  customerEmail?: string
  customerName?: string
}

export interface PaymentResult {
  success: boolean
  provider: PaymentProvider
  transactionId: string
  paidAt: string
  raw?: unknown
  error?: string
}

const ACTIVE_PROVIDER: PaymentProvider =
  (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProvider) || 'demo'

/**
 * 단일 진입점 — 호출 측에서는 이 함수만 쓰면 됨.
 * 나중에 실 결제 붙일 때 ACTIVE_PROVIDER 분기에 코드 추가.
 */
export async function processPayment(req: PaymentRequest): Promise<PaymentResult> {
  switch (ACTIVE_PROVIDER) {
    case 'toss':
      return processWithToss(req)
    case 'kakao':
      return processWithKakao(req)
    case 'iamport':
      return processWithIamport(req)
    case 'demo':
    default:
      return processDemo(req)
  }
}

/**
 * 시현용 — 700ms 후 무조건 성공
 */
async function processDemo(req: PaymentRequest): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 700))
  return {
    success: true,
    provider: 'demo',
    transactionId: `demo_${Date.now()}_${req.orderId}`,
    paidAt: new Date().toISOString(),
  }
}

// ── 향후 구현 자리 (시그니처만 잡아 둠) ──

async function processWithToss(req: PaymentRequest): Promise<PaymentResult> {
  // TODO: window.TossPayments(...).requestPayment('카드', { ... })
  return {
    success: false,
    provider: 'toss',
    transactionId: '',
    paidAt: '',
    error: 'Toss 연동 미구현',
    raw: req,
  }
}

async function processWithKakao(req: PaymentRequest): Promise<PaymentResult> {
  // TODO: 카카오페이 결제 준비 API → 사용자 redirect
  return {
    success: false,
    provider: 'kakao',
    transactionId: '',
    paidAt: '',
    error: '카카오페이 연동 미구현',
    raw: req,
  }
}

async function processWithIamport(req: PaymentRequest): Promise<PaymentResult> {
  // TODO: IMP.request_pay({ pg: 'html5_inicis', ... })
  return {
    success: false,
    provider: 'iamport',
    transactionId: '',
    paidAt: '',
    error: '아임포트 연동 미구현',
    raw: req,
  }
}
