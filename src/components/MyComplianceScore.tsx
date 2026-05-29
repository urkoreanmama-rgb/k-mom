// 학생 본인이 보는 합법성 점수 카드 — 부족 항목에 액션 CTA 포함
import Link from 'next/link'
import type { ComplianceItem } from '@/lib/compliance'
import { summarizeCompliance } from '@/lib/compliance'

const ACTION_HINTS: Record<string, { label: string; href: string; hint: string }> = {
  visa: {
    label: '비자 종류 선택',
    href: '#비자-종류',
    hint: '여권 또는 외국인등록증 확인',
  },
  enrollment: {
    label: '학적 상태 선택',
    href: '#학적-상태',
    hint: '재학중·휴학·졸업 중 하나 (5초)',
  },
  topik: {
    label: 'TOPIK 등급 선택',
    href: '#TOPIK-등급',
    hint: '없으면 일단 "없음" 선택 → 학기 중 주 15시간 제한',
  },
  immigration: {
    label: '시간제취업 허가 상태',
    href: '#시간제취업-허가-상태',
    hint: '미신청 시 출입국·외국인관서장 사전 허가 필수 (법 제20조)',
  },
}

export default function MyComplianceScore({ items }: { items: ComplianceItem[] }) {
  const summary = summarizeCompliance(items)
  const total = items.length
  const score = summary.okCount
  const pct = Math.round((score / total) * 100)

  // 액션 가능한 항목만 (warn / fail)
  const todo = items.filter(
    (item) => (item.level === 'warn' || item.level === 'fail') && ACTION_HINTS[item.key],
  )

  return (
    <section className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-sky-50 p-5 dark:border-emerald-800 dark:from-emerald-950/40 dark:to-sky-950/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            내 합법성 점수
          </p>
          <p className="mt-1 text-3xl font-bold">
            {score}
            <span className="text-base font-medium text-zinc-500"> / {total}</span>
          </p>
          <p className="mt-1 text-sm font-medium">
            {pct >= 80
              ? '🎉 업주가 안심하고 보는 프로필이에요'
              : pct >= 50
                ? '🟡 조금만 더 채우면 매력적인 프로필이 돼요'
                : '🔴 채울 항목이 많아요 — 업주 눈에 잘 안 띌 수 있어요'}
          </p>
        </div>
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-zinc-200 dark:text-zinc-800"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${pct}, 100`}
              className={
                pct >= 80
                  ? 'text-emerald-500'
                  : pct >= 50
                    ? 'text-amber-500'
                    : 'text-red-500'
              }
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {pct}%
          </span>
        </div>
      </div>

      {/* 진행 막대 */}
      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="bg-emerald-500"
          style={{ width: `${(summary.okCount / total) * 100}%` }}
        />
        <div
          className="bg-amber-400"
          style={{ width: `${(summary.warnCount / total) * 100}%` }}
        />
        <div
          className="bg-red-500"
          style={{ width: `${(summary.failCount / total) * 100}%` }}
        />
      </div>
      <div className="mt-1 flex gap-3 text-xs text-zinc-600 dark:text-zinc-400">
        <span>✓ {summary.okCount} 확인</span>
        <span>⚠ {summary.warnCount} 주의</span>
        <span>✕ {summary.failCount} 미입력</span>
      </div>

      {/* 할 일 리스트 */}
      {todo.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold">점수 올리기 (TODO)</p>
          <ul className="mt-2 space-y-2">
            {todo.map((item) => {
              const action = ACTION_HINTS[item.key]
              return (
                <li
                  key={item.key}
                  className="flex items-start gap-3 rounded-lg bg-white/70 p-3 text-sm dark:bg-zinc-900/70"
                >
                  <span className={item.level === 'fail' ? 'text-red-500' : 'text-amber-500'}>
                    {item.level === 'fail' ? '✕' : '⚠'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-zinc-500">{action.hint}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-xs text-zinc-500">
            ↓ 아래 폼에서 입력하면 자동으로 점수가 올라갑니다
          </p>
        </div>
      )}

      {todo.length === 0 && (
        <div className="mt-5 rounded-lg bg-emerald-100 p-3 text-sm text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
          ✨ 완벽해요! 업주들이 K-MOM에서 가장 먼저 찾는 프로필이에요.
        </div>
      )}
    </section>
  )
}
