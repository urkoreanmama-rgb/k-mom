interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md'
  showNumber?: boolean
}

export default function RatingStars({ rating, size = 'md', showNumber = true }: RatingStarsProps) {
  const sizeClass = size === 'sm' ? 'text-sm' : 'text-base'

  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1
    if (rating >= starValue) return '★'
    if (rating >= starValue - 0.5) return '½'
    return '☆'
  })

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClass}`}>
      <span className="text-amber-400 tracking-tight">
        {stars.map((star, i) =>
          star === '½' ? (
            <span key={i} className="relative inline-block">
              <span className="text-zinc-300 dark:text-zinc-600">☆</span>
              <span className="absolute inset-0 overflow-hidden w-[50%]">★</span>
            </span>
          ) : (
            <span key={i} className={star === '☆' ? 'text-zinc-300 dark:text-zinc-600' : ''}>
              {star}
            </span>
          )
        )}
      </span>
      {showNumber && (
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  )
}
