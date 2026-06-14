// 기업 채용팀 v4.0 — 졸업생 커리어 프로필 열람권 (출시 예정)
// 시연 모드에서 BM 4축 중 '기업 채용팀' 카드 클릭 시 진입

import Link from 'next/link'

export const metadata = { title: '기업 채용팀 (v4.0) · K-MOM' }

export default function EnterprisePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
      <Link
        href="/demo"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← 시연 모드로
      </Link>

      <header className="mt-8 text-center">
        <p className="text-sm font-medium text-zinc-500">기업 채용팀 · v4.0</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
          졸업생 커리어 프로필
          <br />
          열람권.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-zinc-500">
          K-MOM에서 4년간 신뢰 자산을 쌓은 D-2 유학생이 졸업합니다.
          그들의 알바 이력·평가·언어 능력이 기업 채용에 가장 검증된 데이터입니다.
        </p>
        <span className="mt-6 inline-flex items-center rounded-full border border-zinc-300 bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          출시 예정 · 2027
        </span>
      </header>

      {/* 졸업생 커리어 카드 미리보기 — 가상 */}
      <section className="mt-16">
        <p className="text-center text-sm font-medium text-zinc-500">미리보기</p>
        <h2 className="mt-3 text-center text-2xl sm:text-3xl font-semibold tracking-tight">
          이런 데이터를 받아봅니다
        </h2>

        <div className="mt-12 card-3d rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-500">졸업생 커리어 프로필</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">응우옌 티 화</h3>
              <p className="mt-1 text-sm text-zinc-500">
                베트남 · D-10-1 구직 · 서울미디어대학원대학교 졸업 (2027)
              </p>
            </div>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              GOLD
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric label="신뢰도" value="4.8" unit="/5" />
            <Metric label="누적 근무" value="1,240" unit="h" />
            <Metric label="재고용률" value="95" unit="%" />
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              언어
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip>베트남어 (원어민)</Chip>
              <Chip>한국어 (TOPIK 5급)</Chip>
              <Chip>영어 (중급)</Chip>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              근무 이력 (4년)
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="text-zinc-400 tabular-nums">2024</span>
                <span>쌀국수 호아 대림점 — 홀서빙·계산·통역 (12개월)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-400 tabular-nums">2025</span>
                <span>K뷰티 명동 — 베트남 관광객 응대 (8개월)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-400 tabular-nums">2026</span>
                <span>호텔 그랜드 — 베트남어 통역 (10개월)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-400 tabular-nums">2027</span>
                <span>K-MOM 졸업 → 커리어 프로필 전환</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              업주 누적 평가 (24건)
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              "한국어·베트남어 양쪽 다 능숙. 손님 응대 자연스럽고 시간 약속 철저함.
              매니저로 추천하고 싶을 정도."
            </p>
          </div>
        </div>
      </section>

      {/* 기업 입장의 가치 */}
      <section className="mt-16">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight">
          왜 기업이 이 데이터를 쓰는가
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <ValueCard
            num="01"
            title="검증된 신뢰"
            body="4년간 알바 현장에서 업주들의 실제 평가가 누적된 데이터. 면접만으로는 알 수 없는 정보."
          />
          <ValueCard
            num="02"
            title="언어 능력 즉시 확인"
            body="원어민 + TOPIK + 영어 등급. 외국인 채용 시 가장 중요한 정보를 한 줄에."
          />
          <ValueCard
            num="03"
            title="실무 적응력 증명"
            body="한국 사업장에서 일한 시간만 누적 1,000h+. 실제 한국 노동 환경 경험."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 card-3d rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-500">출시 예정 · 2027</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          기업 파트너 사전 신청
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-zinc-500">
          K-MOM v4.0 출시 시 1년간 무료 이용권을 드립니다.
          글로벌 채용 담당자라면 사전 신청해주세요.
        </p>
        <a
          href="mailto:hello@k-mom.kr?subject=K-MOM v4.0 기업 파트너 사전 신청"
          className="btn-3d mt-8 inline-flex h-12 items-center rounded-full px-7 text-sm font-medium"
        >
          사전 신청하기
        </a>
      </section>

      <div className="mt-16 text-center">
        <Link
          href="/demo"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← 시연 모드로 돌아가기
        </Link>
      </div>
    </main>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {value}
        {unit && <span className="ml-0.5 text-sm font-medium text-zinc-500">{unit}</span>}
      </p>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
      {children}
    </span>
  )
}

function ValueCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="card-3d rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium tabular-nums text-zinc-400">{num}</p>
      <h4 className="mt-3 text-lg font-semibold tracking-tight">{title}</h4>
      <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{body}</p>
    </div>
  )
}
