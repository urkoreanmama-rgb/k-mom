'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatTopikLevel, formatVisaType, getWeeklyWorkLimit } from '@/lib/visa-rules'
import type {
  EnrollmentStatus,
  ImmigrationPermitStatus,
  StudentProfile,
  TopikLevel,
  User,
  VisaType,
} from '@/lib/supabase/types'

const VISA_OPTIONS: VisaType[] = [
  'D-2-1', 'D-2-2', 'D-2-3', 'D-2-4', 'D-2-6', 'D-2-7', 'D-2-8', 'D-4', 'other',
]
const TOPIK_OPTIONS: TopikLevel[] = [
  'none', 'level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6',
]

export default function ProfileForm({
  user,
  profile,
}: {
  user: User
  profile: StudentProfile | null
}) {
  const supabase = createClient()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({})

  const [name, setName] = useState(user.name ?? '')
  const [nationality, setNationality] = useState(user.nationality ?? '')
  const [visa, setVisa] = useState<VisaType>(user.visa_type ?? 'D-2-2')
  const [topik, setTopik] = useState<TopikLevel>(profile?.topik_level ?? 'none')
  const [intro, setIntro] = useState(profile?.intro ?? '')
  const [skillsRaw, setSkillsRaw] = useState((profile?.skills ?? []).join(', '))
  const [enrollment, setEnrollment] = useState<EnrollmentStatus>(
    profile?.enrollment_status ?? 'unknown',
  )
  const [permit, setPermit] = useState<ImmigrationPermitStatus>(
    profile?.immigration_permit_status ?? 'unknown',
  )

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg({})

    start(async () => {
      const skills = skillsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const { error: e1 } = await supabase
        .from('users')
        .update({ name, nationality, visa_type: visa })
        .eq('id', user.id)
      if (e1) {
        setMsg({ err: e1.message })
        return
      }

      const { error: e2 } = await supabase
        .from('student_profiles')
        .upsert({
          user_id: user.id,
          topik_level: topik,
          intro,
          skills,
          enrollment_status: enrollment,
          immigration_permit_status: permit,
        })
      if (e2) {
        setMsg({ err: e2.message })
        return
      }

      setMsg({ ok: '저장됐어요.' })
    })
  }

  const semesterLimit = getWeeklyWorkLimit({
    visaType: visa,
    topikLevel: topik,
    isSemester: true,
  })
  const vacationLimit = getWeeklyWorkLimit({
    visaType: visa,
    topikLevel: topik,
    isSemester: false,
  })

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="font-medium text-emerald-900 dark:text-emerald-200">
          내 합법 근무 시간 (자동 계산)
        </p>
        <p className="mt-1 text-emerald-800 dark:text-emerald-300">
          학기 중: <b>{semesterLimit === Infinity ? '무제한' : `주 ${semesterLimit}시간`}</b> · 방학 중:{' '}
          <b>{vacationLimit === Infinity ? '무제한' : `주 ${vacationLimit}시간`}</b>
        </p>
        <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
          비자 {formatVisaType(visa)} · TOPIK {formatTopikLevel(topik)} 기준
        </p>
      </div>

      <Field label="이름" value={name} onChange={setName} required />
      <Field label="국적" value={nationality} onChange={setNationality} />

      <Select
        label="비자 종류"
        value={visa}
        onChange={(v) => setVisa(v as VisaType)}
        options={VISA_OPTIONS.map((v) => ({ value: v, label: formatVisaType(v) }))}
      />
      <Select
        label="TOPIK 등급"
        value={topik}
        onChange={(v) => setTopik(v as TopikLevel)}
        options={TOPIK_OPTIONS.map((t) => ({ value: t, label: formatTopikLevel(t) }))}
      />

      <Select
        label="학적 상태"
        value={enrollment}
        onChange={(v) => setEnrollment(v as EnrollmentStatus)}
        options={[
          { value: 'enrolled', label: '재학 중' },
          { value: 'on_leave', label: '휴학 중' },
          { value: 'graduated', label: '졸업·수료' },
          { value: 'unknown', label: '미입력' },
        ]}
      />

      <Select
        label="시간제취업 허가 상태"
        value={permit}
        onChange={(v) => setPermit(v as ImmigrationPermitStatus)}
        options={[
          { value: 'not_applied', label: '아직 신청 안 함' },
          { value: 'applied', label: '신청 중 (결과 대기)' },
          { value: 'approved', label: '허가 완료' },
          { value: 'unknown', label: '미입력' },
        ]}
      />

      <label className="block">
        <span className="block text-sm font-medium">자기소개</span>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={5}
          placeholder="어떤 업무에 강한지, 어떤 환경에서 잘 일하는지 알려주세요."
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      <Field
        label="할 수 있는 일 (쉼표로 구분)"
        value={skillsRaw}
        onChange={setSkillsRaw}
        placeholder="예: 카페 서빙, 번역, 사진 촬영"
      />

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
        {pending ? '저장 중...' : '프로필 저장'}
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
