import { useTheme } from './ThemeProvider'

const TYPE_LABELS = {
  pre: 'Full Pre-Rowing',
  post: 'Full Post-Rowing',
  mvpPre: 'Quick Pre-Rowing',
  mvpPost: 'Quick Post-Rowing',
}

export default function DayDetail({ dateStr, dayData, onDelete }) {
  const { dark } = useTheme()

  if (!dayData || dayData.sessions.length === 0) {
    return (
      <div
        className={`mt-4 p-4 rounded-xl text-center text-sm ${
          dark ? 'bg-warm-gray-800 text-warm-gray-500' : 'bg-warm-gray-50 text-warm-gray-400'
        }`}
      >
        No sessions recorded
      </div>
    )
  }

  const displayDate = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="mt-4">
      <h3
        className={`text-sm font-semibold mb-3 ${
          dark ? 'text-warm-gray-300' : 'text-warm-gray-700'
        }`}
      >
        {displayDate}
      </h3>
      <div className="flex flex-col gap-2">
        {dayData.sessions.map((session, i) => {
          const isPre = session.type === 'pre' || session.type === 'mvpPre'
          const time = new Date(session.completedAt).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div
              key={i}
              className={`p-3 rounded-xl border ${
                dark ? 'border-warm-gray-700 bg-warm-gray-800' : 'border-warm-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isPre ? 'bg-pre-blue' : 'bg-post-green'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      dark ? 'text-warm-gray-200' : 'text-warm-gray-800'
                    }`}
                  >
                    {TYPE_LABELS[session.type] || session.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
                    }`}
                  >
                    {time}
                  </span>
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this session?')) {
                          onDelete(dateStr, i)
                        }
                      }}
                      className={`w-6 h-6 flex items-center justify-center rounded-md border-0 cursor-pointer transition-colors ${
                        dark
                          ? 'text-warm-gray-600 hover:text-red-400 hover:bg-warm-gray-700 bg-transparent'
                          : 'text-warm-gray-300 hover:text-red-500 hover:bg-warm-gray-100 bg-transparent'
                      }`}
                      aria-label="Delete session"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div
                className={`text-xs mt-1 ${
                  dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
                }`}
              >
                {session.checkedItems.length} / {session.totalItems} items completed
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
