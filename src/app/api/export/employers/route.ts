// 업주 명단 CSV 다운로드 — 운영자용
import { createClient } from '@/lib/supabase/server'
import { csvResponse, toCsv, timestampSuffix } from '@/lib/csv'

export async function GET() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, phone, created_at')
    .eq('role', 'employer')
    .order('created_at', { ascending: false })

  if (!users || users.length === 0) {
    return csvResponse(`kmom-employers-${timestampSuffix()}.csv`, toCsv([['데이터 없음']]))
  }

  const ids = users.map((u) => u.id)
  const { data: employers } = await supabase
    .from('employers')
    .select('user_id, business_name, category, address, certification_level, is_blocked')
    .in('user_id', ids)
  const empMap = new Map((employers ?? []).map((e) => [e.user_id, e]))

  const rows: Array<Array<string | number | null | undefined>> = [
    [
      '업주 ID',
      '담당자명',
      '이메일',
      '연락처',
      '상호명',
      '업종',
      '주소',
      '인증 등급',
      '차단 여부',
      '가입일',
    ],
  ]

  for (const u of users) {
    const e = empMap.get(u.id)
    rows.push([
      u.id.slice(0, 8),
      u.name,
      u.email,
      u.phone,
      e?.business_name ?? '(미입력)',
      e?.category ?? '',
      e?.address ?? '',
      e?.certification_level ?? '',
      e?.is_blocked ? '차단' : '정상',
      u.created_at?.slice(0, 10) ?? '',
    ])
  }

  return csvResponse(`kmom-employers-${timestampSuffix()}.csv`, toCsv(rows))
}
