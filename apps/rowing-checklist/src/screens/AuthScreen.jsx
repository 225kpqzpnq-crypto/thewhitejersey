import { useState } from 'react'
import { useTheme } from '../components/ThemeProvider'
import { API_BASE_URL } from '../config'

export default function AuthScreen({ onAuthenticated }) {
  const { dark } = useTheme()
  const [mode, setMode] = useState('welcome') // 'welcome', 'setup', 'login'
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [step, setStep] = useState(1) // For setup: 1 = enter PIN, 2 = confirm PIN
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDigit = (digit) => {
    setError('')
    if (mode === 'setup') {
      if (step === 1 && pin.length < 6) {
        setPin(pin + digit)
      } else if (step === 2 && confirmPin.length < 6) {
        setConfirmPin(confirmPin + digit)
      }
    } else if (mode === 'login' && pin.length < 6) {
      setPin(pin + digit)
    }
  }

  const handleBackspace = () => {
    setError('')
    if (mode === 'setup') {
      if (step === 1) {
        setPin(pin.slice(0, -1))
      } else if (step === 2) {
        setConfirmPin(confirmPin.slice(0, -1))
      }
    } else if (mode === 'login') {
      setPin(pin.slice(0, -1))
    }
  }

  const handleSetupContinue = () => {
    if (step === 1) {
      if (pin.length < 4) {
        setError('PIN must be at least 4 digits')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (confirmPin !== pin) {
        setError('PINs do not match')
        setConfirmPin('')
        return
      }
      handleRegister()
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Store userId in localStorage
      localStorage.setItem('rowing-userId', data.userId)
      onAuthenticated(data.userId)
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (pin.length < 4) {
      setError('Please enter your PIN')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setPin('')
        setLoading(false)
        return
      }

      // Store userId in localStorage
      localStorage.setItem('rowing-userId', data.userId)
      onAuthenticated(data.userId)
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const renderPinDots = (value, maxLength = 6) => {
    return (
      <div className="flex gap-3 justify-center mb-8">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-colors ${
              i < value.length
                ? 'bg-amber-accent'
                : dark
                ? 'bg-warm-gray-700'
                : 'bg-warm-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderKeypad = () => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←']

    return (
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {digits.map((digit, i) => {
          if (digit === '') {
            return <div key={i} />
          }

          const isBackspace = digit === '←'

          return (
            <button
              key={i}
              onClick={() => (isBackspace ? handleBackspace() : handleDigit(digit))}
              disabled={loading}
              className={`aspect-square rounded-xl text-2xl font-semibold transition-all cursor-pointer border-0 ${
                dark
                  ? 'bg-warm-gray-800 text-warm-gray-100 hover:bg-warm-gray-700 active:scale-95'
                  : 'bg-warm-gray-100 text-warm-gray-900 hover:bg-warm-gray-200 active:scale-95'
              } ${loading ? 'opacity-50' : ''}`}
            >
              {digit}
            </button>
          )
        })}
      </div>
    )
  }

  // Welcome screen
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="text-6xl mb-6">🚣</div>
          <h1
            className={`text-3xl font-bold mb-4 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            Rowing Checklist
          </h1>
          <p
            className={`text-base mb-8 ${
              dark ? 'text-warm-gray-400' : 'text-warm-gray-600'
            }`}
          >
            Track your warm-ups, cool-downs, and rowing sessions
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setMode('setup')}
              className="w-full py-4 px-6 rounded-xl bg-amber-accent text-white font-semibold text-base hover:bg-amber-dark transition-colors cursor-pointer border-0"
            >
              Create New Account
            </button>
            <button
              onClick={() => setMode('login')}
              className={`w-full py-4 px-6 rounded-xl text-base font-medium transition-colors cursor-pointer border-0 ${
                dark
                  ? 'bg-warm-gray-800 text-warm-gray-300 hover:bg-warm-gray-700'
                  : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
              }`}
            >
              I Have an Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Setup screen
  if (mode === 'setup') {
    const currentPin = step === 1 ? pin : confirmPin
    const canContinue = step === 1 ? pin.length >= 4 : confirmPin.length >= 4

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h2
            className={`text-2xl font-bold mb-2 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            {step === 1 ? 'Create Your PIN' : 'Confirm Your PIN'}
          </h2>
          <p
            className={`text-sm mb-8 ${
              dark ? 'text-warm-gray-400' : 'text-warm-gray-600'
            }`}
          >
            {step === 1
              ? 'Choose a 4-6 digit PIN to secure your data'
              : 'Enter your PIN again to confirm'}
          </p>

          {renderPinDots(currentPin)}

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {renderKeypad()}

          <div className="mt-6 flex flex-col gap-2">
            {canContinue && (
              <button
                onClick={handleSetupContinue}
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-amber-accent text-white font-semibold text-base hover:bg-amber-dark transition-colors cursor-pointer border-0"
              >
                {loading ? 'Creating...' : step === 1 ? 'Continue' : 'Create Account'}
              </button>
            )}
            <button
              onClick={() => {
                setMode('welcome')
                setPin('')
                setConfirmPin('')
                setStep(1)
                setError('')
              }}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 ${
                dark
                  ? 'bg-transparent text-warm-gray-500 hover:text-warm-gray-300'
                  : 'bg-transparent text-warm-gray-400 hover:text-warm-gray-600'
              }`}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Login screen
  if (mode === 'login') {
    const canLogin = pin.length >= 4

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h2
            className={`text-2xl font-bold mb-2 ${
              dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
            }`}
          >
            Welcome Back
          </h2>
          <p
            className={`text-sm mb-8 ${
              dark ? 'text-warm-gray-400' : 'text-warm-gray-600'
            }`}
          >
            Enter your PIN to continue
          </p>

          {renderPinDots(pin)}

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {renderKeypad()}

          <div className="mt-6 flex flex-col gap-2">
            {canLogin && (
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-amber-accent text-white font-semibold text-base hover:bg-amber-dark transition-colors cursor-pointer border-0"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            )}
            <button
              onClick={() => {
                setMode('welcome')
                setPin('')
                setError('')
              }}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 ${
                dark
                  ? 'bg-transparent text-warm-gray-500 hover:text-warm-gray-300'
                  : 'bg-transparent text-warm-gray-400 hover:text-warm-gray-600'
              }`}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
