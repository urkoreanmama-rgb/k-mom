interface TrustScoreBarProps {
  label: string
  score: number
  maxScore?: number
  color?: 'sky' | 'emerald' | 'violet' | 'amber'
  showNumber?: boolean
}

const colorClasses: Record<NonNullable<TrustScoreBarProps['color']>, string> = {
  sky: 'bg-sky-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
}

export default function TrustScoreBar({
  label,
  score,
  maxScore = 5,
  color = 'sky',
  showNumber = true,
}: TrustScoreBarProps) {
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100))

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs text-zinc-500 dark:text-zinc-400 truncate">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorClasses[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showNumber && (
        <span className="w-8 shrink-0 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  )
}
