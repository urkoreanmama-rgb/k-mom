// OAuth 콜백 — Supabase가 인증 후 ?code=... 로 돌려보냄 → session 발급 → role 따라 리다이렉트
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error_description') || searchParams.get('error')

  if (errorParam) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorParam)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // 로그인된 사용자 role에 따라 적절한 곳으로 보냄
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user_after_callback`)
  }

  const { data: row } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = row?.role ?? 'student'
  const dest =
    role === 'student'
      ? '/student/profile'
      : role === 'employer'
        ? '/employer/profile'
        : role === 'school_admin'
          ? '/school/dashboard'
          : role === 'platform_admin'
            ? '/admin/dashboard'
            : '/'

  return NextResponse.redirect(`${origin}${dest}`)
}
