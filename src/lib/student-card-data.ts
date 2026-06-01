// 학생 프로필 페이지의 '미리보기 카드'에 쓸 DemoStudent 형식의 데이터 생성
// — 데모 계정 (kmom.student1~5@gmail.com) 은 DEMO_STUDENTS 매핑
// — 그 외 실 사용자는 DB(student_profiles + reviews + work_histories + employers)로 계산

import type { SupabaseClient } from '@supabase/supabase-js'
import { DEMO_STUDENTS, type DemoStudent, type StudentBadge } from '@/data/demo-students'
import type { Database } from './supabase/types'

const DEMO_EMAIL_TO_ID: Record<string, string> = {
  'kmom.student1@gmail.com': 's-001',
  'kmom.student2@gmail.com': 's-004',
  'kmom.student3@gmail.com': 's-009',
  'kmom.student4@gmail.com': 's-008',
  // student5는 빈 프로필 (TODO 시연용) — 매핑 없음
}

/**
 * 로그인된 학생에게 보여줄 '내 프로필 카드' 데이터를 만든다.
 * 데모 계정이면 풍부한 더미를, 실 사용자면 DB 계산값을 반환.
 */
export async function buildStudentCardData(
  supabase: SupabaseClient<Database>,
  userId: string,
  email: string,
): Promise<DemoStudent | null> {
  // 1) 데모 계정이면 DEMO_STUDENTS 매핑
  const demoId = DEMO_EMAIL_TO_ID[email]
  if (demoId) {
    const demo = DEMO_STUDENTS.find((s) => s.studentId === demoId)
    if (demo) return demo
  }

  // 2) 실 사용자 — DB로 계산
  const [{ data: user }, { data: profile }, { data: reviews }, { data: works }] = await Promise.all([
    supabase.from('users').select('id, name, nationality, visa_type').eq('id', userId).maybeSingle(),
    supabase.from('student_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('reviews').select('score, items_json, revealed_at').eq('reviewee_id', userId),
    supabase
      .from('work_histories')
      .select('id, employer_id, start_date, end_date, hours_per_week, status')
      .eq('student_id', userId)
      .order('start_date', { ascending: false }),
  ])

  if (!user) return null

  // 평균 평점
  const revealedReviews = (reviews ?? []).filter((r) => r.revealed_at)
  const avgRating =
    revealedReviews.length > 0
      ? revealedReviews.reduce((sum, r) => sum + r.score, 0) / revealedReviews.length
      : 0

  // 시간·태도 점수 (items_json에서 추출)
  let reliabilitySum = 0
  let reliabilityCount = 0
  let punctualitySum = 0
  let punctualityCount = 0
  for (const r of revealedReviews) {
    const items = r.items_json as Record<string, number> | null
    if (items?.attitude) {
      reliabilitySum += items.attitude
      reliabilityCount++
    }
    if (items?.punctuality) {
      punctualitySum += items.punctuality
      punctualityCount++
    }
  }
  const reliabilityScore = reliabilityCount > 0 ? reliabilitySum / reliabilityCount : 0
  const punctualityScore = punctualityCount > 0 ? punctualitySum / punctualityCount : 0

  // 알바 이력 (가게 이름 매핑)
  const employerIds = [...new Set((works ?? []).map((w) => w.employer_id))]
  let employerNameMap = new Map<string, string>()
  if (employerIds.length > 0) {
    const { data: emps } = await supabase
      .from('employers')
      .select('user_id, business_name, category')
      .in('user_id', employerIds)
    employerNameMap = new Map((emps ?? []).map((e) => [e.user_id, e.business_name]))
  }

  const workHistoryItems = (works ?? []).slice(0, 3).map((w) => ({
    workId: w.id,
    companyName: employerNameMap.get(w.employer_id) ?? '(이름 미상)',
    businessType: '',
    startDate: w.start_date?.slice(0, 7) ?? '',
    endDate: w.end_date?.slice(0, 7) ?? (w.status === 'active' ? '현재' : ''),
    workDays: [] as DemoStudent['availableDays'],
    timeSlot: '오후' as DemoStudent['availableTimeSlots'][number],
    jobType: '홀서빙' as DemoStudent['preferredJobTypes'][number],
    employerRated: true,
    studentRated: true,
    rehireIntent: false,
    status: (w.status === 'active' ? 'active' : 'completed') as 'active' | 'completed',
  }))

  const badges: StudentBadge[] = []
  if (profile?.verified_badge) badges.push('학교 소속 확인')
  if (user.visa_type?.startsWith('D-2')) badges.push('D-2 학생')
  if (profile?.topik_level && profile.topik_level !== 'none') badges.push('한국어 일상대화 가능')
  if ((works?.length ?? 0) > 0) badges.push('알바 이력 있음')
  if (avgRating >= 4.5 && revealedReviews.length >= 3) badges.push('성실도 우수')

  return {
    studentId: userId.slice(0, 8),
    name: user.name,
    nickname: user.name,
    nationality: user.nationality ?? '미입력',
    visaType: (user.visa_type as DemoStudent['visaType']) ?? 'D-2-2',
    schoolVerified: profile?.verified_badge ?? false,
    languages: ['기타'],
    koreanLevel: '일상 대화 가능',
    topikLevel: topikToNumber(profile?.topik_level),
    availableDays: [],
    availableTimeSlots: [],
    availableAreas: [],
    preferredJobTypes: [],
    workExperience: workHistoryItems.map((w) => w.companyName),
    partTimePermissionExperience: profile?.immigration_permit_status === 'approved',
    introduction: profile?.intro ?? '자기소개를 작성해주세요.',
    isPublic: true,
    contactStatus: 'available',
    professorRecommended: false,
    reliabilityScore,
    punctualityScore,
    noShowRisk: 'low',
    averageEmployerRating: avgRating,
    rehireRate: 0,
    strengths: (profile?.skills as string[] | null) ?? [],
    badges,
    workHistory: workHistoryItems,
    totalWorkHours: profile?.total_work_hours ?? 0,
    schoolName: '',
  }
}

function topikToNumber(level: string | null | undefined): DemoStudent['topikLevel'] {
  if (!level || level === 'none') return 0
  const m = level.match(/level_(\d)/)
  if (!m) return 0
  return Number(m[1]) as DemoStudent['topikLevel']
}
