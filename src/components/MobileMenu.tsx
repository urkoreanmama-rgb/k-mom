'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export interface NavItem {
  href: string
  label: string
  emphasis?: 'primary' | 'secondary' | 'highlight' // 시각적 강조
}

/**
 * 햄버거 메뉴 — 768px 이하에서만 보임
 * 데스크톱은 NavDesktop이 처리
 */
export default function MobileMenu({
  items,
  userName,
  isLoggedIn,
  isDemoMode,
}: {
  items: NavItem[]
  userName?: string
  isLoggedIn: boolean
  isDemoMode: boolean
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // 라우트 변경 시 자동 닫힘
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // ESC로 닫기
  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handle)
    // 스크롤 잠금
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handle)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* 드로어 */}
          <aside
            className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl dark:bg-zinc-900"
            role="dialog"
            aria-label="메뉴"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
              <span className="font-bold text-lg">메뉴</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="메뉴 닫기"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* 사용자 이름 */}
            {isLoggedIn && userName && (
              <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">로그인</p>
                <p className="mt-0.5 font-medium">{userName}</p>
              </div>
            )}

            {/* 메뉴 아이템 — 큰 터치 영역 */}
            <nav className="flex-1 overflow-y-auto p-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    item.emphasis === 'highlight'
                      ? 'mt-1 flex h-12 items-center rounded-lg bg-emerald-100 px-4 font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : item.emphasis === 'primary'
                        ? 'mt-1 flex h-12 items-center rounded-lg bg-zinc-900 px-4 font-medium text-white dark:bg-white dark:text-zinc-900'
                        : item.emphasis === 'secondary'
                          ? 'mt-1 flex h-12 items-center rounded-lg border border-zinc-300 px-4 dark:border-zinc-700'
                          : 'mt-1 flex h-12 items-center rounded-lg px-4 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }
                >
                  {item.label}
                </Link>
              ))}

              {/* 전체메뉴 — 항상 노출 */}
              <Link
                href="/sitemap-all"
                className="mt-3 flex h-12 items-center rounded-lg border border-zinc-300 px-4 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                🗺️ 전체메뉴
              </Link>

              {/* 시연 모드 버튼은 관리자 메뉴(items)에 포함되어 노출됨 — 여기는 비로그인 노출 안 함 */}
            </nav>
          </aside>
        </>
      )}
    </div>
  )
}
