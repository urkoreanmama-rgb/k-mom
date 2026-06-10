// 시연 모드 진입 후 페이지 상단 고정 배너
// "← 시연 모드로 돌아가기" 버튼 — 현재 데모 계정 로그아웃 + 관리자 자동 재로그인 + /demo 이동

import { cookies } from 'next/headers'
import { endDemoSession } from '@/app/actions/auth'

export default async function DemoExitBanner() {
  const store = await cookies()
  const inDemo = store.get('kmom_in_demo')?.value === '1'

  if (!inDemo) return null

  return (
    <div className="sticky top-0 z-40 bg-amber-100 border-b-2 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <span className="rounded-full bg-amber-900 text-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide dark:bg-amber-200 dark:text-amber-900">
            🎬 시연 모드
          </span>
          <span className="hidden sm:inline">
            데모 계정으로 둘러보는 중입니다
          </span>
        </p>
        <form action={endDemoSession}>
          <button
            type="submit"
            className="rounded-md bg-amber-900 text-amber-50 px-3 py-1.5 text-xs font-bold hover:bg-amber-800 dark:bg-amber-200 dark:text-amber-900 dark:hover:bg-amber-300"
          >
            ← 시연 모드로 돌아가기
          </button>
        </form>
      </div>
    </div>
  )
}
