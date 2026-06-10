// 랜딩 페이지 — 역할별 원클릭 시연 카드
import { loginAsDemoAccount } from '@/app/actions/auth'

interface Persona {
  emoji: string
  role: '학생' | '업주' | '학교' | '운영자'
  who: string // 표시 이름
  scenario: string // 어떤 상태를 보여주는지
  email: string
  dest: string // 로그인 후 이동할 경로
  tone: 'green' | 'sky' | 'violet' | 'zinc'
}

const PERSONAS: Persona[] = [
  // 학생 2명 — 완벽 / 빈 프로필
  {
    emoji: '👩‍🎓',
    role: '학생',
    who: '응우옌 티 화 (베트남)',
    scenario: '완벽 프로필 — 합법성 점수 카드와 알바 이력 평가까지',
    email: 'kmom.student1@gmail.com',
    dest: '/student/profile',
    tone: 'green',
  },
  {
    emoji: '🧑‍🎓',
    role: '학생',
    who: '신규 학생 (빈 프로필)',
    scenario: '미입력 상태 — TODO 카드로 학생을 유도하는 흐름',
    email: 'kmom.student5@gmail.com',
    dest: '/student/profile',
    tone: 'green',
  },
  // 업주 2명 — 신규 매칭 흐름 / 풀 사이클 완료
  {
    emoji: '🏪',
    role: '업주',
    who: '카페 글로우 홍대 (신규)',
    scenario: '핵심 BM — 1만 원 미리보기팩 흐름 (조건→후보수→결제→카드)',
    email: 'kmom.employer3@gmail.com',
    dest: '/employer/match',
    tone: 'sky',
  },
  {
    emoji: '🥇',
    role: '업주',
    who: '쌀국수 호아 대림 (GOLD)',
    scenario: '풀 사이클 완료 — 가게 정보·인증등급·평가까지 누적된 상태',
    email: 'kmom.employer1@gmail.com',
    dest: '/employer/profile',
    tone: 'sky',
  },
  // 학교
  {
    emoji: '🏫',
    role: '학교',
    who: 'K-MOM 데모대학교 국제처',
    scenario: '익명 위험 요약 대시보드 — 학생 5명 현황, 서류 미제출 3명',
    email: 'kmom.school@gmail.com',
    dest: '/school/dashboard',
    tone: 'violet',
  },
  // 운영자
  {
    emoji: '🛡️',
    role: '운영자',
    who: 'K-MOM 플랫폼 운영자',
    scenario: '투자자 KPI 7종 + 전환 깔때기 + 업주 요청 관리 30건',
    email: 'kmom.admin@gmail.com',
    dest: '/admin/dashboard',
    tone: 'zinc',
  },
]

const TONE: Record<Persona['tone'], { border: string; bg: string; chip: string; btn: string }> =
  {
    green: {
      border: 'border-emerald-300 dark:border-emerald-800',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      chip: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200',
      btn: 'bg-emerald-600 hover:bg-emerald-700',
    },
    sky: {
      border: 'border-sky-300 dark:border-sky-800',
      bg: 'bg-sky-50 dark:bg-sky-950/30',
      chip: 'bg-sky-200 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200',
      btn: 'bg-sky-600 hover:bg-sky-700',
    },
    violet: {
      border: 'border-violet-300 dark:border-violet-800',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      chip: 'bg-violet-200 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200',
      btn: 'bg-violet-600 hover:bg-violet-700',
    },
    zinc: {
      border: 'border-zinc-400 dark:border-zinc-600',
      bg: 'bg-zinc-50 dark:bg-zinc-900',
      chip: 'bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100',
      btn: 'bg-zinc-900',
    },
  }

export default function DemoPersonaCards() {
  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <div className="text-center">
        <span className="btn-3d inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
          📺 투자자 시연 모드
        </span>
        <h2 className="mt-4 text-3xl font-bold">
          각 역할의 입장에서 바로 둘러보세요
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          카드 하나만 클릭하면 그 역할로 자동 로그인되어 해당 화면이 열립니다.
          가입·비밀번호 입력 없음.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((p, i) => {
          const t = TONE[p.tone]
          return (
            <form
              key={p.email + i}
              action={loginAsDemoAccount}
              className={`flex flex-col rounded-2xl border-2 p-5 ${t.border} ${t.bg}`}
            >
              <input type="hidden" name="email" value={p.email} />
              <input type="hidden" name="dest" value={p.dest} />

              <div className="flex items-start justify-between">
                <span className="text-4xl">{p.emoji}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${t.chip}`}
                >
                  {p.role}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold">{p.who}</h3>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                {p.scenario}
              </p>

              <button
                type="submit"
                className={`mt-auto h-10 rounded-lg px-4 text-sm font-semibold ${t.btn} mt-5`}
              >
                {p.role}으로 시연 보기 →
              </button>
            </form>
          )
        })}
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        ※ 시연 계정은 미리 데이터가 채워져 있습니다. 위 카드 사이를 자유롭게 옮겨다니며 비교해보세요.
        <br />
        화면 상단 오른쪽의 <span className="font-mono text-zinc-700 dark:text-zinc-300">로그아웃</span> 버튼으로 다시 이 화면에 돌아옵니다.
      </p>
    </section>
  )
}
