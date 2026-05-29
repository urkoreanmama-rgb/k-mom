import LoginForm from './login-form'
import Link from 'next/link'
import KakaoLoginButton from '@/components/KakaoLoginButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← 홈으로
        </Link>
        <h1 className="mt-4 text-3xl font-bold">로그인</h1>
        <p className="mt-1 text-sm text-zinc-500">K-MOM 계정으로 로그인하세요.</p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            로그인 실패: {decodeURIComponent(error)}
          </p>
        )}

        {/* 카카오 — 학생용 추천 */}
        <div className="mt-6">
          <KakaoLoginButton label="카카오로 로그인" />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          <span>또는 이메일로</span>
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <LoginForm />

        <p className="mt-6 text-sm text-zinc-500">
          계정이 없나요?{' '}
          <Link href="/signup" className="font-medium underline">
            가입하기
          </Link>
        </p>
      </div>
    </main>
  )
}
