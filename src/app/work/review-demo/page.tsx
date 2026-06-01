'use client'

import { useState } from 'react'

type Tab = 'student' | 'employer'

function StarPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={`text-2xl transition-colors ${
              i <= value ? 'text-amber-400' : 'text-zinc-200 dark:text-zinc-700 hover:text-amber-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

function YesNoPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
            value === true
              ? 'border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'
          }`}
        >
          예
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
            value === false
              ? 'border-red-400 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'
          }`}
        >
          아니오
        </button>
      </div>
    </div>
  )
}

function SuccessBox() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
      <p className="text-base font-semibold text-emerald-800 dark:text-emerald-200">
        평가가 저장되었습니다.
      </p>
      <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
        이 평가는 학생과 업체가 서로 더 신뢰할 수 있는 K-MOM 신뢰 이력에 반영됩니다.
      </p>
    </div>
  )
}

function StudentReviewForm() {
  const [ratings, setRatings] = useState({
    wageOnTime: 0,
    jobMatchAccuracy: 0,
    workEnvironment: 0,
    studentRespect: 0,
    documentSupport: 0,
    wouldReturn: null as boolean | null,
  })
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function setRating(key: keyof typeof ratings, val: number | boolean | null) {
    setRatings((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) return <SuccessBox />

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500">평가 대상 업체</p>
        <p className="mt-1 text-lg font-bold">쌀국수 호아 대림점</p>
        <p className="text-xs text-zinc-400">대림 · 베트남 음식 · K-MOM 인증 업체</p>
      </div>

      <div className="space-y-5">
        <StarPicker
          label="1. 급여가 약속한 날짜에 지급되었나요?"
          value={ratings.wageOnTime}
          onChange={(v) => setRating('wageOnTime', v)}
        />
        <StarPicker
          label="2. 공고 내용과 실제 업무가 일치했나요?"
          value={ratings.jobMatchAccuracy}
          onChange={(v) => setRating('jobMatchAccuracy', v)}
        />
        <StarPicker
          label="3. 근무 환경이 안전했나요?"
          value={ratings.workEnvironment}
          onChange={(v) => setRating('workEnvironment', v)}
        />
        <StarPicker
          label="4. 외국인 학생을 존중해주었나요?"
          value={ratings.studentRespect}
          onChange={(v) => setRating('studentRespect', v)}
        />
        <StarPicker
          label="5. 시간제취업 서류 준비에 협조해주었나요?"
          value={ratings.documentSupport}
          onChange={(v) => setRating('documentSupport', v)}
        />
        <YesNoPicker
          label="6. 다시 일하고 싶은 업체인가요?"
          value={ratings.wouldReturn}
          onChange={(v) => setRating('wouldReturn', v)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          자유 코멘트 <span className="text-zinc-400">(최대 200자)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 200))}
          placeholder="업체에 대한 솔직한 의견을 남겨주세요."
          rows={4}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600"
        />
        <p className="text-right text-xs text-zinc-400">{comment.length}/200</p>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        평가 제출하기
      </button>
    </form>
  )
}

function EmployerReviewForm() {
  const [ratings, setRatings] = useState({
    punctuality: 0,
    noShow: null as boolean | null,
    workAttitude: 0,
    customerService: 0,
    koreanCommunication: 0,
    wouldRehire: null as boolean | null,
  })
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function setRating(key: keyof typeof ratings, val: number | boolean | null) {
    setRatings((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) return <SuccessBox />

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500">평가 대상 학생</p>
        <p className="mt-1 text-lg font-bold">응우옌 티 화 (화)</p>
        <p className="text-xs text-zinc-400">베트남 · D-2-2 · 서울시립대학교 · TOPIK 4급</p>
      </div>

      <div className="space-y-5">
        <StarPicker
          label="1. 약속된 시간에 출근했나요?"
          value={ratings.punctuality}
          onChange={(v) => setRating('punctuality', v)}
        />
        <YesNoPicker
          label="2. 무단결근이 없었나요?"
          value={ratings.noShow}
          onChange={(v) => setRating('noShow', v)}
        />
        <StarPicker
          label="3. 업무 태도가 성실했나요?"
          value={ratings.workAttitude}
          onChange={(v) => setRating('workAttitude', v)}
        />
        <StarPicker
          label="4. 손님 응대가 적절했나요?"
          value={ratings.customerService}
          onChange={(v) => setRating('customerService', v)}
        />
        <StarPicker
          label="5. 한국어 소통이 가능했나요?"
          value={ratings.koreanCommunication}
          onChange={(v) => setRating('koreanCommunication', v)}
        />
        <YesNoPicker
          label="6. 다시 채용하고 싶은 학생인가요?"
          value={ratings.wouldRehire}
          onChange={(v) => setRating('wouldRehire', v)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          자유 코멘트
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="학생에 대한 솔직한 의견을 남겨주세요."
          rows={4}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700"
      >
        평가 제출하기
      </button>
    </form>
  )
}

export default function ReviewDemoPage() {
  const [tab, setTab] = useState<Tab>('student')

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          INVESTOR DEMO
        </p>
        <h1 className="mt-1 text-3xl font-bold">쌍방향 평가 작성 시연</h1>
        <p className="mt-1 text-sm text-zinc-500">
          학생과 업주가 서로를 평가하는 K-MOM 신뢰 이력 시스템
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mt-8 flex rounded-xl border border-zinc-200 p-1 dark:border-zinc-800">
        <button
          onClick={() => setTab('student')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            tab === 'student'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          학생이 업체 평가하기
        </button>
        <button
          onClick={() => setTab('employer')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            tab === 'employer'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          업주가 학생 평가하기
        </button>
      </div>

      <div className="mt-8">
        {tab === 'student' ? <StudentReviewForm /> : <EmployerReviewForm />}
      </div>
    </main>
  )
}
