import Link from 'next/link'

export const metadata = {
  title: '요금제 · K-MOM',
}

export default function PricingPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">요금제</p>
      <h1 className="mt-2 text-4xl font-bold">합법 채용에 필요한 만큼만.</h1>
      <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
        K-MOM은 채용 성사 수수료를 받지 않습니다. 업주는 <strong>연락권</strong> 또는 <strong>인증 구독</strong>으로,
        학교는 <strong>리포트 구독</strong>으로 이용하세요.
      </p>

      {/* 업주 요금제 */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">업주</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <PlanCard
            name="Free"
            price="0원"
            tagline="가입 + 학생 프로필 일부 열람"
            cta="가입하기"
            href="/signup?role=employer"
            features={[
              '계정 가입 무료',
              '학생 프로필 일부 열람',
              '학생 합법 시간 자동 표시',
              '서류 체크리스트 보기',
            ]}
          />
          <PlanCard
            name="Contact Pack"
            price="9,900원~"
            tagline="필요할 때만 연락권 구매"
            cta="시작하기"
            href="/signup?role=employer"
            features={[
              '5건 9,900원 / 10건 19,000원',
              '학생에게 직접 연락 (이메일·메신저)',
              '서류 체크리스트 보기',
              '연락권 6개월 유효',
            ]}
            highlight
          />
          <PlanCard
            name="Verified Partner"
            price="월 49,000원~"
            tagline="자주 채용하는 업주를 위한 구독"
            cta="문의하기"
            href="mailto:hello@k-mom.kr?subject=Verified Partner 문의"
            features={[
              '인증 업주 배지',
              '학생 무제한 연락',
              '서류 자동 점검 + 안내 패키지',
              '검색 결과 우선 노출',
              '쌍방 평가 우수 시 등급 상승',
            ]}
          />
        </div>
      </section>

      {/* 학교 요금제 */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">학교 국제처</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <PlanCard
            name="School Pilot"
            price="0원 (3개월)"
            tagline="국제처 담당자 피드백 파일럿"
            cta="파일럿 신청"
            href="mailto:hello@k-mom.kr?subject=School Pilot 신청"
            features={[
              '재학생 익명 위험 요약 리포트',
              '서류 미제출 위험군 수',
              '업종 위험 알림 (예: 유흥업)',
              '담당자 1:1 피드백 미팅',
            ]}
            highlight
          />
          <PlanCard
            name="School Dashboard"
            price="학기당 협의"
            tagline="MOU 기반 정식 구독"
            cta="MOU 협의"
            href="mailto:hello@k-mom.kr?subject=School MOU 협의"
            features={[
              '학생 동의 기반 실명 조회 권한',
              '학교별 통계 · 추이 분석',
              '졸업·잔류·진로 데이터',
              '담당자 다계정 · 권한 관리',
            ]}
          />
        </div>
      </section>

      {/* 학생 */}
      <section className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
        <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">
          학생은 항상 무료입니다
        </h2>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
          유학생에게 과금하지 않습니다. 신뢰 프로필을 누적하는 것 자체가 K-MOM의 가장 큰 가치입니다.
        </p>
        <Link
          href="/signup?role=student"
          className="mt-4 inline-flex h-10 items-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          학생 무료 가입
        </Link>
      </section>

      {/* 법적 안내 */}
      <section className="mt-10 rounded-xl bg-zinc-50 p-5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
        <p className="font-medium text-zinc-700 dark:text-zinc-300">법적 안내</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            K-MOM은 직업안정법상 유료직업소개사업이 아닌 <strong>직업정보제공업</strong>으로 운영됩니다.
            채용 성사 수수료를 받지 않습니다.
          </li>
          <li>
            업주의 <strong>연락권 / 인증 구독</strong>은 학생 정보 제공 및 합법성 사전 점검 서비스 이용료입니다.
          </li>
          <li>
            유학생 시간제취업은 출입국·외국인관서장의 사전 허가가 필요하며 (출입국관리법 제20조),
            K-MOM은 허가 신청을 대행하지 않습니다.
          </li>
        </ul>
      </section>
    </main>
  )
}

function PlanCard({
  name,
  price,
  tagline,
  features,
  cta,
  href,
  highlight = false,
}: {
  name: string
  price: string
  tagline: string
  features: string[]
  cta: string
  href: string
  highlight?: boolean
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-2xl border-2 border-emerald-500 bg-white p-6 shadow-lg dark:bg-zinc-900'
          : 'rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900'
      }
    >
      {highlight && (
        <p className="mb-2 text-xs font-semibold uppercase text-emerald-600">추천</p>
      )}
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="mt-1 text-sm text-zinc-500">{tagline}</p>
      <p className="mt-4 text-3xl font-bold">{price}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2 text-zinc-700 dark:text-zinc-300">
            <span className="text-emerald-500">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={
          highlight
            ? 'mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700'
            : 'mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
        }
      >
        {cta}
      </Link>
    </div>
  )
}
