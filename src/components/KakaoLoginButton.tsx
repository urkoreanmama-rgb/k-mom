'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function KakaoLoginButton({
  label = '카카오로 계속하기',
  full = true,
}: {
  label?: string
  full?: boolean
}) {
  const supabase = createClient()
  const [pending, setPending] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onClick() {
    setPending(true)
    setErr(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setErr(error.message)
      setPending(false)
    }
    // 성공 시 카카오 페이지로 리다이렉트 — 여기서는 더 할 일 없음
  }

  return (
    <div className={full ? 'w-full' : ''}>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={
          (full ? 'w-full ' : '') +
          'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 text-sm font-bold text-[#191919] hover:bg-[#FDD835] disabled:opacity-60'
        }
      >
        {/* 카카오 로고 SVG (간단 버전) */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 1.5C4.86 1.5 1.5 4.16 1.5 7.44c0 2.13 1.42 4 3.53 5.04l-.9 3.28c-.08.3.24.54.5.37l3.93-2.6c.14.01.29.02.44.02 4.14 0 7.5-2.66 7.5-5.95C16.5 4.16 13.14 1.5 9 1.5z"
            fill="#191919"
          />
        </svg>
        {pending ? '카카오로 이동 중...' : label}
      </button>
      {err && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {err.includes('not enabled') || err.includes('disabled')
            ? '아직 카카오 로그인이 활성화되지 않았어요. 관리자에게 문의하세요.'
            : err}
        </p>
      )}
    </div>
  )
}
