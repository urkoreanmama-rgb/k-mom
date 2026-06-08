// 전체 메뉴 페이지 — 사용자가 K-MOM의 모든 화면을 한눈에 보고 클릭해서 이동
// (Next.js 기본 /sitemap.xml과 충돌 피하려 /sitemap-all 경로 사용)

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE } from '@/lib/flags'

export const metadata = { title: '전체메뉴 · K-MOM' }

interface MenuItem {
  href: string
  title: string
  desc: string
  emoji?: string
  external?: boolean
}

interface MenuGroup {
  title: string
  color: 'emerald' | 'sky' | 'violet' | 'amber' | 'zinc'
  items: MenuItem[]
}

const COLOR_MAP: Record<MenuGroup['color'], { chip: string; border: string }> = {
  emerald: {
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-900',
  },
  sky: {
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-900',
  },
  violet: {
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-900',
  },
  amber: {
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-900',
  },
  zinc: {
    chip: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200',
    border: 'border-zinc-300 dark:border-zinc-700',
  },
}

export default async function SitemapPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    role = data?.role ?? null
  }

  const groups: MenuGroup[] = [
    {
      title: '🌐 공개 페이지',
      color: 'zinc',
      items: [
        { href: '/', title: '홈', desc: 'K-MOM 메인 랜딩', emoji: '🏠' },
        { href: '/pricing', title: '요금제', desc: 'Free · Contact Pack · Verified Partner', emoji: '💰' },
        { href: '/login', title: '로그인', desc: '이메일 또는 카카오 로그인', emoji: '🔐' },
        { href: '/signup', title: '회원가입', desc: '학생·업주·학교 가입', emoji: '✍️' },
      ],
    },
    {
      title: '👨‍🎓 학생 메뉴',
      color: 'emerald',
      items: [
        { href: '/student/profile', title: '내 프로필', desc: '합법성 점수 + 미리보기 카드', emoji: '📋' },
        { href: '/student/resume', title: '내 이력서', desc: '잡코리아 스타일 양식 (7개 섹션)', emoji: '📝' },
        { href: '/student/employers', title: '업주 둘러보기', desc: '등록된 가게 + 이력서 보내기', emoji: '🏪' },
        { href: '/student/history', title: '알바 이력', desc: '나의 근무 기록과 쌍방 평가', emoji: '⏰' },
      ],
    },
    {
      title: '🏪 업주 메뉴',
      color: 'sky',
      items: [
        { href: '/employer/match', title: '⚡ 맞춤 후보 찾기', desc: '조건 입력 → 후보 수 → 결제 → 카드 (핵심 BM)', emoji: '⚡' },
        { href: '/employer/search', title: '학생 프로필 열람', desc: '50명 학생 전체 검색·필터', emoji: '🔍' },
        { href: '/employer/applications', title: '받은 이력서', desc: '학생이 직접 보낸 이력서함', emoji: '📩' },
        { href: '/employer/work', title: '진행 중인 채용', desc: '서류 패키지 + 평가 관리', emoji: '📂' },
        { href: '/employer/profile', title: '내 가게 정보', desc: '상호·업종·인증 등급', emoji: '🏬' },
      ],
    },
    {
      title: '🏫 학교 메뉴',
      color: 'violet',
      items: [
        { href: '/school/dashboard', title: '학교 대시보드', desc: '재학생 모니터링 + 위험 요약', emoji: '📊' },
      ],
    },
    {
      title: '🛡️ 운영자 메뉴',
      color: 'amber',
      items: [
        { href: '/admin/dashboard', title: '운영자 대시보드', desc: 'KPI 15종 + 깔때기 + DB 다운로드', emoji: '📈' },
        { href: '/admin/requests', title: '업주 요청 관리', desc: 'LIVE + 시드 더미 30건', emoji: '📋' },
      ],
    },
  ]

  // 시연 모드 메뉴 — 관리자(platform_admin)만 노출
  if (role === 'platform_admin' && DEMO_MODE) {
    groups.push({
      title: '🎬 시연 모드 (관리자 전용)',
      color: 'zinc',
      items: [
        { href: '/demo', title: '시연 페이지', desc: '6개 페르소나 카드로 원클릭 로그인', emoji: '🎭' },
        { href: '/dashboard', title: '투자자 대시보드', desc: '로그인 없이 KPI 한눈에', emoji: '📊' },
        { href: '/students', title: '학생 전체 명단', desc: '50명 필터 가능', emoji: '👥' },
        { href: '/employers', title: '업체 전체 명단', desc: '등록 가게 카드', emoji: '🏬' },
        { href: '/reviews', title: '쌍방향 평가', desc: '누적 평가 사례', emoji: '⭐' },
      ],
    })
  }

  groups.push({
    title: '🔗 외부 연동',
    color: 'zinc',
    items: [
      {
        href: 'https://test-me-ecru.vercel.app/유학생-아르바이트-체커/index.html',
        title: '유학생 비자 자가진단 체커',
        desc: '8단계로 합법 알바 여부 확인 (별도 사이트)',
        emoji: '🇰🇷',
        external: true,
      },
    ],
  })

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">🗺️ 전체메뉴</h1>
      <p className="mt-1 text-sm text-zinc-500">
        K-MOM의 모든 페이지를 한눈에. 클릭해서 바로 이동할 수 있어요.
        {user && role && (
          <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
            현재 로그인: {role}
          </span>
        )}
      </p>

      <div className="mt-8 space-y-8">
        {groups.map((group) => {
          const colors = COLOR_MAP[group.color]
          return (
            <section key={group.title}>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <span className={`rounded-md px-2 py-0.5 text-xs ${colors.chip}`}>
                  {group.title}
                </span>
                <span className="text-xs text-zinc-400">{group.items.length}개</span>
              </h2>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <MenuCard
                    key={item.href}
                    href={item.href}
                    title={item.title}
                    desc={item.desc}
                    emoji={item.emoji}
                    external={item.external}
                    borderClass={colors.border}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-12 rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500 dark:bg-zinc-900">
        ℹ️ 페이지 권한: 학생·업주·학교·운영자 메뉴는 해당 역할 로그인 시에만 정상 작동합니다.
        로그인 안 한 상태에서 누르면 로그인 화면으로 이동해요.
      </div>
    </main>
  )
}

function MenuCard({
  href,
  title,
  desc,
  emoji,
  external,
  borderClass,
}: {
  href: string
  title: string
  desc: string
  emoji?: string
  external?: boolean
  borderClass: string
}) {
  const linkProps = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}
  return (
    <Link
      href={href}
      {...linkProps}
      className={`group flex items-start gap-3 rounded-xl border bg-white p-3 transition hover:border-zinc-400 hover:shadow-md dark:bg-zinc-900 dark:hover:border-zinc-500 ${borderClass}`}
    >
      {emoji && <span className="text-2xl shrink-0">{emoji}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {title}
          {external && <span className="ml-1 text-xs text-zinc-400">↗</span>}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">{desc}</p>
        <p className="mt-1 truncate font-mono text-[10px] text-zinc-400">{href}</p>
      </div>
      <span className="shrink-0 self-center text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-500">
        →
      </span>
    </Link>
  )
}
