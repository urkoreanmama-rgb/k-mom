// 시연 모드 진입 후 페이지 상단 고정 배너
// "← 시연 모드로 돌아가기" 버튼 — 현재 데모 계정 로그아웃 + 관리자 자동 재로그인 + /demo 이동

import { cookies } from 'next/headers'
import { endDemoSession } from '@/app/actions/auth'

export default async function DemoExitBanner() {
  const store = await cookies()
  const inDemo = store.get('kmom_in_demo')?.value === '1'

  if (!inDemo) return null

  return (
    <div className="sticky top-0 z-40 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <p className="text-xs sm:text-sm font-medium flex items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
            시연 모드
          </span>
          <span className="hidden sm:inline opacity-80">
            데모 계정으로 둘러보는 중입니다
          </span>
        </p>
        <form action={endDemoSession}>
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            시연 모드로 돌아가기
          </button>
        </form>
      </div>
    </div>
  )
}
