'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface ActionResult {
  error?: string
  ok?: boolean
}

/**
 * 업주가 학생을 고용 등록 (work_histories INSERT, status=active)
 */
export async function createWorkHistory(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const studentId = String(formData.get('student_id') ?? '')
  const startDate = String(formData.get('start_date') ?? '')
  const hoursPerWeek = Number(formData.get('hours_per_week') ?? 0)
  const hourlyWage = Number(formData.get('hourly_wage') ?? 0)

  if (!studentId || !startDate) {
    return { error: '학생과 시작일을 입력해주세요.' }
  }

  const { error } = await supabase.from('work_histories').insert({
    student_id: studentId,
    employer_id: user.id,
    start_date: startDate,
    hours_per_week: hoursPerWeek || null,
    hourly_wage: hourlyWage || null,
    status: 'active',
  })

  if (error) return { error: error.message }

  revalidatePath('/employer/work')
  revalidatePath(`/employer/students/${studentId}`)
  return { ok: true }
}

/**
 * 근무 종료: end_date=today, status=completed
 * 학생 total_work_hours에 누적 시간 더하기
 */
export async function completeWorkHistory(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workId = String(formData.get('work_id') ?? '')
  if (!workId) return

  const { data: work } = await supabase
    .from('work_histories')
    .select('*')
    .eq('id', workId)
    .single()
  if (!work) return

  const endDate = new Date()
  const startDate = new Date(work.start_date)
  const weeks = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)),
  )
  const totalHours = (work.hours_per_week ?? 0) * weeks

  await supabase
    .from('work_histories')
    .update({ end_date: endDate.toISOString().slice(0, 10), status: 'completed' })
    .eq('id', workId)

  if (totalHours > 0) {
    // RPC가 없어서 select 후 update (atomic은 아니지만 MVP)
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('total_work_hours')
      .eq('user_id', work.student_id)
      .maybeSingle()
    await supabase
      .from('student_profiles')
      .update({ total_work_hours: (profile?.total_work_hours ?? 0) + totalHours })
      .eq('user_id', work.student_id)
  }

  revalidatePath('/employer/work')
  revalidatePath('/student/history')
}

/**
 * 평가 제출 (양쪽 모두 제출 시 트리거가 revealed_at 자동 set)
 */
export interface ReviewItems {
  punctuality?: number
  attitude?: number
  communication?: number
  legality?: number
  wage_payment?: number
  environment?: number
}

export async function submitReview(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const workId = String(formData.get('work_id') ?? '')
  const score = Number(formData.get('score') ?? 0)
  const comment = String(formData.get('comment') ?? '')

  if (!workId || score < 1 || score > 5) {
    return { error: '별점(1~5)을 선택해주세요.' }
  }

  // 누가 누구를 평가하는지 결정
  const { data: work } = await supabase
    .from('work_histories')
    .select('student_id, employer_id, status')
    .eq('id', workId)
    .single()
  if (!work) return { error: '알바 이력을 찾을 수 없어요.' }
  if (work.status !== 'completed') return { error: '근무 종료 후에 평가할 수 있어요.' }

  const isEmployer = user.id === work.employer_id
  const reviewerId = user.id
  const revieweeId = isEmployer ? work.student_id : work.employer_id

  const itemsJson: ReviewItems = isEmployer
    ? {
        punctuality: Number(formData.get('punctuality') ?? 0) || undefined,
        attitude: Number(formData.get('attitude') ?? 0) || undefined,
        communication: Number(formData.get('communication') ?? 0) || undefined,
      }
    : {
        legality: Number(formData.get('legality') ?? 0) || undefined,
        wage_payment: Number(formData.get('wage_payment') ?? 0) || undefined,
        environment: Number(formData.get('environment') ?? 0) || undefined,
      }

  const { error } = await supabase.from('reviews').insert({
    work_history_id: workId,
    reviewer_id: reviewerId,
    reviewee_id: revieweeId,
    score,
    items_json: itemsJson as Record<string, unknown>,
    comment: comment || null,
  })

  if (error) {
    // 중복 unique 제약 위반 등
    return { error: error.message }
  }

  revalidatePath('/employer/work')
  revalidatePath('/student/history')
  return { ok: true }
}
