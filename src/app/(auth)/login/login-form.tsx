'use client'

import { useActionState } from 'react'
import { login, type AuthFormState } from '@/app/actions/auth'

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthFormState | undefined, FormData>(
    login,
    undefined,
  )

  return (
    <form action={action} className="mt-6 space-y-4">
      <Field label="이메일" name="email" type="email" required autoComplete="email" />
      <Field
        label="비밀번호"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <input
        {...props}
        className="mt-1 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white dark:focus:ring-white"
      />
    </label>
  )
}
