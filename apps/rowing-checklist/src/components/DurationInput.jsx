import { useTheme } from './ThemeProvider'

/**
 * Custom input component for duration with separate minutes and seconds inputs
 * Accepts and returns duration in seconds
 */
export default function DurationInput({ value, onChange, error }) {
  const { dark } = useTheme()

  // Convert seconds to minutes and seconds
  const minutes = Math.floor((value || 0) / 60)
  const seconds = (value || 0) % 60

  const handleMinutesChange = (e) => {
    const mins = parseInt(e.target.value, 10) || 0
    const clampedMins = Math.max(0, Math.min(999, mins))
    onChange(clampedMins * 60 + seconds)
  }

  const handleSecondsChange = (e) => {
    const secs = parseInt(e.target.value, 10) || 0
    const clampedSecs = Math.max(0, Math.min(59, secs))
    onChange(minutes * 60 + clampedSecs)
  }

  const inputClass = `px-3 py-3 rounded-xl text-base text-center transition-colors border-2 ${
    error
      ? 'border-red-500 focus:border-red-600'
      : dark
      ? 'bg-warm-gray-700 text-warm-gray-100 border-warm-gray-600 focus:border-amber-accent'
      : 'bg-white text-warm-gray-900 border-warm-gray-200 focus:border-amber-accent'
  } focus:outline-none`

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="999"
            value={minutes || ''}
            onChange={handleMinutesChange}
            placeholder="0"
            className={inputClass}
          />
          <p
            className={`text-xs text-center mt-1 ${
              dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
            }`}
          >
            minutes
          </p>
        </div>
        <span
          className={`text-2xl font-bold ${
            dark ? 'text-warm-gray-400' : 'text-warm-gray-500'
          }`}
        >
          :
        </span>
        <div className="flex-1">
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="59"
            value={seconds || ''}
            onChange={handleSecondsChange}
            placeholder="0"
            className={inputClass}
          />
          <p
            className={`text-xs text-center mt-1 ${
              dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
            }`}
          >
            seconds
          </p>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
