import LoginForm from './login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← 홈으로
        </Link>
        <h1 className="mt-4 text-3xl font-bold">로그인</h1>
        <p className="mt-1 text-sm text-zinc-500">K-MOM 계정으로 로그인하세요.</p>
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
