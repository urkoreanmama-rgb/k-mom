// 학생 여정 — D-2 유학생이 K-MOM을 처음 만나는 순간부터 완성된 프로필까지
// Apple-inspired: 흰/검/회 + 단일 액센트, 그라데이션 없음

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginAsDemoAccount } from '@/app/actions/auth'

export const metadata = { title: '학생 여정 · K-MOM 시연' }

interface Step {
  num: number
  title: string
  description: string
  cta?: {
    label: string
    href?: string
    external?: boolean
    loginEmail?: string
    loginDest?: string
  }
  insight: string
}

const STEPS: Step[] = [
  {
    num: 1,
    title: '비자 체커 — 자가 진단',
    description:
      '베트남 유학생 응우옌 티 화가 친구 카톡으로 K-MOM 비자체커 링크를 받음. ' +
      '8단계 질문(비자·체류·학적·TOPIK·근무시간·업종 등)에 답하면 ' +
      '본인이 합법적으로 알바할 수 있는지 즉시 확인.',
    cta: {
      label: '비자 체커 열기',
      href:
        'https://test-me-ecru.vercel.app/유학생-아르바이트-체커/index.html',
      external: true,
    },
    insight:
      'K-MOM의 핵심 유입 깔때기. 학생이 가입 전에 "내가 합법인지" 먼저 확인하게 함. ' +
      '결과 페이지 하단에 K-MOM 가입 CTA가 자동 노출돼서 가입으로 전환됨.',
  },
  {
    num: 2,
    title: 'K-MOM 프로필 작성',
    description:
      '체커에서 "합법 알바 가능" 결과 → 가입 → 프로필 작성. ' +
      '비자·TOPIK·학적 상태·시간제취업 허가 상태를 입력하면 ' +
      '내 합법성 점수(0~8)가 실시간 계산. ' +
      '잡코리아 스타일 이력서 양식(학력·경력·자격증·어학·자소서·희망조건)도 작성.',
    cta: {
      label: '응우옌 티 화의 완성된 프로필 보기',
      loginEmail: 'kmom.student1@gmail.com',
      loginDest: '/student/profile',
    },
    insight:
      '학생은 무료. 프로필을 채울수록 합법성 점수가 오르고, ' +
      '업주 검색에서 더 매력적으로 노출됨. 이력서·요일·시간대·지역·업종 모두 구조화됨.',
  },
  {
    num: 3,
    title: '업체 둘러보기 + 이력서 보내기',
    description:
      '학생이 K-MOM 등록 가게들을 둘러봄. 가게마다 ' +
      '평점·평가 건수·자동 산정된 인증 등급(GOLD / SILVER / BRONZE)이 표시. ' +
      '학생이 먼저 지원하고 싶은 GOLD 업체를 골라 "내 이력서 보내기" 클릭 → ' +
      '관리자가 검토 후 업주에게 전달.',
    cta: {
      label: '업체 둘러보기 화면 보기',
      loginEmail: 'kmom.student1@gmail.com',
      loginDest: '/student/employers',
    },
    insight:
      '핵심 차별화 — 인증 배지는 학생들의 실제 평가가 자동 산정하는 신뢰 지표. ' +
      'GOLD 업체는 광고비가 아니라 "학생이 검증한 곳"이라서, ' +
      '학생이 먼저 지원하고 싶어집니다 → 채용 성공률 ↑. ' +
      '업주는 "언어 매칭팩" 9,900원으로 자기 가게에 필요한 언어 학생 후보 3명을 받음.',
  },
  {
    num: 4,
    title: '근무 + 쌍방향 평가',
    description:
      '업주가 학생을 채용. 시간제취업 허가 후 근무 시작. ' +
      '근무 종료 후 양쪽이 별점·세부 항목 평가. ' +
      '두 평가가 다 제출되어야 동시 공개(에어비앤비 방식). ' +
      '학생 프로필에 신뢰 점수·재고용률·배지가 누적.',
    cta: {
      label: '평가 시연 페이지 보기',
      href: '/work/review-demo',
    },
    insight:
      '신뢰 자산의 핵심. 평가가 누적될수록 업주가 보는 후보 카드에 ' +
      '별점·재고용률·배지가 풍부해져서 매칭률이 높아짐. ' +
      '낮은 점수 학생/업주는 자동 매칭 제한.',
  },
]

export default async function StudentJourneyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/demo/student-journey')
  }

  const { data: row } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (row?.role !== 'platform_admin') {
    redirect('/?notice=demo_admin_only')
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <Link
        href="/demo"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← 시연 모드로
      </Link>

      <header className="mt-8 text-center">
        <p className="text-sm font-medium text-zinc-500">학생의 여정</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight">
          응우옌 티 화가 K-MOM을
          <br />
          만나는 4단계
        </h1>
        <p className="mt-4 text-zinc-500">
          베트남 유학생이 비자체커부터 완성된 신뢰 프로필까지
        </p>
      </header>

      {/* 진행 단계 표시 */}
      <ol className="mt-12 grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
        {STEPS.map((s) => (
          <li
            key={s.num}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {s.num}. {s.title.split(' — ')[0]}
          </li>
        ))}
      </ol>

      <div className="mt-12 space-y-6">
        {STEPS.map((step) => (
          <article
            key={step.num}
            className="card-3d rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm font-medium text-zinc-500">Step {step.num}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
              {step.title}
            </h2>
            <p className="mt-4 text-zinc-600 leading-relaxed dark:text-zinc-400">
              {step.description}
            </p>

            {/* CTA */}
            {step.cta && (
              <div className="mt-6">
                {step.cta.external && step.cta.href ? (
                  <a
                    href={step.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d inline-flex h-11 items-center rounded-full px-6 text-sm font-medium"
                  >
                    {step.cta.label}
                    <span className="ml-2 text-xs">↗</span>
                  </a>
                ) : step.cta.href ? (
                  <Link
                    href={step.cta.href}
                    className="btn-3d inline-flex h-11 items-center rounded-full px-6 text-sm font-medium"
                  >
                    {step.cta.label}
                  </Link>
                ) : step.cta.loginEmail && step.cta.loginDest ? (
                  <form action={loginAsDemoAccount}>
                    <input type="hidden" name="email" value={step.cta.loginEmail} />
                    <input type="hidden" name="dest" value={step.cta.loginDest} />
                    <button
                      type="submit"
                      className="btn-3d inline-flex h-11 items-center rounded-full px-6 text-sm font-medium"
                    >
                      {step.cta.label}
                    </button>
                  </form>
                ) : null}
              </div>
            )}

            {/* 인사이트 */}
            <div className="mt-6 rounded-xl bg-zinc-50 px-5 py-4 text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">인사이트</p>
              <p className="mt-1 leading-relaxed">{step.insight}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-zinc-700 dark:text-zinc-300">
          이 흐름이 반복되며 학생 신뢰 자산이 누적됩니다.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          학생 무료 · 업주 두 축 결제 · 학교 MOU 구독 = K-MOM 수익 모델
        </p>
      </section>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/demo"
          className="btn-3d inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          ← 다른 역할 보기
        </Link>
        <Link
          href="/admin/dashboard"
          className="btn-3d inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          관리자 대시보드
        </Link>
      </div>
    </main>
  )
}
