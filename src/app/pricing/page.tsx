import Link from 'next/link'

export const metadata = {
  title: '요금제 · K-MOM',
}

export default function PricingPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <p className="text-sm font-medium text-zinc-500">요금제</p>
      <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
        외국인 채용비가 아니라,
        <br />
        내가 필요한 언어 인재 열람비.
      </h1>
      <p className="mt-6 max-w-2xl text-zinc-500">
        명동 화장품 매장은 중국어, 이태원 식당은 영어, 안산 공장은 우즈벡어.
        가게가 필요한 언어가 다르면 결제도 그렇게. 학생은 항상 무료, 업주는
        언어 매칭팩과 스태프 안정 구독, 학교는 리포트 구독.
      </p>

      {/* 언어 매칭팩 */}
      <section className="mt-20">
        <p className="text-sm font-medium text-zinc-500">건당 결제</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          언어 매칭팩
        </h2>
        <p className="mt-2 text-zinc-500">필요한 언어만 골라서 후보 3명 카드 열람.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGE_PACKS.map((p) => (
            <LanguagePack key={p.flag} {...p} />
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          후보 3명을 모두 거절하면 다음 팩 50% 할인 자동 적용. 재고용 시 같은 학생 무료 연락.
        </p>
      </section>

      {/* 스태프 안정 구독 */}
      <section className="mt-20">
        <p className="text-sm font-medium text-zinc-500">월정액</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          스태프 안정 구독
        </h2>
        <p className="mt-2 text-zinc-500">갑자기 사람 없어지는 상황을 막아주는 구독.</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
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
            name="스태프 안정"
            price="월 49,000원"
            tagline="갑자기 사람 없어지는 상황을 막아주는 구독"
            cta="시작하기"
            href="/signup?role=employer"
            features={[
              '비자 만료 D-30 자동 알림',
              '주 25h 초과 사전 경고',
              '졸업 D-60 후임 채용 알림',
              'GOLD 배지 유지 (해지 시 소멸)',
              '합법 채용 확인서 발급 (월 1회 무료)',
              '좋은 학생 우선 지원 효과',
            ]}
            highlight
          />
          <PlanCard
            name="Enterprise"
            price="문의"
            tagline="3개 매장 이상 운영하는 프랜차이즈"
            cta="문의하기"
            href="mailto:hello@k-mom.kr?subject=Enterprise 문의"
            features={[
              '본사 ↔ 매장 통합 대시보드',
              '매장별 스태프 안정 알림 묶음',
              '본사 채용 담당자 다계정',
              '인사·노무 API 연동',
            ]}
          />
        </div>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            왜 월 49,000원이 합리적인가?
          </p>
          <p className="mt-2 leading-relaxed">
            외국인 알바 1명 갑자기 못 나오면 하루 매출 손실에 후임 채용 1~2주.
            "이 직원 다음 주 한도 초과" 또는 "비자 D-30" 한 줄 알림이 그걸 사전에 막아줍니다.
            한 번만 막아도 구독료 회수.
          </p>
        </div>
      </section>

      {/* 학교 요금제 */}
      <section className="mt-20">
        <p className="text-sm font-medium text-zinc-500">B2B</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          학교 국제처
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
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
      <section className="mt-20 rounded-2xl border border-zinc-200 bg-zinc-50 p-10 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-500">학생</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          학생은 항상 무료입니다.
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-500">
          유학생에게 과금하지 않습니다. 신뢰 프로필을 누적하는 것 자체가 K-MOM의 가장 큰 가치입니다.
        </p>
        <Link
          href="/signup?role=student"
          className="btn-3d mt-6 inline-flex h-11 items-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          학생 무료 가입
        </Link>
      </section>

      {/* 법적 안내 */}
      <section className="mt-12 text-sm text-zinc-500">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">법적 안내</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
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

// 🌏 언어 매칭팩 — 업주가 자기 가게 컨텍스트로 직접 연결되도록
const LANGUAGE_PACKS = [
  {
    flag: '🇨🇳',
    lang: '중국어',
    price: '9,900원',
    use: '명동 화장품·면세점·관광지 카페',
    detail: '중국어 가능 학생 후보 3명 카드 열람',
  },
  {
    flag: '🇻🇳',
    lang: '베트남어',
    price: '9,900원',
    use: '안산·시흥 공장, 베트남식당',
    detail: '베트남어 가능 학생 후보 3명 카드 열람',
  },
  {
    flag: '🇺🇸',
    lang: '영어',
    price: '9,900원',
    use: '이태원·홍대 식당, 관광 안내',
    detail: '영어 가능 학생 후보 3명 카드 열람',
  },
  {
    flag: '🇲🇳',
    lang: '몽골어',
    price: '9,900원',
    use: '동대문 의류 도매, 광장시장',
    detail: '몽골어 가능 학생 후보 3명 카드 열람',
  },
  {
    flag: '🇺🇿',
    lang: '우즈벡어',
    price: '9,900원',
    use: '안산·평택 공장, 동대문 시장',
    detail: '우즈벡어 가능 학생 후보 3명 카드 열람',
  },
  {
    flag: '🇰🇷',
    lang: '한국어 능통',
    price: '14,900원',
    use: 'TOPIK 5급+ — 응대·전화 가능',
    detail: '한국어 능통 학생 후보 3명 카드 열람',
  },
]

function LanguagePack({
  flag,
  lang,
  price,
  use,
  detail,
}: {
  flag: string
  lang: string
  price: string
  use: string
  detail: string
}) {
  return (
    <div className="card-3d rounded-2xl border border-zinc-200 bg-white p-6 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{flag}</span>
        <p className="text-base font-semibold tracking-tight">{lang}</p>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight">{price}</p>
      <p className="mt-3 text-sm text-zinc-500">{detail}</p>
      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-zinc-500">
        대표 업종
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{use}</p>
    </div>
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
          ? 'rounded-2xl border-2 border-zinc-900 bg-white p-8 dark:border-zinc-100 dark:bg-zinc-900'
          : 'rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900'
      }
    >
      {highlight && (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          추천
        </p>
      )}
      <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
      <p className="mt-1 text-sm text-zinc-500">{tagline}</p>
      <p className="mt-6 text-4xl font-semibold tracking-tight">{price}</p>
      <ul className="mt-6 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5 text-zinc-700 dark:text-zinc-300">
            <span className="text-zinc-400">—</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={
          highlight
            ? 'mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200'
            : 'mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-medium hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600'
        }
      >
        {cta}
      </Link>
    </div>
  )
}
