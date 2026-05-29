// Next.js 16 Proxy (구 middleware) — Supabase 세션 갱신 + 라우트 보호
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PREFIXES = ['/student', '/employer', '/school', '/admin']
const PUBLIC_AUTH_ROUTES = ['/login', '/signup']

export async function proxy(request: NextRequest) {
  // 응답 객체를 만들어두고, Supabase가 쿠키를 set 할 때 여기에 누적
  let response = NextResponse.next({
    request: { headers: request.headers },
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
            request: { headers: request.headers },
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
  const isAuthRoute = PUBLIC_AUTH_ROUTES.includes(path)

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    // 로그인된 상태에서 /login·/signup 접근 → 학생 홈으로 (역할별 분기는 클라이언트가 따로 처리)
    const url = request.nextUrl.clone()
    url.pathname = '/student/profile'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // _next, 정적 파일 등 제외
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
