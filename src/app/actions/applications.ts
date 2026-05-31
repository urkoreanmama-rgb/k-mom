'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface ApplicationResult {
  ok?: boolean
  error?: string
}

/**
 * 학생이 업주에게 이력서 + 짧은 메시지 전송
 * - 같은 업주에게 중복 전송 불가 (DB unique 제약)
 * - 학생 이력서가 비어 있으면 거부
 */
export async function sendApplication(
  _prev: ApplicationResult | undefined,
  formData: FormData,
): Promise<ApplicationResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const employerId = String(formData.get('employer_id') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  if (!employerId) return { error: '업주 정보가 없어요.' }

  // 이력서 작성 여부 확인
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('resume_text')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!profile?.resume_text || profile.resume_text.trim().length < 30) {
    return {
      error: '먼저 내 프로필에서 이력서를 작성해주세요 (최소 30자).',
    }
  }

  // 중복 전송 체크는 unique 제약이 잡아주지만, 명확한 에러 메시지 제공
  const { data: existing } = await supabase
    .from('student_applications')
    .select('id, status, created_at')
    .eq('student_id', user.id)
    .eq('employer_id', employerId)
    .maybeSingle()
  if (existing) {
    return {
      error: '이 가게에 이미 이력서를 보냈어요.',
    }
  }

  const { error } = await supabase.from('student_applications').insert({
    student_id: user.id,
    employer_id: employerId,
    message: message || null,
    status: 'sent',
  })

  if (error) return { error: error.message }

  revalidatePath('/student/employers')
  revalidatePath('/employer/applications')
  return { ok: true }
}

/**
 * 업주가 받은 이력서를 '읽음' 처리
 */
export async function markApplicationRead(applicationId: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('student_applications')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('id', applicationId)
    .eq('status', 'sent') // 이미 읽은 건 다시 안 바꿈
  revalidatePath('/employer/applications')
}
