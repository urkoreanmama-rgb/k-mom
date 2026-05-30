'use client'

import { useState } from 'react'
import { submitCriteria } from './actions'
import { DEMO_SCENARIOS } from '@/data/demo-scenarios'

const LANGUAGES = ['베트남어', '중국어', '영어', '러시아어', '기타'] as const
const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const
const TIME_SLOTS = ['오전', '오후', '저녁'] as const
const AREAS = ['대림', '건대', '홍대', '명동', '기타'] as const
const JOB_TYPES = [
  '홀서빙',
  '손님 응대',
  '계산',
  '상품 설명',
  '주방 보조',
  '기타',
] as const
const KOREAN_LEVELS = ['기초', '일상 대화 가능', '중급 이상'] as const
const DURATIONS = [
  { value: 'short', label: '단기 (1주 ~ 4주)' },
  { value: 'one_month', label: '한 달 이상' },
  { value: 'three_month', label: '세 달 이상' },
  { value: 'long', label: '장기 (6개월+)' },
] as const

// 시연용: 첫 시나리오 값으로 초기 폼 채우기 (투자자가 빈 폼 보지 않게)
const DEFAULTS = DEMO_SCENARIOS[0].criteria

export default function MatchCriteriaForm() {
  const [pending, setPending] = useState(false)

  return (
    <form
      action={async (fd) => {
        setPending(true)
        await submitCriteria(fd)
      }}
      className="space-y-6"
    >
      <CheckboxGroup
        name="requiredLanguages"
        label="필요 언어 (복수 선택 가능)"
        options={LANGUAGES}
        defaults={DEFAULTS.requiredLanguages}
        required
      />
      <CheckboxGroup
        name="workDays"
        label="근무 요일 (복수 선택)"
        options={DAYS}
        defaults={DEFAULTS.workDays}
        required
      />
      <CheckboxGroup
        name="workTimeSlots"
        label="근무 시간대 (복수 선택)"
        options={TIME_SLOTS}
        defaults={DEFAULTS.workTimeSlots}
        required
      />
      <CheckboxGroup
        name="areas"
        label="근무 지역 (복수 선택)"
        options={AREAS}
        defaults={DEFAULTS.areas as readonly string[]}
        required
      />
      <CheckboxGroup
        name="jobTypes"
        label="업무 유형 (복수 선택)"
        options={JOB_TYPES}
        defaults={DEFAULTS.jobTypes}
        required
      />

      <RadioGroup
        name="koreanLevel"
        label="필요한 한국어 수준"
        options={KOREAN_LEVELS.map((v) => ({ value: v, label: v }))}
        defaultValue={DEFAULTS.koreanLevel ?? undefined}
      />

      <RadioGroup
        name="duration"
        label="근무 기간"
        options={DURATIONS.map((d) => ({ value: d.value, label: d.label }))}
        defaultValue={DEFAULTS.duration ?? undefined}
      />

      <NumberField
        name="hourlyWage"
        label="시급 (원)"
        placeholder="예: 10030 (2026년 최저시급)"
        min={9000}
        step={100}
        defaultValue={DEFAULTS.hourlyWage ?? undefined}
      />

      <RadioGroup
        name="hasForeignHiringExperience"
        label="외국인 유학생 채용 경험"
        options={[
          { value: 'has', label: '있음' },
          { value: 'none', label: '없음' },
        ]}
        defaultValue={DEFAULTS.hasForeignHiringExperience ?? undefined}
      />

      <RadioGroup
        name="docReadiness"
        label="시간제취업 서류 준비 가능 여부"
        options={[
          { value: 'ready', label: '가능 — 직접 처리할 수 있어요' },
          { value: 'needs_help', label: '도움이 필요해요' },
          { value: 'unsure', label: '아직 잘 모르겠어요' },
        ]}
        defaultValue={DEFAULTS.docReadiness ?? undefined}
      />

      <div className="rounded-md bg-zinc-50 px-4 py-3 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
        <strong className="text-zinc-700 dark:text-zinc-300">안내:</strong> K-MOM은 조건에
        맞는 후보를 사전 필터링합니다. 최종 확인은 학교와 출입국 기준에 따릅니다. 연락처는
        요청 후 관리자 확인을 거쳐 전달됩니다.
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? '계산 중...' : '조건에 맞는 후보 수 확인하기 →'}
      </button>
    </form>
  )
}

function CheckboxGroup({
  name,
  label,
  options,
  defaults = [],
  required = false,
}: {
  name: string
  label: string
  options: readonly string[]
  defaults?: readonly string[]
  required?: boolean
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 has-[input:checked]:border-emerald-600 has-[input:checked]:bg-emerald-50 has-[input:checked]:text-emerald-800 dark:has-[input:checked]:bg-emerald-950/40 dark:has-[input:checked]:text-emerald-300"
          >
            <input
              type="checkbox"
              name={name}
              value={opt}
              defaultChecked={defaults.includes(opt)}
              className="h-4 w-4"
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function RadioGroup({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string
  label: string
  options: { value: string; label: string }[]
  defaultValue?: string
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 has-[input:checked]:border-emerald-600 has-[input:checked]:bg-emerald-50 has-[input:checked]:text-emerald-800 dark:has-[input:checked]:bg-emerald-950/40 dark:has-[input:checked]:text-emerald-300"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={defaultValue === opt.value}
              className="h-4 w-4"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function NumberField({
  name,
  label,
  defaultValue,
  ...props
}: {
  name: string
  label: string
  defaultValue?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      <input
        {...props}
        type="number"
        name={name}
        defaultValue={defaultValue}
        className="mt-1 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  )
}
