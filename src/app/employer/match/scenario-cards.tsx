import { DEMO_SCENARIOS } from '@/data/demo-scenarios'
import { submitDemoScenario } from './actions'

const TONE: Record<'green' | 'amber' | 'red', { wrap: string; chip: string; btn: string }> = {
  green: {
    wrap: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30',
    chip: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200',
    btn: 'bg-emerald-600 hover:bg-emerald-700',
  },
  amber: {
    wrap: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
    chip: 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200',
    btn: 'bg-amber-600 hover:bg-amber-700',
  },
  red: {
    wrap: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30',
    chip: 'bg-red-200 text-red-900 dark:bg-red-900/60 dark:text-red-200',
    btn: 'bg-red-600 hover:bg-red-700',
  },
}

export default function ScenarioCards() {
  return (
    <section className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <span className="btn-3d rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
          📺 시연 모드
        </span>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          아래 3가지 시나리오 중 하나를 클릭하면 조건이 자동으로 입력되고 후보 수 화면으로 이동합니다.
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {DEMO_SCENARIOS.map((s) => {
          const t = TONE[s.tone]
          return (
            <form
              key={s.id}
              action={submitDemoScenario}
              className={`flex flex-col rounded-xl border-2 p-4 ${t.wrap}`}
            >
              <input type="hidden" name="scenario_id" value={s.id} />
              <p className="text-3xl">{s.emoji}</p>
              <h3 className="mt-1 text-sm font-bold">{s.title}</h3>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {s.subtitle}
              </p>
              <span
                className={`mt-3 inline-block self-start rounded-full px-2 py-0.5 text-[11px] font-medium ${t.chip}`}
              >
                {s.expectedCount}
              </span>
              <button
                type="submit"
                className={`mt-3 h-9 rounded-lg px-3 text-xs font-semibold text-white ${t.btn}`}
              >
                이 조건으로 보기 →
              </button>
            </form>
          )
        })}
      </div>
    </section>
  )
}
