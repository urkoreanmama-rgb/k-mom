'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  type ResumeData,
  type ResumeEducation,
  type ResumeExperience,
  type ResumeCertification,
  type ResumeLanguage,
  resumeCompleteness,
} from '@/lib/resume'

const GRADE_OPTIONS = ['1학년', '2학년', '3학년', '4학년', '대학원생', '졸업', '수료']

export default function ResumeForm({
  userId,
  initial,
}: {
  userId: string
  initial: ResumeData
}) {
  const supabase = createClient()
  const [pending, start] = useTransition()
  const [data, setData] = useState<ResumeData>(initial)
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({})

  const pct = resumeCompleteness(data)

  function update<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  function onSave() {
    setMsg({})
    start(async () => {
      const { error } = await supabase
        .from('student_profiles')
        .upsert({ user_id: userId, resume_json: data as unknown as Record<string, unknown> })
      if (error) {
        setMsg({ err: error.message })
        return
      }
      setMsg({ ok: '저장됐어요. 업주가 받았을 때 이렇게 보입니다.' })
    })
  }

  return (
    <div className="space-y-8">
      {/* 완성도 게이지 */}
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
            이력서 완성도
          </p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{pct}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white dark:bg-zinc-900">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
          {pct < 50 && '아직 부족해요. 학력·경력·자기소개를 채워주세요.'}
          {pct >= 50 && pct < 100 && '조금만 더 채우면 더 매력적인 이력서가 돼요.'}
          {pct === 100 && '🎉 완벽! 업주가 안심하고 보는 프로필이에요.'}
        </p>
      </div>

      {/* 인적사항 */}
      <Section title="① 인적사항" desc="기본 정보입니다.">
        <Row2>
          <Field label="이름" value={data.basicInfo.fullName ?? ''} onChange={(v) => update('basicInfo', { ...data.basicInfo, fullName: v })} />
          <Field label="국적" value={data.basicInfo.nationality ?? ''} onChange={(v) => update('basicInfo', { ...data.basicInfo, nationality: v })} />
        </Row2>
        <Row2>
          <Field label="비자" value={data.basicInfo.visaType ?? ''} onChange={(v) => update('basicInfo', { ...data.basicInfo, visaType: v })} placeholder="D-2-2" />
          <NumberField label="출생년도" value={data.basicInfo.birthYear} onChange={(v) => update('basicInfo', { ...data.basicInfo, birthYear: v })} placeholder="2002" />
        </Row2>
        <Row2>
          <Field label="연락처" value={data.basicInfo.phone ?? ''} onChange={(v) => update('basicInfo', { ...data.basicInfo, phone: v })} placeholder="010-0000-0000" />
          <Field label="거주지" value={data.basicInfo.address ?? ''} onChange={(v) => update('basicInfo', { ...data.basicInfo, address: v })} placeholder="서울시 동대문구" />
        </Row2>
      </Section>

      {/* 학력 */}
      <Section
        title="② 학력"
        desc="현재 다니고 있는 학교 + 이전 학력."
        onAdd={() =>
          update('education', [
            ...data.education,
            { school: '', major: '', grade: '1학년', startDate: '', endDate: '재학중' },
          ])
        }
      >
        {data.education.length === 0 && <Empty text="아직 학력 정보가 없어요. + 추가 버튼을 눌러주세요." />}
        {data.education.map((edu, i) => (
          <ItemCard key={i} onDelete={() => update('education', data.education.filter((_, j) => j !== i))}>
            <Row2>
              <Field label="학교명" value={edu.school} onChange={(v) => updateList<ResumeEducation>('education', i, { ...edu, school: v }, data, setData)} placeholder="한국대학교" />
              <Field label="전공" value={edu.major} onChange={(v) => updateList<ResumeEducation>('education', i, { ...edu, major: v }, data, setData)} placeholder="컴퓨터공학" />
            </Row2>
            <Row2>
              <Select label="학년·상태" value={edu.grade} onChange={(v) => updateList<ResumeEducation>('education', i, { ...edu, grade: v }, data, setData)} options={GRADE_OPTIONS} />
              <Row2>
                <Field label="입학" value={edu.startDate} onChange={(v) => updateList<ResumeEducation>('education', i, { ...edu, startDate: v }, data, setData)} placeholder="2024-03" />
                <Field label="종료" value={edu.endDate} onChange={(v) => updateList<ResumeEducation>('education', i, { ...edu, endDate: v }, data, setData)} placeholder="재학중" />
              </Row2>
            </Row2>
          </ItemCard>
        ))}
      </Section>

      {/* 경력 */}
      <Section
        title="③ 경력 (알바·인턴 포함)"
        desc="없으면 비워둬도 OK. 시간순으로 자동 정렬됩니다."
        onAdd={() =>
          update('experience', [
            ...data.experience,
            { company: '', role: '', startDate: '', endDate: '', description: '' },
          ])
        }
      >
        {data.experience.length === 0 && <Empty text="아직 경력이 없어요. 신규 학생은 비워둬도 됩니다." />}
        {data.experience.map((exp, i) => (
          <ItemCard key={i} onDelete={() => update('experience', data.experience.filter((_, j) => j !== i))}>
            <Row2>
              <Field label="회사·가게명" value={exp.company} onChange={(v) => updateList<ResumeExperience>('experience', i, { ...exp, company: v }, data, setData)} placeholder="카페 라떼 강남점" />
              <Field label="직무" value={exp.role} onChange={(v) => updateList<ResumeExperience>('experience', i, { ...exp, role: v }, data, setData)} placeholder="홀서빙·바리스타" />
            </Row2>
            <Row2>
              <Field label="시작" value={exp.startDate} onChange={(v) => updateList<ResumeExperience>('experience', i, { ...exp, startDate: v }, data, setData)} placeholder="2023-06" />
              <Field label="종료" value={exp.endDate} onChange={(v) => updateList<ResumeExperience>('experience', i, { ...exp, endDate: v }, data, setData)} placeholder="2024-02" />
            </Row2>
            <TextArea label="업무 내용" value={exp.description} onChange={(v) => updateList<ResumeExperience>('experience', i, { ...exp, description: v }, data, setData)} rows={3} placeholder="고객 응대, 음료 제조, 매장 청소 등" />
          </ItemCard>
        ))}
      </Section>

      {/* 자격증 */}
      <Section
        title="④ 자격증"
        desc="TOPIK 외 다른 자격증·면허."
        onAdd={() =>
          update('certifications', [
            ...data.certifications,
            { name: '', issuer: '', date: '' },
          ])
        }
      >
        {data.certifications.length === 0 && <Empty text="자격증이 없으면 건너뛰세요." />}
        {data.certifications.map((c, i) => (
          <ItemCard key={i} onDelete={() => update('certifications', data.certifications.filter((_, j) => j !== i))}>
            <Row2>
              <Field label="자격증명" value={c.name} onChange={(v) => updateList<ResumeCertification>('certifications', i, { ...c, name: v }, data, setData)} placeholder="컴퓨터활용능력 2급" />
              <Field label="발급기관" value={c.issuer} onChange={(v) => updateList<ResumeCertification>('certifications', i, { ...c, issuer: v }, data, setData)} placeholder="대한상공회의소" />
            </Row2>
            <Field label="취득일" value={c.date} onChange={(v) => updateList<ResumeCertification>('certifications', i, { ...c, date: v }, data, setData)} placeholder="2023-08" />
          </ItemCard>
        ))}
      </Section>

      {/* 어학 */}
      <Section
        title="⑤ 어학"
        desc="한국어(TOPIK), 영어, 모국어 등 가능한 언어."
        onAdd={() =>
          update('languages', [
            ...data.languages,
            { language: '', level: '' },
          ])
        }
      >
        {data.languages.length === 0 && <Empty text="언어 능력 1개 이상 추가를 권장합니다." />}
        {data.languages.map((l, i) => (
          <ItemCard key={i} onDelete={() => update('languages', data.languages.filter((_, j) => j !== i))}>
            <Row2>
              <Field label="언어" value={l.language} onChange={(v) => updateList<ResumeLanguage>('languages', i, { ...l, language: v }, data, setData)} placeholder="한국어 / 영어 / 베트남어" />
              <Field label="수준" value={l.level} onChange={(v) => updateList<ResumeLanguage>('languages', i, { ...l, level: v }, data, setData)} placeholder="TOPIK 4급 / 비즈니스 / 원어민" />
            </Row2>
          </ItemCard>
        ))}
      </Section>

      {/* 자기소개서 */}
      <Section title="⑥ 자기소개서" desc="업주가 가장 먼저 읽는 부분이에요.">
        <TextArea
          label="자기소개"
          value={data.selfIntroduction ?? ''}
          onChange={(v) => update('selfIntroduction', v)}
          rows={8}
          placeholder={`예시: 안녕하세요, 베트남에서 온 응우옌 티 화입니다. 한국에 온 지 2년 됐고 한국어로 일상 대화가 가능합니다. 베트남 식당과 카페에서 1년 가까이 알바한 경험이 있고...`}
        />
      </Section>

      {/* 희망 조건 */}
      <Section
        title="⑦ 희망 근무 조건"
        desc="업주가 조건맞춤 매칭에서 사용합니다. 꼭 채워주세요."
      >
        {/* 근무 가능 요일 */}
        <CheckboxRow
          label="근무 가능 요일"
          options={['월', '화', '수', '목', '금', '토', '일']}
          values={data.preferences.availableDays ?? []}
          onChange={(vs) => update('preferences', { ...data.preferences, availableDays: vs })}
        />

        {/* 근무 가능 시간대 */}
        <CheckboxRow
          label="근무 가능 시간대"
          options={['오전', '오후', '저녁']}
          values={data.preferences.availableTimeSlots ?? []}
          onChange={(vs) =>
            update('preferences', { ...data.preferences, availableTimeSlots: vs })
          }
        />

        {/* 근무 기간 (라디오) */}
        <RadioRow
          label="근무 기간"
          options={['단기 (1주~4주)', '한 달 이상', '세 달 이상', '장기 (6개월+)']}
          value={data.preferences.workDuration ?? ''}
          onChange={(v) => update('preferences', { ...data.preferences, workDuration: v })}
        />

        {/* 희망 지역 (체크박스) */}
        <CheckboxRow
          label="희망 근무 지역"
          options={['대림', '건대', '홍대', '명동', '강남', '이태원', '기타']}
          values={data.preferences.desiredAreas ?? []}
          onChange={(vs) =>
            update('preferences', { ...data.preferences, desiredAreas: vs })
          }
        />

        {/* 희망 업종 (체크박스) */}
        <CheckboxRow
          label="희망 업종"
          options={[
            '홀서빙',
            '카페',
            '매장 판매',
            '주방 보조',
            '계산',
            '상품 설명',
            '통역·번역',
            '기타',
          ]}
          values={data.preferences.desiredJobTypes ?? []}
          onChange={(vs) =>
            update('preferences', { ...data.preferences, desiredJobTypes: vs })
          }
        />

        {/* 시급 + 가능 시간 자유 메모 */}
        <Row2>
          <NumberField
            label="희망 시급 (원)"
            value={data.preferences.desiredHourlyWage}
            onChange={(v) =>
              update('preferences', { ...data.preferences, desiredHourlyWage: v })
            }
            placeholder="10030"
          />
          <Field
            label="추가 메모"
            value={data.preferences.availabilityNote ?? ''}
            onChange={(v) =>
              update('preferences', { ...data.preferences, availabilityNote: v })
            }
            placeholder="예: 시험기간엔 주말만"
          />
        </Row2>
      </Section>

      {/* 저장 */}
      {msg.err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{msg.err}</p>}
      {msg.ok && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{msg.ok}</p>}

      <button
        onClick={onSave}
        disabled={pending}
        className="h-12 w-full rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? '저장 중...' : '이력서 저장'}
      </button>
    </div>
  )
}

// 헬퍼 — 리스트 아이템 업데이트
function updateList<T>(
  key: 'education' | 'experience' | 'certifications' | 'languages',
  index: number,
  newItem: T,
  data: ResumeData,
  setData: (d: ResumeData) => void,
) {
  const list = [...(data[key] as T[])]
  list[index] = newItem
  setData({ ...data, [key]: list })
}

// ============ UI 컴포넌트들 ============

function Section({
  title,
  desc,
  onAdd,
  children,
}: {
  title: string
  desc?: string
  onAdd?: () => void
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {desc && <p className="mt-0.5 text-xs text-zinc-500">{desc}</p>}
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="h-9 rounded-lg border border-zinc-300 px-3 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            + 추가
          </button>
        )}
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  )
}

function ItemCard({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="space-y-2">{children}</div>
      <button
        type="button"
        onClick={onDelete}
        className="mt-2 text-xs text-red-600 hover:underline dark:text-red-400"
      >
        삭제
      </button>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-950">
      {text}
    </p>
  )
}

function Row2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2 sm:grid-cols-2">{children}</div>
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: number | undefined
  onChange: (v: number | undefined) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        placeholder={placeholder}
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  )
}

function CheckboxRow({
  label,
  options,
  values,
  onChange,
}: {
  label: string
  options: string[]
  values: string[]
  onChange: (vs: string[]) => void
}) {
  function toggle(opt: string) {
    if (values.includes(opt)) onChange(values.filter((v) => v !== opt))
    else onChange([...values, opt])
  }
  return (
    <div>
      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const checked = values.includes(opt)
          return (
            <button
              type="button"
              key={opt}
              onClick={() => toggle(opt)}
              className={
                checked
                  ? 'h-9 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'h-9 rounded-lg border border-zinc-300 bg-white px-3 text-xs text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }
            >
              {checked ? '✓ ' : ''}{opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RadioRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const checked = value === opt
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(checked ? '' : opt)}
              className={
                checked
                  ? 'h-9 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'h-9 rounded-lg border border-zinc-300 bg-white px-3 text-xs text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }
            >
              {checked ? '● ' : '○ '}{opt}
            </button>
          )
        })}
      </div>
    </div>
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
  options: string[]
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
