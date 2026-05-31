import Link from "next/link";
import DemoPersonaCards from "@/components/DemoPersonaCards";
import { DEMO_MODE } from "@/lib/flags";

export default function Home() {
  return (
    <main className="flex-1">
      {/* 투자자 시연용 — 역할별 원클릭 카드 (랜딩 최상단). DEMO_MODE=false일 때 숨김 */}
      {DEMO_MODE && <DemoPersonaCards />}

      {/* Hero */}
      <section className="px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex h-8 items-center rounded-full bg-emerald-100 px-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            BETA · Phase 1 MVP
          </span>
          <span className="inline-flex h-8 items-center rounded-full bg-zinc-100 px-3 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            출입국관리법 제20조 기반
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
          유학생 채용, <br />
          <span className="text-emerald-600 dark:text-emerald-400">합법인지 먼저 확인</span>하세요.
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          K-MOM은 외국인 유학생을 채용하려는 업주와 교외 근무를 관리하는 학교가
          비자·서류·근무시간 위반 없이 안심하고 쓰는 <strong>합법 채용 신뢰 플랫폼</strong>입니다.
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          알바 매칭이 아닙니다. <strong>합법 채용 가능성 사전 확인</strong>입니다.
        </p>

        {/* 학생용 무료 자가진단 깔때기 */}
        <a
          href="https://test-me-ecru.vercel.app/유학생-아르바이트-체커/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 group flex items-center gap-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 transition hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-2xl">
            🇰🇷
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              학생이신가요? 먼저 합법 여부부터 자가진단하세요 (무료)
            </p>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
              비자·TOPIK·체류기간으로 8단계 만에 확인 → K-MOM 가입은 그 다음
            </p>
          </div>
          <span className="text-emerald-600 transition group-hover:translate-x-1">→</span>
        </a>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/signup?role=employer"
            className="inline-flex h-12 items-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            업주 등록 (Free)
          </Link>
          <Link
            href="/signup?role=student"
            className="inline-flex h-12 items-center rounded-full border border-zinc-300 px-6 text-sm font-medium hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            학생 등록 (항상 무료)
          </Link>
          <Link
            href="/signup?role=school_admin"
            className="inline-flex h-12 items-center rounded-full border border-zinc-300 px-6 text-sm font-medium hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            학교 파일럿 신청
          </Link>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="underline">
            로그인
          </Link>
          {" · "}
          <Link href="/pricing" className="underline">
            요금제 보기
          </Link>
        </p>
      </section>

      {/* 핵심 흐름 — 조건맞춤 후보 미리보기팩 (투자자용 핵심 메시지) */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-50 p-8 dark:border-emerald-800 dark:from-emerald-950/30 dark:via-sky-950/30 dark:to-violet-950/30">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            업주 핵심 흐름 · ₩10,000 미리보기팩
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            조건맞춤 외국어 가능 유학생, 사전 확인하세요.
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-zinc-700 dark:text-zinc-300">
            언어·요일·시간대·지역·업무를 입력하면 조건에 맞는 D-2 유학생 후보 수를 먼저
            보여드립니다. 충분할 때만 <strong>1만 원</strong>에 후보 3명 미리보기를 받으세요.
            일반 구인 공고를 올리기 전에 후보가 정말 있는지 확인하는 사전 검증 서비스입니다.
          </p>

          <ol className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { n: 1, t: '조건 입력', d: '언어·요일·시간·지역' },
              { n: 2, t: '후보 수 확인', d: '무료로 인원만 먼저' },
              { n: 3, t: '1만 원 결제', d: '조건이 충분할 때만' },
              { n: 4, t: '후보 3명 카드', d: '연락은 관리자 거쳐' },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-xl bg-white p-3 text-sm dark:bg-zinc-900"
              >
                <p className="text-xs font-bold text-emerald-600">{s.n}단계</p>
                <p className="mt-1 font-semibold">{s.t}</p>
                <p className="text-xs text-zinc-500">{s.d}</p>
              </li>
            ))}
          </ol>

          <Link
            href="/employer/match"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-emerald-600 px-7 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
          >
            지금 조건 입력하기 →
          </Link>
          <p className="mt-3 text-xs text-zinc-500">
            ※ 조건에 맞는 후보가 1명 이하이면 결제 안내가 나오지 않습니다. 무료 대기 등록만 가능합니다.
          </p>
        </div>
      </section>

      {/* 3대 가치 */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold">K-MOM은 무엇을 보장하나요?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Feature
            title="합법성 사전 확인"
            body="D-2/D-4 비자, 학적, TOPIK, 학기·방학별 허용 시간, 업종 가능여부까지 학생 카드 한 장에 표시합니다."
            color="emerald"
          />
          <Feature
            title="서류 자동 점검"
            body="시간제취업 허가 신청 전 필요한 근로계약서·확인서·성적증명서·한국어 증빙 누락을 자동으로 알려줍니다."
            color="sky"
          />
          <Feature
            title="신뢰 프로필 누적"
            body="쌍방 평가가 누적되어 인증 배지가 산정됩니다. 업주 → 학생, 학생 → 업주 모두 검증됩니다."
            color="violet"
          />
        </div>
      </section>

      {/* 차별화 */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold">왜 알바몬·당근알바가 아니라 K-MOM인가요?</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-semibold">기존 플랫폼</th>
                <th className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">K-MOM</th>
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

      {/* 누가 돈을 내나 */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold">누가 어떻게 사용하나요?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <RoleCard
            role="학생"
            price="항상 무료"
            color="emerald"
            items={[
              "비자 합법 시간 자동 계산",
              "신뢰 프로필 누적 (TOPIK · 평가 · 학교 인증)",
              "알바 이력 = 평생 경력 자산",
            ]}
          />
          <RoleCard
            role="업주"
            price="Free → 연락권 → 인증 구독"
            color="sky"
            items={[
              "학생 프로필 기본 열람 무료",
              "직접 연락은 연락권 패키지 또는 구독",
              "서류 누락 사전 점검으로 위반 리스크 ↓",
            ]}
          />
          <RoleCard
            role="학교"
            price="초기 무료 파일럿"
            color="violet"
            items={[
              "위험군 요약 리포트 (개인정보 최소화)",
              "허가 신청 전 학생 수 · 업종 위험 알림",
              "유학생 잔류율 · 만족도 추이",
            ]}
          />
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          ※ K-MOM은 채용 성사 수수료를 받지 않습니다. 직업안정법상 직업소개업과의 경계를 명확히 합니다.
        </p>
      </section>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © 2026 K-MOM · 출입국관리법 제20조 · 직업안정법 준수
      </footer>
    </main>
  );
}

function Feature({
  title,
  body,
  color,
}: {
  title: string;
  body: string;
  color: "emerald" | "sky" | "violet";
}) {
  const dot =
    color === "emerald"
      ? "bg-emerald-500"
      : color === "sky"
        ? "bg-sky-500"
        : "bg-violet-500";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`mb-3 h-2 w-2 rounded-full ${dot}`} />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
    </div>
  );
}

function CompareRow({ a, b }: { a: string; b: string }) {
  return (
    <tr>
      <td className="px-4 py-3 text-zinc-500">{a}</td>
      <td className="px-4 py-3 font-medium">{b}</td>
    </tr>
  );
}

function RoleCard({
  role,
  price,
  items,
  color,
}: {
  role: string;
  price: string;
  items: string[];
  color: "emerald" | "sky" | "violet";
}) {
  const accent =
    color === "emerald"
      ? "text-emerald-700 dark:text-emerald-300"
      : color === "sky"
        ? "text-sky-700 dark:text-sky-300"
        : "text-violet-700 dark:text-violet-300";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-xl font-semibold">{role}</h3>
      <p className={`mt-1 text-sm font-medium ${accent}`}>{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-emerald-500">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
