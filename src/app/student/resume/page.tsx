import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ResumeForm from './resume-form'
import { emptyResume, type ResumeData } from '@/lib/resume'

export const metadata = { title: '이력서 작성 · K-MOM' }

export default async function ResumePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('resume_json')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: me } = await supabase.from('users').select('*').eq('id', user.id).single()

  const initial: ResumeData = (profile?.resume_json as ResumeData | null) ?? {
    ...emptyResume(),
    basicInfo: {
      fullName: me?.name,
      nationality: me?.nationality ?? undefined,
      visaType: me?.visa_type ?? undefined,
      phone: me?.phone ?? undefined,
    },
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/student/profile" className="text-sm text-zinc-500 hover:underline">
        ← 내 프로필로
      </Link>
      <h1 className="mt-4 text-3xl font-bold">📝 내 이력서 작성</h1>
      <p className="mt-1 text-sm text-zinc-500">
        잡코리아·알바몬처럼 K-MOM 전용 이력서를 만드세요. 업주에게 깔끔하게 포맷된 형태로 전달됩니다.
      </p>

      <div className="mt-8">
        <ResumeForm userId={user.id} initial={initial} />
      </div>
    </main>
  )
}
