// 서버(Server Component / Server Action / Route Handler)용 Supabase 클라이언트
// Next.js 16: cookies()는 async — await 필수
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component 안에서 호출 시 set 실패해도 무시
            // (Server Action / Route Handler에서만 set 가능)
          }
        },
      },
    }
  )
}
