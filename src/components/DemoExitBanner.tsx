// 시연 모드 진입 후 페이지 상단 고정 배너
// "← 시연 모드로 돌아가기" 버튼 — 현재 데모 계정 로그아웃 + 관리자 자동 재로그인 + /demo 이동

import { cookies } from 'next/headers'
import { endDemoSession } from '@/app/actions/auth'

export default async function DemoExitBanner() {
  const store = await cookies()
  const inDemo = store.get('kmom_in_demo')?.value === '1'

  if (!inDemo) return null

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <p className="text-xs sm:text-sm font-medium flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            시연 모드
          </span>
          <span className="hidden sm:inline text-zinc-500">
            데모 계정으로 둘러보는 중입니다
          </span>
        </p>
        <form action={endDemoSession}>
          <button
            type="submit"
            className="btn-3d rounded-full px-4 py-1.5 text-xs font-medium"
          >
            시연 모드로 돌아가기
          </button>
        </form>
      </div>
    </div>
  )
}
