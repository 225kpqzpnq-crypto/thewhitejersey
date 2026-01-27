import { Link, useLocation } from 'react-router-dom'
import { useTheme } from './ThemeProvider'
import { useDailyLog } from '../hooks/useDailyLog'
import SyncIndicator from './SyncIndicator'

export default function Layout({ children }) {
  const { dark, toggle } = useTheme()
  const { syncing, syncError } = useDailyLog()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pb-8">
      <header className="flex items-center justify-between py-4">
        <Link
          to="/"
          className={`text-lg font-semibold no-underline ${
            dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
          }`}
        >
          Rowing Checklist
        </Link>
        <div className="flex items-center gap-3">
          {!isHome && (
            <>
              <Link
                to="/history"
                className={`text-sm no-underline ${
                  dark ? 'text-warm-gray-400 hover:text-warm-gray-200' : 'text-warm-gray-500 hover:text-warm-gray-700'
                }`}
              >
                History
              </Link>
              <Link
                to="/settings"
                className={`text-sm no-underline ${
                  dark ? 'text-warm-gray-400 hover:text-warm-gray-200' : 'text-warm-gray-500 hover:text-warm-gray-700'
                }`}
              >
                Settings
              </Link>
            </>
          )}
          <button
            onClick={toggle}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              dark
                ? 'border-warm-gray-700 bg-warm-gray-800 text-warm-gray-300 hover:bg-warm-gray-700'
                : 'border-warm-gray-200 bg-white text-warm-gray-600 hover:bg-warm-gray-50'
            }`}
            aria-label="Toggle theme"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main>{children}</main>
      <SyncIndicator syncing={syncing} syncError={syncError} />
    </div>
  )
}
