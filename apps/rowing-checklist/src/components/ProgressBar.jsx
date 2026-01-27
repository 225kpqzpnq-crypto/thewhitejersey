import { useTheme } from './ThemeProvider'

export default function ProgressBar({ progress, checkedCount, totalRequired }) {
  const { dark } = useTheme()
  const pct = Math.round(progress * 100)

  return (
    <div
      className={`sticky top-0 z-10 py-3 -mx-4 px-4 backdrop-blur-md ${
        dark ? 'bg-warm-gray-900/90' : 'bg-warm-white/90'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs font-medium ${
            dark ? 'text-warm-gray-400' : 'text-warm-gray-500'
          }`}
        >
          {checkedCount} / {totalRequired} required
        </span>
        <span
          className={`text-xs font-semibold ${
            progress >= 1 ? 'text-post-green' : 'text-amber-accent'
          }`}
        >
          {pct}%
        </span>
      </div>
      <div
        className={`h-1.5 rounded-full overflow-hidden ${
          dark ? 'bg-warm-gray-800' : 'bg-warm-gray-200'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            progress >= 1 ? 'bg-post-green' : 'bg-amber-accent'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
