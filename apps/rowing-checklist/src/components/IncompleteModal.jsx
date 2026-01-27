import { useTheme } from './ThemeProvider'

const typeLabels = {
  pre: 'Warm-Up',
  post: 'Cool-Down',
  mvpPre: 'Quick Warm-Up',
  mvpPost: 'Quick Cool-Down',
}

export default function IncompleteModal({
  type,
  checkedCount,
  totalRequired,
  progress,
  onConfirm,
  onCancel,
}) {
  const { dark } = useTheme()
  const label = typeLabels[type] || 'Session'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className={`relative modal-animate rounded-2xl p-8 text-center max-w-sm w-full shadow-xl ${
          dark ? 'bg-warm-gray-800' : 'bg-white'
        }`}
      >
        <div className="mb-6">
          <div className="text-4xl mb-3">⚠️</div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            Save Progress?
          </h2>
          <p
            className={`text-base ${
              dark ? 'text-warm-gray-300' : 'text-warm-gray-600'
            }`}
          >
            You've completed <span className="font-semibold">{checkedCount} of {totalRequired}</span> items ({Math.round(progress)}%)
          </p>
          <p
            className={`text-sm mt-2 ${
              dark ? 'text-warm-gray-400' : 'text-warm-gray-500'
            }`}
          >
            This {label} session will be saved as incomplete.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-amber-accent text-white font-semibold text-sm hover:bg-amber-dark transition-colors cursor-pointer border-0"
          >
            Save Progress
          </button>
          <button
            onClick={onCancel}
            className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 ${
              dark
                ? 'bg-warm-gray-700 text-warm-gray-300 hover:bg-warm-gray-600'
                : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
            }`}
          >
            Keep Going
          </button>
        </div>
      </div>
    </div>
  )
}
