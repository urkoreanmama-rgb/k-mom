import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { formatTopikLevel, formatVisaType } from '@/lib/visa-rules'
import { buildComplianceChecklist } from '@/lib/compliance'
import ComplianceChecklist from '@/components/ComplianceChecklist'
import HireForm from './hire-form'

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: studentUser }] = await Promise.all([
    supabase.from('student_profiles').select('*').eq('user_id', id).maybeSingle(),
    supabase.from('users').select('*').eq('id', id).single(),
  ])

  if (!studentUser) notFound()

  const checklist = buildComplianceChecklist({
    user: studentUser,
    profile: profile ?? null,
    enrollmentStatus: profile?.enrollment_status ?? 'unknown',
    immigrationPermitStatus: profile?.immigration_permit_status ?? 'unknown',
    isSemester: isSemesterNow(),
  })

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/employer/search" className="text-sm text-zinc-500 hover:underline">
        ← 학생 프로필 열람으로
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{studentUser.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {studentUser.nationality ?? '국적 미입력'} ·{' '}
            {formatVisaType(studentUser.visa_type)} · TOPIK{' '}
            {formatTopikLevel(profile?.topik_level ?? 'none')}
          </p>
        </div>
        {profile?.verified_badge && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            학교 인증
          </span>
        )}
      </div>

      {/* 합법성 게이트키퍼 — 가장 위로 */}
      <div className="mt-6">
        <ComplianceChecklist items={checklist} />
      </div>

      {/* 자기소개 */}
      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">자기소개</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
          {profile?.intro ?? '학생이 아직 자기소개를 작성하지 않았어요.'}
        </p>
      </section>

      {profile?.skills && profile.skills.length > 0 && (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">할 수 있는 일</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 누적 실적 */}
      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">실적</h2>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          누적 근무 <strong>{profile?.total_work_hours ?? 0}시간</strong>
        </p>
      </section>

      {/* 액션 */}
      <div className="mt-8 space-y-4">
        <HireForm studentId={id} />

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium">학생과 직접 연락 (연락권 필요)</p>
          <p className="mt-1 text-sm text-zinc-500">
            Free 플랜은 이메일 직접 연결만 1회 무료입니다. 더 많은 연락은{' '}
            <Link href="/pricing" className="underline">
              Contact Pack
            </Link>{' '}
            을 구매하세요.
          </p>
          <a
            href={`mailto:${studentUser.email}?subject=K-MOM 합법 채용 사전 확인 문의`}
            className="mt-3 inline-flex h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-700"
          >
            이메일로 연락 (1회 무료)
          </a>
        </div>
      </div>
    </main>
  )
}

/**
 * 현재 학기/방학 자동 추정
 * 한국 대학 일반 학사력 기준: 3~6월, 9~12월 = 학기 / 1~2월, 7~8월 = 방학
 */
function isSemesterNow(date = new Date()): boolean {
  const month = date.getMonth() + 1
  return (month >= 3 && month <= 6) || (month >= 9 && month <= 12)
}
