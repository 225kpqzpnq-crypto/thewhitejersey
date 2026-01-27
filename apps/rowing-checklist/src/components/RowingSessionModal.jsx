import { useState } from 'react'
import { useTheme } from './ThemeProvider'
import DurationInput from './DurationInput'

export default function RowingSessionModal({ onSave, onClose }) {
  const { dark } = useTheme()
  const [workoutName, setWorkoutName] = useState('')
  const [duration, setDuration] = useState(0)
  const [distance, setDistance] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    if (!workoutName.trim()) {
      newErrors.workoutName = 'Workout name is required'
    }

    if (!duration || duration <= 0) {
      newErrors.duration = 'Duration is required'
    }

    if (!distance || parseInt(distance, 10) <= 0) {
      newErrors.distance = 'Distance is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      onSave(
        workoutName.trim(),
        duration,
        parseInt(distance, 10),
        comment.trim()
      )
    }
  }

  const handleDistanceChange = (e) => {
    const value = e.target.value
    // Only allow positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setDistance(value)
      if (errors.distance && parseInt(value, 10) > 0) {
        setErrors({ ...errors, distance: undefined })
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative modal-animate rounded-2xl p-8 max-w-md w-full shadow-xl ${
          dark ? 'bg-warm-gray-800' : 'bg-white'
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
          }`}
        >
          Log Rowing Session
        </h2>

        <div className="space-y-4">
          {/* Workout Name */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                dark ? 'text-warm-gray-300' : 'text-warm-gray-700'
              }`}
            >
              Workout Name *
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => {
                setWorkoutName(e.target.value)
                if (errors.workoutName && e.target.value.trim()) {
                  setErrors({ ...errors, workoutName: undefined })
                }
              }}
              placeholder="e.g., 5k Steady State"
              className={`w-full px-4 py-3 rounded-xl text-base transition-colors border-2 ${
                errors.workoutName
                  ? 'border-red-500 focus:border-red-600'
                  : dark
                  ? 'bg-warm-gray-700 text-warm-gray-100 border-warm-gray-600 focus:border-amber-accent'
                  : 'bg-white text-warm-gray-900 border-warm-gray-200 focus:border-amber-accent'
              } focus:outline-none`}
            />
            {errors.workoutName && (
              <p className="text-red-500 text-sm mt-1">{errors.workoutName}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                dark ? 'text-warm-gray-300' : 'text-warm-gray-700'
              }`}
            >
              Duration (MM:SS) *
            </label>
            <DurationInput
              value={duration}
              onChange={(seconds) => {
                setDuration(seconds)
                if (errors.duration && seconds > 0) {
                  setErrors({ ...errors, duration: undefined })
                }
              }}
              error={errors.duration}
            />
          </div>

          {/* Distance */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                dark ? 'text-warm-gray-300' : 'text-warm-gray-700'
              }`}
            >
              Distance (meters) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={distance}
              onChange={handleDistanceChange}
              placeholder="e.g., 5000"
              className={`w-full px-4 py-3 rounded-xl text-base transition-colors border-2 ${
                errors.distance
                  ? 'border-red-500 focus:border-red-600'
                  : dark
                  ? 'bg-warm-gray-700 text-warm-gray-100 border-warm-gray-600 focus:border-amber-accent'
                  : 'bg-white text-warm-gray-900 border-warm-gray-200 focus:border-amber-accent'
              } focus:outline-none`}
            />
            {errors.distance && (
              <p className="text-red-500 text-sm mt-1">{errors.distance}</p>
            )}
          </div>

          {/* Comment (Optional) */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                dark ? 'text-warm-gray-300' : 'text-warm-gray-700'
              }`}
            >
              Notes (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did it feel?"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl text-base transition-colors border-2 resize-none ${
                dark
                  ? 'bg-warm-gray-700 text-warm-gray-100 border-warm-gray-600 focus:border-amber-accent'
                  : 'bg-white text-warm-gray-900 border-warm-gray-200 focus:border-amber-accent'
              } focus:outline-none`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-xl bg-amber-accent text-white font-semibold text-sm hover:bg-amber-dark transition-colors cursor-pointer border-0"
          >
            Save Session
          </button>
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 ${
              dark
                ? 'bg-warm-gray-700 text-warm-gray-300 hover:bg-warm-gray-600'
                : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
