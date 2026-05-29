// 알바 이력 조회 + 평가 상태 계산 헬퍼
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, WorkHistory } from './supabase/types'

export interface WorkWithMeta {
  work: WorkHistory
  counterpartId: string
  counterpartName: string
  counterpartLabel: string
  myReviewSubmitted: boolean
  bothRevealed: boolean
}

export async function fetchMyWorks(
  supabase: SupabaseClient<Database>,
  userId: string,
  viewer: 'student' | 'employer',
): Promise<WorkWithMeta[]> {
  const column = viewer === 'student' ? 'student_id' : 'employer_id'
  const counterpartColumn = viewer === 'student' ? 'employer_id' : 'student_id'

  const { data: works, error } = await supabase
    .from('work_histories')
    .select('*')
    .eq(column, userId)
    .order('created_at', { ascending: false })
  if (error || !works) return []

  // 한 번에 상대방 이름들 가져오기
  const partnerIds = [...new Set(works.map((w) => w[counterpartColumn]))]
  const { data: partners } = await supabase
    .from('users')
    .select('id, name')
    .in('id', partnerIds)
  const nameMap = new Map((partners ?? []).map((p) => [p.id, p.name]))

  // 모든 리뷰 가져오기
  const workIds = works.map((w) => w.id)
  const { data: reviews } = await supabase
    .from('reviews')
    .select('work_history_id, reviewer_id, revealed_at')
    .in('work_history_id', workIds)
  const reviewMap = new Map<string, { mine: boolean; revealed: boolean; count: number }>()
  for (const r of reviews ?? []) {
    const prev = reviewMap.get(r.work_history_id) ?? {
      mine: false,
      revealed: false,
      count: 0,
    }
    reviewMap.set(r.work_history_id, {
      mine: prev.mine || r.reviewer_id === userId,
      revealed: prev.revealed || r.revealed_at !== null,
      count: prev.count + 1,
    })
  }

  return works.map((work) => {
    const partnerId = work[counterpartColumn]
    const meta = reviewMap.get(work.id)
    return {
      work,
      counterpartId: partnerId,
      counterpartName: nameMap.get(partnerId) ?? '(이름 없음)',
      counterpartLabel: viewer === 'student' ? '업주' : '학생',
      myReviewSubmitted: meta?.mine ?? false,
      bothRevealed: meta?.revealed ?? false,
    }
  })
}
