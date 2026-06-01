import type { StudentBadge } from '@/data/demo-students'
import type { EmployerBadge } from '@/data/demo-employers'

type BadgeLabel = StudentBadge | EmployerBadge | string

type BadgeVariant = 'sky' | 'indigo' | 'violet' | 'emerald' | 'amber' | 'green' | 'blue' | 'orange' | 'zinc'

interface TrustBadgeProps {
  label: BadgeLabel
  size?: 'sm' | 'md'
}

function getBadgeConfig(label: string): { variant: BadgeVariant; icon: string } {
  if (label === '학교 소속 확인' || label === '교수 추천') {
    return { variant: 'sky', icon: label === '교수 추천' ? '⭐' : '🏫' }
  }
  if (label === 'D-2 학생') {
    return { variant: 'indigo', icon: '🎓' }
  }
  if (label === '한국어 일상대화 가능') {
    return { variant: 'violet', icon: '💬' }
  }
  if (label === '알바 이력 있음') {
    return { variant: 'emerald', icon: '💼' }
  }
  if (label === '성실도 우수') {
    return { variant: 'amber', icon: '✨' }
  }
  if (label === '재고용 의향 높음' || label === '학생 재근무 의향 높음') {
    return { variant: 'green', icon: '🔄' }
  }
  if (label === 'K-MOM 플랫폼 기준 우수 업체') {
    return { variant: 'emerald', icon: '✅' }
  }
  if (label === '임금 지급 우수' || label === '근무 환경 우수') {
    return { variant: 'green', icon: label === '임금 지급 우수' ? '💰' : '🏢' }
  }
  if (label === '서류 협조 우수') {
    return { variant: 'blue', icon: '📄' }
  }
  if (label === '외국인 학생 채용 경험 있음') {
    return { variant: 'violet', icon: '🌏' }
  }
  if (label === '주의 신호') {
    return { variant: 'orange', icon: '⚠️' }
  }
  return { variant: 'zinc', icon: '🏷️' }
}

const variantClasses: Record<BadgeVariant, string> = {
  sky: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800',
  violet: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
  amber: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
  green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
  blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  orange: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800',
  zinc: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
}

export default function TrustBadge({ label, size = 'md' }: TrustBadgeProps) {
  const { variant, icon } = getBadgeConfig(label)
  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses} ${variantClasses[variant]}`}
    >
      <span className="text-[0.75em]">{icon}</span>
      {label}
    </span>
  )
}
