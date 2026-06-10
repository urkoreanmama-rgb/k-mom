import Link from "next/link";

// 메인 URL (/)은 로그인 여부 상관없이 항상 랜딩 페이지 표시
// — 로그인된 사용자도 자유롭게 접근 (Nav는 사용자 정보 표시)
// Apple-inspired 디자인: 흰/검/회 + 단일 액센트, 그라데이션 없음

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>
}) {
  const { notice } = await searchParams

  return (
    <main className="flex-1">
      {notice === 'demo_admin_only' && (
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-center text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          시연 모드는 운영자 계정으로 로그인해야 접근할 수 있어요.
        </div>
      )}

      {/* Hero — 매우 큰 헤드라인, 단색, 여백 */}
      <section className="px-6 py-24 sm:py-32 lg:py-40 max-w-5xl mx-auto text-center">
        <p className="text-sm font-medium text-zinc-500 tracking-tight">
          BETA · 출입국관리법 제20조 기반
        </p>
        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
          유학생 채용,
          <br />
          합법인지 먼저 확인하세요.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-500 dark:text-zinc-400">
          K-MOM은 외국인 유학생을 채용하려는 업주와 교외 근무를 관리하는 학교가
          비자·서류·근무시간 위반 없이 안심하고 쓰는 합법 채용 신뢰 플랫폼입니다.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup?role=employer"
            className="btn-3d inline-flex h-12 items-center rounded-full px-7 text-sm font-medium"
          >
            업주 등록
          </Link>
          <Link
            href="/signup?role=student"
            className="btn-3d inline-flex h-12 items-center rounded-full px-7 text-sm font-medium"
          >
            학생 등록
          </Link>
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100">
            로그인
          </Link>
          {" · "}
          <Link href="/pricing" className="text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100">
            요금제 보기
          </Link>
        </p>
      </section>

      {/* 학생 자가진단 — 옅은 회색 섹션 (구분만 hint) */}
      <section className="bg-zinc-50 dark:bg-zinc-950">
        <div className="px-6 py-20 max-w-5xl mx-auto text-center">
          <p className="text-sm font-medium text-zinc-500">학생이신가요?</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            먼저 합법 여부부터 자가진단하세요.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-zinc-500">
            비자·TOPIK·체류기간으로 8단계 만에 확인. K-MOM 가입은 그다음이에요. 무료.
          </p>
          <a
            href="https://test-me-ecru.vercel.app/유학생-아르바이트-체커/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d mt-8 inline-flex h-12 items-center rounded-full px-7 text-sm font-medium"
          >
            비자 체커 열기 →
          </a>
        </div>
      </section>

      {/* 업주 핵심 흐름 — 단색 카드 */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <p className="text-sm font-medium text-zinc-500">업주를 위한 핵심 흐름</p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
          언어 매칭팩 9,900원으로
          <br className="hidden sm:block" />
          {' '}필요한 언어 학생 후보 3명.
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-500">
          명동 매장이면 중국어, 안산 공장이면 우즈벡어, 이태원 식당이면 영어.
          가게에 필요한 언어를 고르면 그 언어 가능 D-2 학생 후보를 카드로 받아보세요.
        </p>

        <ol className="mt-10 grid gap-3 sm:grid-cols-4">
          {[
            { n: 1, t: '언어 선택', d: '🇨🇳 🇻🇳 🇺🇸 🇲🇳 🇺🇿' },
            { n: 2, t: '후보 수 확인', d: '무료로 인원만 먼저' },
            { n: 3, t: '9,900원 결제', d: '필요한 언어만' },
            { n: 4, t: '후보 3명 카드', d: '연락은 관리자 거쳐' },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-xs font-medium text-zinc-500">{s.n}단계</p>
              <p className="mt-2 text-base font-semibold">{s.t}</p>
              <p className="mt-1 text-sm text-zinc-500">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/employer/match"
            className="btn-3d inline-flex h-12 items-center rounded-full px-7 text-sm font-medium"
          >
            지금 시작하기 →
          </Link>
          <Link
            href="/pricing"
            className="btn-3d inline-flex h-12 items-center rounded-full px-7 text-sm font-medium"
          >
            요금제 자세히
          </Link>
        </div>
      </section>

      {/* 3대 가치 — 단색 카드, 점·이모지 제거 */}
      <section className="bg-zinc-50 dark:bg-zinc-950">
        <div className="px-6 py-24 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            K-MOM은 무엇을 보장하나요?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Feature
              title="합법성 사전 확인"
              body="D-2/D-4 비자, 학적, TOPIK, 학기·방학별 허용 시간, 업종 가능 여부까지 학생 카드 한 장에."
            />
            <Feature
              title="서류 자동 점검"
              body="시간제취업 허가 신청 전 필요한 근로계약서·확인서·성적증명서 누락을 자동으로 알려줍니다."
            />
            <Feature
              title="신뢰 프로필 누적"
              body="쌍방 평가가 누적되어 인증 배지가 산정됩니다. 광고비가 아니라 학생 평가로."
            />
          </div>
        </div>
      </section>

      {/* 차별화 표 — Apple 비교표 스타일 */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          왜 알바몬·당근알바가 아니라 K-MOM인가요?
        </h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-base">
            <thead className="bg-zinc-50 text-left dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-500">기존 플랫폼</th>
                <th className="px-6 py-4 font-medium">K-MOM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <CompareRow a="빠른 지원자 모집" b="합법 채용 가능성 사전 확인" />
              <CompareRow a="일반 알바생 대상" b="D-2 · D-4 유학생 특화" />
              <CompareRow a="공고 중심" b="학생 신뢰 프로필 중심" />
              <CompareRow a="업주 혼자 판단" b="학교 · 플랫폼 기준 함께 확인" />
              <CompareRow a="단기 채용 종료" b="유학생 정착 · 진로 데이터 축적" />
            </tbody>
          </table>
        </div>
      </section>

      {/* 누가 어떻게 — 3장 동일 색 카드 */}
      <section className="bg-zinc-50 dark:bg-zinc-950">
        <div className="px-6 py-24 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            누가 어떻게 사용하나요?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <RoleCard
              role="학생"
              price="항상 무료"
              items={[
                "비자 합법 시간 자동 계산",
                "신뢰 프로필 누적 (TOPIK · 평가 · 학교 인증)",
                "알바 이력 = 평생 경력 자산",
              ]}
            />
            <RoleCard
              role="업주"
              price="언어 매칭팩 · 스태프 안정 구독"
              items={[
                "필요한 언어 학생 후보 3명 — 9,900원",
                "갑자기 사람 없어지는 상황 예방 — 월 49,000원",
                "서류 누락 사전 점검",
              ]}
            />
            <RoleCard
              role="학교"
              price="초기 무료 파일럿"
              items={[
                "위험군 요약 리포트 (개인정보 최소화)",
                "허가 신청 전 학생 수·업종 위험 알림",
                "유학생 잔류율·만족도 추이",
              ]}
            />
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            ※ K-MOM은 채용 성사 수수료를 받지 않습니다. 직업안정법상 직업소개업과의 경계를 명확히 합니다.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 text-center text-sm text-zinc-500">
        © 2026 K-MOM · 출입국관리법 제20조 · 직업안정법 준수
      </footer>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-zinc-500 leading-relaxed">{body}</p>
    </div>
  );
}

function CompareRow({ a, b }: { a: string; b: string }) {
  return (
    <tr>
      <td className="px-6 py-4 text-zinc-500">{a}</td>
      <td className="px-6 py-4 font-medium">{b}</td>
    </tr>
  );
}

function RoleCard({
  role,
  price,
  items,
}: {
  role: string;
  price: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-xl font-semibold tracking-tight">{role}</h3>
      <p className="mt-2 text-sm text-zinc-500">{price}</p>
      <ul className="mt-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-zinc-400">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
