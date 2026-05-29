import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'

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

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">학생 프로필</h1>
      <p className="mt-1 text-sm text-zinc-500">
        업주는 이 정보를 보고 직접 연락합니다. 신뢰감 있게 작성하세요.
      </p>
      <ProfileForm user={me!} profile={profile ?? null} />
    </main>
  )
}
