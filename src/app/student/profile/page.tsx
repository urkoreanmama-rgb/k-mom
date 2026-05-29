import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'
import MyComplianceScore from '@/components/MyComplianceScore'
import { buildComplianceChecklist } from '@/lib/compliance'

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

  // 학생 본인용 체크리스트 — 실제 DB의 enrollment/permit 사용
  const checklist = buildComplianceChecklist({
    user: me!,
    profile: profile ?? null,
    enrollmentStatus: profile?.enrollment_status ?? 'unknown',
    immigrationPermitStatus: profile?.immigration_permit_status ?? 'unknown',
    isSemester: isSemesterNow(),
  })

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">학생 프로필</h1>
      <p className="mt-1 text-sm text-zinc-500">
        업주는 이 정보를 보고 직접 연락합니다. 점수를 채울수록 매력적인 프로필이 돼요.
      </p>

      <div className="mt-6">
        <MyComplianceScore items={checklist} />
      </div>

      <ProfileForm user={me!} profile={profile ?? null} />
    </main>
  )
}

function isSemesterNow(date = new Date()): boolean {
  const month = date.getMonth() + 1
  return (month >= 3 && month <= 6) || (month >= 9 && month <= 12)
}
