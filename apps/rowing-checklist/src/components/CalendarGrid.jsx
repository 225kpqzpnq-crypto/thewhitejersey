import { useMemo } from 'react'
import { useTheme } from './ThemeProvider'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function CalendarGrid({ year, month, log, selectedDay, onSelectDay }) {
  const { dark } = useTheme()

  const { days, firstDayOffset } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // JS getDay: 0=Sun, we want 0=Mon
    const firstDay = new Date(year, month, 1).getDay()
    const offset = firstDay === 0 ? 6 : firstDay - 1
    const days = []
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${pad(month + 1)}-${pad(d)}`
      const dayData = log[key]
      const sessions = dayData?.sessions || []
      const types = sessions.map((s) => s.type)
      days.push({
        day: d,
        key,
        hasPre: types.some((t) => t === 'pre' || t === 'mvpPre'),
        hasPost: types.some((t) => t === 'post' || t === 'mvpPost'),
        hasRowing: sessions.some((s) => (s.sessionType || 'checklist') === 'rowing'),
      })
    }
    return { days, firstDayOffset: offset }
  }, [year, month, log])

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${
              dark ? 'text-warm-gray-600' : 'text-warm-gray-300'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(({ day, key, hasPre, hasPost, hasRowing }) => {
          const isToday = key === today
          const isSelected = key === selectedDay

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer border-0 transition-colors ${
                isSelected
                  ? 'bg-amber-accent text-white font-semibold'
                  : isToday
                    ? dark
                      ? 'bg-warm-gray-800 text-warm-gray-100 font-semibold'
                      : 'bg-warm-gray-100 text-warm-gray-900 font-semibold'
                    : dark
                      ? 'bg-transparent text-warm-gray-400 hover:bg-warm-gray-800'
                      : 'bg-transparent text-warm-gray-600 hover:bg-warm-gray-50'
              }`}
            >
              <span>{day}</span>
              {(hasPre || hasPost || hasRowing) && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasPre && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-pre-blue'}`} />
                  )}
                  {hasPost && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-post-green'}`} />
                  )}
                  {hasRowing && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-amber-accent'}`} />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
