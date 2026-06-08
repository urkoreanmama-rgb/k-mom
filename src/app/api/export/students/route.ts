// 학생 명단 CSV 다운로드 — 운영자용
import { createClient } from '@/lib/supabase/server'
import { csvResponse, toCsv, timestampSuffix } from '@/lib/csv'

export async function GET() {
  const supabase = await createClient()

  // 모든 학생 + 프로필 가져오기
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, nationality, visa_type, phone, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  if (!users || users.length === 0) {
    return csvResponse(`kmom-students-${timestampSuffix()}.csv`, toCsv([['데이터 없음']]))
  }

  // 프로필 일괄 조회
  const ids = users.map((u) => u.id)
  const { data: profiles } = await supabase
    .from('student_profiles')
    .select('user_id, topik_level, verified_badge, total_work_hours, enrollment_status, immigration_permit_status, intro, skills')
    .in('user_id', ids)
  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]))

  const rows: Array<Array<string | number | null | undefined>> = [
    [
      '학생 ID',
      '이름',
      '이메일',
      '국적',
      '비자',
      '연락처',
      'TOPIK',
      '학교인증',
      '학적상태',
      '시간제취업 허가',
      '누적 근무시간',
      '자기소개',
      '스킬',
      '가입일',
    ],
  ]

  for (const u of users) {
    const p = profileMap.get(u.id)
    rows.push([
      u.id.slice(0, 8),
      u.name,
      u.email,
      u.nationality,
      u.visa_type,
      u.phone,
      p?.topik_level ?? 'none',
      p?.verified_badge ? '인증' : '미인증',
      p?.enrollment_status ?? 'unknown',
      p?.immigration_permit_status ?? 'unknown',
      p?.total_work_hours ?? 0,
      (p?.intro ?? '').slice(0, 100),
      ((p?.skills as string[] | null) ?? []).join('; '),
      u.created_at?.slice(0, 10) ?? '',
    ])
  }

  return csvResponse(`kmom-students-${timestampSuffix()}.csv`, toCsv(rows))
}
