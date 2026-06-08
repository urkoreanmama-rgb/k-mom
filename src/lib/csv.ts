// CSV 생성·다운로드 헬퍼
// Excel(한글)에서 깨지지 않게 UTF-8 BOM 추가

/**
 * 2D 배열을 CSV 문자열로 변환 (BOM 포함)
 * — 쉼표·따옴표·줄바꿈은 자동 escape
 */
export function toCsv(rows: Array<Array<string | number | null | undefined>>): string {
  const BOM = '﻿' // Excel에서 한글 인식용
  const lines = rows.map((row) => row.map(escapeCell).join(','))
  return BOM + lines.join('\r\n')
}

function escapeCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  // 쉼표·따옴표·줄바꿈 포함 시 따옴표로 감싸고 내부 따옴표 이스케이프
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

/**
 * CSV 응답 생성 (다운로드 트리거)
 */
export function csvResponse(filename: string, csv: string): Response {
  // 한글 파일명을 안전하게 인코딩
  const safeFilename = encodeURIComponent(filename)
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename*=UTF-8''${safeFilename}`,
      'Cache-Control': 'no-store',
    },
  })
}

/**
 * 날짜 → YYYYMMDD-HHmm 문자열 (파일명용)
 */
export function timestampSuffix(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
}
