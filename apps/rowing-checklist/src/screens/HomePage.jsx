import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../components/ThemeProvider'
import { useDailyLog } from '../hooks/useDailyLog'
import RowingSessionModal from '../components/RowingSessionModal'

function ProtocolPicker({ type, onSelect, onCancel }) {
  const { dark } = useTheme()
  const isPre = type === 'pre'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div
        className={`relative modal-animate rounded-2xl p-6 w-full max-w-sm shadow-xl ${
          dark ? 'bg-warm-gray-800' : 'bg-white'
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
          }`}
        >
          Choose Protocol
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect(isPre ? 'pre' : 'post')}
            className={`p-4 rounded-xl text-left border-2 transition-colors cursor-pointer ${
              dark
                ? 'border-warm-gray-700 bg-warm-gray-800 hover:border-amber-accent'
                : 'border-warm-gray-200 bg-white hover:border-amber-accent'
            }`}
          >
            <div className={`font-semibold text-sm ${dark ? 'text-warm-gray-100' : 'text-warm-gray-900'}`}>
              Full Protocol
            </div>
            <div className={`text-xs mt-0.5 ${dark ? 'text-warm-gray-500' : 'text-warm-gray-400'}`}>
              {isPre ? '10–15 minutes — complete warm-up' : '15–30 minutes — full recovery'}
            </div>
          </button>
          <button
            onClick={() => onSelect(isPre ? 'mvpPre' : 'mvpPost')}
            className={`p-4 rounded-xl text-left border-2 transition-colors cursor-pointer ${
              dark
                ? 'border-warm-gray-700 bg-warm-gray-800 hover:border-amber-accent'
                : 'border-warm-gray-200 bg-white hover:border-amber-accent'
            }`}
          >
            <div className={`font-semibold text-sm ${dark ? 'text-warm-gray-100' : 'text-warm-gray-900'}`}>
              Quick (MVP)
            </div>
            <div className={`text-xs mt-0.5 ${dark ? 'text-warm-gray-500' : 'text-warm-gray-400'}`}>
              5 minutes — minimum viable {isPre ? 'warm-up' : 'recovery'}
            </div>
          </button>
        </div>
        <button
          onClick={onCancel}
          className={`mt-3 w-full py-2 text-sm rounded-xl cursor-pointer border-0 ${
            dark
              ? 'text-warm-gray-500 hover:text-warm-gray-300 bg-transparent'
              : 'text-warm-gray-400 hover:text-warm-gray-600 bg-transparent'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { dark } = useTheme()
  const { getTodayStatus, saveRowingSession } = useDailyLog()
  const status = getTodayStatus()
  const [picking, setPicking] = useState(null)
  const [showRowingModal, setShowRowingModal] = useState(false)
  const navigate = useNavigate()

  function handleSelect(type) {
    setPicking(null)
    navigate(`/checklist/${type}`)
  }

  function handleSaveRowing(workoutName, duration, distance, comment) {
    saveRowingSession(workoutName, duration, distance, comment)
    setShowRowingModal(false)
  }

  return (
    <div className="mt-8">
      <div className="text-center mb-8">
        <h1
          className={`text-2xl font-bold mb-1 ${
            dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
          }`}
        >
          Today's Session
        </h1>
        <p className={`text-sm ${dark ? 'text-warm-gray-500' : 'text-warm-gray-400'}`}>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Pre-Rowing Card */}
        <button
          onClick={() => setPicking('pre')}
          className={`relative p-6 rounded-2xl text-left border-2 transition-all cursor-pointer ${
            dark
              ? 'border-warm-gray-700 bg-warm-gray-800 hover:border-pre-blue/50'
              : 'border-warm-gray-200 bg-white hover:border-pre-blue/50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl mb-2">🏋️</div>
              <h2
                className={`text-lg font-semibold mb-1 ${
                  dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
                }`}
              >
                Pre-Rowing
              </h2>
              <p
                className={`text-sm ${
                  dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
                }`}
              >
                Warm-up & mobility
              </p>
            </div>
            {status.pre && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pre-blue-light text-pre-blue">
                Done today
              </span>
            )}
          </div>
        </button>

        {/* Post-Rowing Card */}
        <button
          onClick={() => setPicking('post')}
          className={`relative p-6 rounded-2xl text-left border-2 transition-all cursor-pointer ${
            dark
              ? 'border-warm-gray-700 bg-warm-gray-800 hover:border-post-green/50'
              : 'border-warm-gray-200 bg-white hover:border-post-green/50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl mb-2">🧘</div>
              <h2
                className={`text-lg font-semibold mb-1 ${
                  dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
                }`}
              >
                Post-Rowing
              </h2>
              <p
                className={`text-sm ${
                  dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
                }`}
              >
                Cool-down & recovery
              </p>
            </div>
            {status.post && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-post-green-light text-post-green">
                Done today
              </span>
            )}
          </div>
        </button>

        {/* Rowing Session Card */}
        <button
          onClick={() => setShowRowingModal(true)}
          className={`relative p-6 rounded-2xl text-left border-2 transition-all cursor-pointer ${
            dark
              ? 'border-warm-gray-700 bg-warm-gray-800 hover:border-amber-accent/50'
              : 'border-warm-gray-200 bg-white hover:border-amber-accent/50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl mb-2">🚣</div>
              <h2
                className={`text-lg font-semibold mb-1 ${
                  dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
                }`}
              >
                Log Rowing Session
              </h2>
              <p
                className={`text-sm ${
                  dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
                }`}
              >
                Track your workout
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* History link */}
      <div className="mt-8 text-center">
        <Link
          to="/history"
          className={`text-sm no-underline ${
            dark ? 'text-warm-gray-500 hover:text-warm-gray-300' : 'text-warm-gray-400 hover:text-warm-gray-600'
          }`}
        >
          View History →
        </Link>
      </div>

      {picking && (
        <ProtocolPicker
          type={picking}
          onSelect={handleSelect}
          onCancel={() => setPicking(null)}
        />
      )}

      {showRowingModal && (
        <RowingSessionModal
          onSave={handleSaveRowing}
          onClose={() => setShowRowingModal(false)}
        />
      )}
    </div>
  )
}
