// 업주가 받은 이력서를 깔끔하게 포맷팅해서 보여주는 컴포넌트
// 잡코리아·알바몬 이력서 PDF 같은 정돈된 레이아웃

import type { ResumeData } from '@/lib/resume'

export default function FormattedResume({ resume }: { resume: ResumeData }) {
  return (
    <article className="rounded-2xl border-2 border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
      {/* 헤더 (인적사항) */}
      {resume.basicInfo.fullName && (
        <header className="border-b-2 border-zinc-200 pb-4 dark:border-zinc-800">
          <h1 className="text-2xl font-bold">{resume.basicInfo.fullName}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            {resume.basicInfo.nationality && <span>🌐 {resume.basicInfo.nationality}</span>}
            {resume.basicInfo.visaType && <span>🛂 {resume.basicInfo.visaType}</span>}
            {resume.basicInfo.birthYear && <span>🎂 {resume.basicInfo.birthYear}년생</span>}
            {resume.basicInfo.phone && <span>📞 {resume.basicInfo.phone}</span>}
            {resume.basicInfo.address && <span>📍 {resume.basicInfo.address}</span>}
          </div>
        </header>
      )}

      {/* 학력 */}
      {resume.education.length > 0 && (
        <Block title="학력">
          {resume.education.map((edu, i) => (
            <Row
              key={i}
              left={
                <div>
                  <p className="font-medium">{edu.school}</p>
                  <p className="text-xs text-zinc-500">
                    {edu.major} · {edu.grade}
                  </p>
                </div>
              }
              right={`${edu.startDate} ~ ${edu.endDate}`}
            />
          ))}
        </Block>
      )}

      {/* 경력 */}
      {resume.experience.length > 0 && (
        <Block title="경력">
          {resume.experience.map((exp, i) => (
            <div key={i} className="border-l-2 border-emerald-400 pl-3">
              <Row
                left={
                  <div>
                    <p className="font-medium">{exp.company}</p>
                    <p className="text-xs text-zinc-500">{exp.role}</p>
                  </div>
                }
                right={`${exp.startDate} ~ ${exp.endDate}`}
              />
              {exp.description && (
                <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </Block>
      )}

      {/* 자격증 */}
      {resume.certifications.length > 0 && (
        <Block title="자격증">
          {resume.certifications.map((c, i) => (
            <Row
              key={i}
              left={
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-zinc-500">{c.issuer}</p>
                </div>
              }
              right={c.date}
            />
          ))}
        </Block>
      )}

      {/* 어학 */}
      {resume.languages.length > 0 && (
        <Block title="어학">
          <div className="flex flex-wrap gap-2">
            {resume.languages.map((l, i) => (
              <span
                key={i}
                className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-1 text-sm dark:border-sky-800 dark:bg-sky-950/40"
              >
                <strong>{l.language}</strong>
                <span className="ml-1 text-xs text-sky-700 dark:text-sky-300">{l.level}</span>
              </span>
            ))}
          </div>
        </Block>
      )}

      {/* 자기소개서 */}
      {resume.selfIntroduction && (
        <Block title="자기소개서">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {resume.selfIntroduction}
          </p>
        </Block>
      )}

      {/* 희망 조건 */}
      {(resume.preferences.desiredHourlyWage ||
        resume.preferences.availabilityNote ||
        (resume.preferences.desiredAreas?.length ?? 0) > 0 ||
        (resume.preferences.desiredJobTypes?.length ?? 0) > 0) && (
        <Block title="희망 근무 조건">
          {resume.preferences.desiredHourlyWage && (
            <Row label="희망 시급" value={`${resume.preferences.desiredHourlyWage.toLocaleString()}원`} />
          )}
          {resume.preferences.availabilityNote && (
            <Row label="가능 시간" value={resume.preferences.availabilityNote} />
          )}
          {(resume.preferences.desiredAreas?.length ?? 0) > 0 && (
            <Row label="희망 지역" value={resume.preferences.desiredAreas!.join(' · ')} />
          )}
          {(resume.preferences.desiredJobTypes?.length ?? 0) > 0 && (
            <Row label="희망 업종" value={resume.preferences.desiredJobTypes!.join(' · ')} />
          )}
        </Block>
      )}
    </article>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-zinc-200 pb-1.5 text-sm font-bold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

function Row({
  label,
  value,
  left,
  right,
}: {
  label?: string
  value?: string
  left?: React.ReactNode
  right?: React.ReactNode
}) {
  if (label !== undefined && value !== undefined) {
    return (
      <div className="flex justify-between text-sm">
        <span className="text-zinc-500">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    )
  }
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <div className="flex-1">{left}</div>
      {right && (
        <span className="shrink-0 text-xs text-zinc-500">{right}</span>
      )}
    </div>
  )
}
