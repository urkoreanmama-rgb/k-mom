'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Employer, User } from '@/lib/supabase/types'

// D-2 유학생 시간제취업 가능 업종 (체커와 일치)
const CATEGORIES = [
  '음식점·카페',
  '편의점·마트',
  '판매·매장 보조',
  '면세점',
  '관광 안내',
  '통역·번역',
  '사무 보조',
  '행사·이벤트',
  '뷰티·미용 보조',
  '교육·학원 보조',
  '제조업·공장',
  '기타',
]

export default function EmployerProfileForm({
  user,
  employer,
}: {
  user: User
  employer: Employer | null
}) {
  const supabase = createClient()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({})

  const [contactName, setContactName] = useState(user.name ?? '')
  const [phone, setPhone] = useState(user.phone ?? '')
  const [businessName, setBusinessName] = useState(employer?.business_name ?? '')
  const [category, setCategory] = useState(employer?.category ?? CATEGORIES[0])
  const [address, setAddress] = useState(employer?.address ?? '')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg({})

    if (!businessName.trim()) {
      setMsg({ err: '상호명을 입력해주세요.' })
      return
    }

    start(async () => {
      const { error: e1 } = await supabase
        .from('users')
        .update({ name: contactName, phone })
        .eq('id', user.id)
      if (e1) {
        setMsg({ err: e1.message })
        return
      }

      const { error: e2 } = await supabase.from('employers').upsert({
        user_id: user.id,
        business_name: businessName.trim(),
        category,
        address: address.trim() || null,
      })
      if (e2) {
        setMsg({ err: e2.message })
        return
      }

      setMsg({ ok: '저장됐어요. 학생 검색에서 이 상호명으로 보입니다.' })
    })
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-6">
      <fieldset className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <legend className="text-sm font-semibold">가게 정보</legend>

        <Field
          label="상호명 (학생에게 표시됨)"
          value={businessName}
          onChange={setBusinessName}
          required
          placeholder="예: 카페 라떼 강남점"
        />

        <Select
          label="업종"
          value={category}
          onChange={setCategory}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        <Field
          label="주소 (선택)"
          value={address}
          onChange={setAddress}
          placeholder="예: 서울시 강남구 테헤란로 123"
        />
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <legend className="text-sm font-semibold">담당자 정보</legend>

        <Field
          label="담당자 이름"
          value={contactName}
          onChange={setContactName}
          required
        />
        <Field
          label="연락처 (선택)"
          value={phone}
          onChange={setPhone}
          placeholder="010-0000-0000"
        />
        <p className="text-xs text-zinc-500">
          담당자 정보는 학생이 채용 단계에 진입했을 때만 보입니다. 검색 단계에서는
          상호명만 표시됩니다.
        </p>
      </fieldset>

      <div className="rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>합법 채용 안내:</strong> 유학생을 채용하려면 출입국·외국인관서장의
        사전 허가가 필요합니다. K-MOM은 직업소개가 아닌 학생 정보 제공 서비스이며,
        실제 허가는 업주가 직접 신청하셔야 합니다.
      </div>

      {msg.err && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {msg.err}
        </p>
      )}
      {msg.ok && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {msg.ok}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  ...props
}: {
  label: string
  value: string
  onChange: (v: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
