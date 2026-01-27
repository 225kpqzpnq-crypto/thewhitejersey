import { useState } from 'react'
import { useTheme } from '../components/ThemeProvider'
import { useDailyLog } from '../hooks/useDailyLog'
import CalendarGrid from '../components/CalendarGrid'
import DayDetail from '../components/DayDetail'

export default function HistoryScreen() {
  const { dark } = useTheme()
  const { log, getDay, deleteSession } = useDailyLog()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState(
    now.toISOString().slice(0, 10),
  )

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const monthLabel = new Date(year, month).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mt-4">
      <h1
        className={`text-xl font-bold mb-6 ${
          dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
        }`}
      >
        History
      </h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer border-0 ${
            dark
              ? 'text-warm-gray-400 hover:bg-warm-gray-800 bg-transparent'
              : 'text-warm-gray-500 hover:bg-warm-gray-100 bg-transparent'
          }`}
        >
          ‹
        </button>
        <span
          className={`text-sm font-semibold ${
            dark ? 'text-warm-gray-200' : 'text-warm-gray-800'
          }`}
        >
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer border-0 ${
            dark
              ? 'text-warm-gray-400 hover:bg-warm-gray-800 bg-transparent'
              : 'text-warm-gray-500 hover:bg-warm-gray-100 bg-transparent'
          }`}
        >
          ›
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-pre-blue" />
          <span className={`text-xs ${dark ? 'text-warm-gray-500' : 'text-warm-gray-400'}`}>
            Pre-Rowing
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-post-green" />
          <span className={`text-xs ${dark ? 'text-warm-gray-500' : 'text-warm-gray-400'}`}>
            Post-Rowing
          </span>
        </div>
      </div>

      <CalendarGrid
        year={year}
        month={month}
        log={log}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <DayDetail dateStr={selectedDay} dayData={getDay(selectedDay)} onDelete={deleteSession} />
    </div>
  )
}
