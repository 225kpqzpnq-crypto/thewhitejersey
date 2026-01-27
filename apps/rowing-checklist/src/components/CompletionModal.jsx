import { useTheme } from './ThemeProvider'

const messages = {
  pre: { heading: 'Warm-Up Complete', sub: 'Ready to Row!' },
  post: { heading: 'Recovery Complete', sub: 'Well Done!' },
  mvpPre: { heading: 'Quick Warm-Up Done', sub: 'Ready to Row!' },
  mvpPost: { heading: 'Quick Recovery Done', sub: 'Well Done!' },
}

export default function CompletionModal({ type, onClose, onGoHome }) {
  const { dark } = useTheme()
  const msg = messages[type] || messages.pre

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative modal-animate rounded-2xl p-8 text-center max-w-sm w-full shadow-xl ${
          dark ? 'bg-warm-gray-800' : 'bg-white'
        }`}
      >
        {/* Confetti dots */}
        <div className="absolute inset-x-0 top-4 flex justify-center gap-3 pointer-events-none">
          {['🎉', '💪', '🚣', '✨', '🔥'].map((emoji, i) => (
            <span
              key={i}
              className="confetti text-2xl"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="mt-12 mb-6">
          <h2
            className={`text-2xl font-bold mb-1 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            {msg.heading}
          </h2>
          <p className="text-lg text-amber-accent font-semibold">
            {msg.sub}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onGoHome}
            className="w-full py-3 px-4 rounded-xl bg-amber-accent text-white font-semibold text-sm hover:bg-amber-dark transition-colors cursor-pointer border-0"
          >
            Back to Home
          </button>
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 ${
              dark
                ? 'bg-warm-gray-700 text-warm-gray-300 hover:bg-warm-gray-600'
                : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
            }`}
          >
            Review Checklist
          </button>
        </div>
      </div>
    </div>
  )
}
