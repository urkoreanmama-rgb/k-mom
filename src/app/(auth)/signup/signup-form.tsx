'use client'

import { useActionState } from 'react'
import { signup, type AuthFormState } from '@/app/actions/auth'
import type { UserRole } from '@/lib/supabase/types'

export default function SignupForm({ defaultRole }: { defaultRole: UserRole }) {
  const [state, action, pending] = useActionState<AuthFormState | undefined, FormData>(
    signup,
    undefined,
  )

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="role" defaultValue={defaultRole} />

      <div>
        <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">역할</span>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {(['student', 'employer', 'school_admin'] as UserRole[]).map((r) => (
            <RoleRadio key={r} role={r} defaultRole={defaultRole} />
          ))}
        </div>
      </div>

      <Field label="이름" name="name" type="text" required autoComplete="name" />
      <Field label="이메일" name="email" type="email" required autoComplete="email" />
      <Field
        label="비밀번호 (6자 이상)"
        name="password"
        type="password"
        required
        minLength={6}
        autoComplete="new-password"
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
        {pending ? '가입 중...' : '가입하기'}
      </button>
    </form>
  )
}

function RoleRadio({ role, defaultRole }: { role: UserRole; defaultRole: UserRole }) {
  const label = role === 'student' ? '학생' : role === 'employer' ? '업주' : '학교'
  return (
    <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium has-checked:border-zinc-900 has-checked:bg-zinc-900 has-checked:text-white dark:border-zinc-700 dark:has-checked:border-white dark:has-checked:bg-white dark:has-checked:text-zinc-900">
      <input
        type="radio"
        name="role"
        value={role}
        defaultChecked={role === defaultRole}
        className="sr-only"
      />
      {label}
    </label>
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
