// Next.js 16 Proxy (구 middleware) — Supabase 세션 갱신 + 라우트 보호
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PREFIXES = ['/student', '/employer', '/school', '/admin']
// (이전: 로그인 사용자가 /login·/signup 접근 시 자동 리다이렉트 → 제거
//  메인 페이지가 항상 비로그인 화면이라서 로그인된 사용자가 다시 로그인 폼에 접근 가능해야 함)

// 투자자 시현 모드 — 로그인 없이 접근 가능한 데모 경로
// NEXT_PUBLIC_DEMO_MODE !== 'false' 일 때만 활성. 운영에선 false로 설정.
const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
const DEMO_EXEMPT_PREFIXES = [
  '/employer/match',
  '/admin/dashboard',
  '/admin/requests',
  '/demo',
]
function isDemoExempt(path: string): boolean {
  if (!DEMO_MODE_ENABLED) return false
  return DEMO_EXEMPT_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
}

export async function proxy(request: NextRequest) {
  // Nav 컴포넌트가 현재 경로 알 수 있도록 헤더 주입
  // (메인 페이지 '/' 에서는 비로그인 Nav 표시용)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  // 응답 객체를 만들어두고, Supabase가 쿠키를 set 할 때 여기에 누적
  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({
            request: { headers: requestHeaders },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // 이걸 호출해야 세션이 자동 refresh됨 (필수)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p))

  // 시현 경로는 보호 우회
  if (isProtected && !user && !isDemoExempt(path)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // /login, /signup은 로그인 여부와 무관하게 항상 접근 가능
  // (메인 페이지가 비로그인 화면을 보이게 하므로, 로그인 사용자가 다른 계정으로
  // 다시 로그인할 수 있어야 함)

  return response
}

export const config = {
  matcher: [
    // _next, 정적 파일 등 제외
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
