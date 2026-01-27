import { useNavigate } from 'react-router-dom'
import { useTheme } from '../components/ThemeProvider'
import { useAuth } from '../hooks/useAuth'

export default function SettingsScreen() {
  const { dark } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Make sure your data is synced.')) {
      logout()
      // Will redirect to AuthScreen automatically via App.jsx
    }
  }

  return (
    <div className="mt-4">
      <h1
        className={`text-xl font-bold mb-6 ${
          dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
        }`}
      >
        Settings
      </h1>

      <div className="space-y-4">
        {/* Sync Status */}
        <div
          className={`p-4 rounded-xl border-2 ${
            dark
              ? 'bg-warm-gray-800 border-warm-gray-700'
              : 'bg-white border-warm-gray-200'
          }`}
        >
          <h2
            className={`text-base font-semibold mb-2 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            Cloud Sync
          </h2>
          <p
            className={`text-sm ${
              dark ? 'text-warm-gray-400' : 'text-warm-gray-600'
            }`}
          >
            Your data is automatically synced to the cloud. You can access it from any device using your PIN.
          </p>
        </div>

        {/* Account Section */}
        <div
          className={`p-4 rounded-xl border-2 ${
            dark
              ? 'bg-warm-gray-800 border-warm-gray-700'
              : 'bg-white border-warm-gray-200'
          }`}
        >
          <h2
            className={`text-base font-semibold mb-3 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            Account
          </h2>
          <button
            onClick={handleLogout}
            className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 ${
              dark
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            Logout
          </button>
          <p
            className={`text-xs mt-2 ${
              dark ? 'text-warm-gray-500' : 'text-warm-gray-500'
            }`}
          >
            You'll need your PIN to log back in
          </p>
        </div>

        {/* About */}
        <div
          className={`p-4 rounded-xl border-2 ${
            dark
              ? 'bg-warm-gray-800 border-warm-gray-700'
              : 'bg-white border-warm-gray-200'
          }`}
        >
          <h2
            className={`text-base font-semibold mb-2 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            About
          </h2>
          <p
            className={`text-sm ${
              dark ? 'text-warm-gray-400' : 'text-warm-gray-600'
            }`}
          >
            Rowing Checklist v2.0
          </p>
          <p
            className={`text-xs mt-1 ${
              dark ? 'text-warm-gray-500' : 'text-warm-gray-500'
            }`}
          >
            Track your warm-ups, cool-downs, and rowing sessions
          </p>
        </div>
      </div>
    </div>
  )
}
