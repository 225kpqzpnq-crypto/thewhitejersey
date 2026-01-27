import { useTheme } from './ThemeProvider'

export default function ChecklistItem({ item, checked, onToggle }) {
  const { dark } = useTheme()

  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer border-0 ${
        checked
          ? dark
            ? 'bg-warm-gray-800/50'
            : 'bg-warm-gray-50'
          : dark
            ? 'bg-transparent hover:bg-warm-gray-800/30'
            : 'bg-transparent hover:bg-warm-gray-50/50'
      }`}
    >
      {/* Custom checkbox */}
      <div
        className={`w-6 h-6 min-w-6 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? 'bg-amber-accent border-amber-accent'
            : dark
              ? 'border-warm-gray-600'
              : 'border-warm-gray-300'
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white check-animate"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium leading-snug ${
            checked
              ? dark
                ? 'text-warm-gray-500 line-through'
                : 'text-warm-gray-400 line-through'
              : dark
                ? 'text-warm-gray-100'
                : 'text-warm-gray-900'
          }`}
        >
          {item.label}
        </span>
        {item.detail && (
          <p
            className={`text-xs mt-0.5 leading-snug ${
              dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
            }`}
          >
            {item.detail}
          </p>
        )}
      </div>
    </button>
  )
}
