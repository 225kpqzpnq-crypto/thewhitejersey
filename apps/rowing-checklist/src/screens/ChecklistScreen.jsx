import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { checklists } from '../data/checklists'
import { useChecklist } from '../hooks/useChecklist'
import { useDailyLog } from '../hooks/useDailyLog'
import { useTheme } from '../components/ThemeProvider'
import ChecklistSection from '../components/ChecklistSection'
import ProgressBar from '../components/ProgressBar'
import CompletionModal from '../components/CompletionModal'

export default function ChecklistScreen() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { dark } = useTheme()
  const checklist = checklists[type]
  const { checked, toggle, checkedCount, totalRequired, progress, isComplete } =
    useChecklist(type)
  const { saveSession } = useDailyLog()
  const [showModal, setShowModal] = useState(false)
  const savedRef = useRef(false)

  useEffect(() => {
    if (isComplete && !savedRef.current) {
      savedRef.current = true
      const protocol = type.startsWith('mvp') ? 'mvp' : 'full'
      saveSession(type, protocol, checked, totalRequired)
      setShowModal(true)
    }
  }, [isComplete, type, checked, totalRequired, saveSession])

  if (!checklist) {
    return (
      <div className="mt-16 text-center">
        <p className={dark ? 'text-warm-gray-400' : 'text-warm-gray-500'}>
          Checklist not found.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-amber-accent text-sm cursor-pointer border-0 bg-transparent"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar
        progress={progress}
        checkedCount={Math.min(checkedCount, totalRequired)}
        totalRequired={totalRequired}
      />

      <div className="mt-4 mb-6">
        <h1
          className={`text-xl font-bold ${
            dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
          }`}
        >
          {checklist.title}
        </h1>
        <p className={`text-sm ${dark ? 'text-warm-gray-500' : 'text-warm-gray-400'}`}>
          {checklist.subtitle}
        </p>
      </div>

      {checklist.phases.map((phase, i) => (
        <ChecklistSection
          key={i}
          phase={phase}
          checked={checked}
          onToggle={toggle}
        />
      ))}

      {showModal && (
        <CompletionModal
          type={type}
          onClose={() => setShowModal(false)}
          onGoHome={() => navigate('/')}
        />
      )}
    </div>
  )
}
