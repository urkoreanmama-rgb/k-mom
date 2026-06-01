import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'
import MyComplianceScore from '@/components/MyComplianceScore'
import CandidatePreviewCard from '@/components/CandidatePreviewCard'
import { buildComplianceChecklist } from '@/lib/compliance'
import { buildStudentCardData } from '@/lib/student-card-data'

export default async function StudentProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: me } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const checklist = buildComplianceChecklist({
    user: me!,
    profile: profile ?? null,
    enrollmentStatus: profile?.enrollment_status ?? 'unknown',
    immigrationPermitStatus: profile?.immigration_permit_status ?? 'unknown',
    isSemester: isSemesterNow(),
  })

  // 업주가 보는 미리보기 카드 데이터
  const previewData = await buildStudentCardData(supabase, user.id, me?.email ?? '')

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">학생 프로필</h1>
      <p className="mt-1 text-sm text-zinc-500">
        업주는 이 정보를 보고 직접 연락합니다. 점수를 채울수록 매력적인 프로필이 돼요.
      </p>

      <div className="mt-6">
        <MyComplianceScore items={checklist} />
      </div>

      {/* 미리보기 카드 — 업주에게 어떻게 보이는지 */}
      {previewData && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">📇 내 프로필 미리보기</h2>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              업주가 보는 모습
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            평가가 누적될수록 별점·신뢰도·배지가 풍부해집니다.
          </p>
          <div className="mt-3">
            <CandidatePreviewCard student={previewData} />
          </div>
        </section>
      )}

      <ProfileForm user={me!} profile={profile ?? null} />
    </main>
  )
}

function isSemesterNow(date = new Date()): boolean {
  const month = date.getMonth() + 1
  return (month >= 3 && month <= 6) || (month >= 9 && month <= 12)
}
