import type { ComplianceItem, ComplianceLevel } from '@/lib/compliance'
import { summarizeCompliance } from '@/lib/compliance'

const COLORS: Record<ComplianceLevel, { dot: string; chip: string; chipText: string }> = {
  ok: {
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-100 dark:bg-emerald-900/40',
    chipText: 'text-emerald-700 dark:text-emerald-300',
  },
  warn: {
    dot: 'bg-amber-500',
    chip: 'bg-amber-100 dark:bg-amber-900/40',
    chipText: 'text-amber-800 dark:text-amber-300',
  },
  fail: {
    dot: 'bg-red-500',
    chip: 'bg-red-100 dark:bg-red-900/40',
    chipText: 'text-red-700 dark:text-red-300',
  },
  info: {
    dot: 'bg-zinc-400',
    chip: 'bg-zinc-100 dark:bg-zinc-800',
    chipText: 'text-zinc-600 dark:text-zinc-300',
  },
}

const LABELS: Record<ComplianceLevel, string> = {
  ok: '확인',
  warn: '주의',
  fail: '필수',
  info: '안내',
}

export default function ComplianceChecklist({ items }: { items: ComplianceItem[] }) {
  const summary = summarizeCompliance(items)
  const summaryColor = COLORS[summary.level]

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">합법 채용 가능성 사전 확인</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${summaryColor.chip} ${summaryColor.chipText}`}
        >
          {summary.label}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        ✓ {summary.okCount} 확인 · ⚠ {summary.warnCount} 주의 · ✕ {summary.failCount} 필수
      </p>

      <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
        {items.map((item) => {
          const c = COLORS[item.level]
          return (
            <li key={item.key} className="py-3">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${c.chip} ${c.chipText}`}>
                  {LABELS[item.level]}
                </span>
              </div>
              <p className="ml-5 mt-1 text-sm text-zinc-700 dark:text-zinc-300">{item.value}</p>
              {item.hint && (
                <p className="ml-5 mt-0.5 text-xs text-zinc-500">{item.hint}</p>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-4 rounded-md bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-950">
        ⓘ 이 정보는 합법 채용 가능성 사전 확인용입니다. K-MOM은 채용 알선이 아닌
        정보 제공 서비스이며, 최종 허가는 출입국·외국인관서장의 판단에 따릅니다.
      </p>
    </section>
  )
}
