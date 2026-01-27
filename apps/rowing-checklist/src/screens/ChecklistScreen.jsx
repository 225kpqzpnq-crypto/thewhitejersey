import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { checklists } from '../data/checklists'
import { useChecklist } from '../hooks/useChecklist'
import { useDailyLog } from '../hooks/useDailyLog'
import { useTheme } from '../components/ThemeProvider'
import ChecklistSection from '../components/ChecklistSection'
import ProgressBar from '../components/ProgressBar'
import CompletionModal from '../components/CompletionModal'
import IncompleteModal from '../components/IncompleteModal'

export default function ChecklistScreen() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { dark } = useTheme()
  const checklist = checklists[type]
  const { checked, toggle, checkedCount, totalRequired, progress, isComplete } =
    useChecklist(type)
  const { saveSession } = useDailyLog()
  const [showModal, setShowModal] = useState(false)
  const [showIncompleteModal, setShowIncompleteModal] = useState(false)

  const handleDone = () => {
    const protocol = type.startsWith('mvp') ? 'mvp' : 'full'
    if (isComplete) {
      saveSession(type, protocol, checked, totalRequired, true)
      setShowModal(true)
    } else {
      setShowIncompleteModal(true)
    }
  }

  const handleConfirmIncomplete = () => {
    const protocol = type.startsWith('mvp') ? 'mvp' : 'full'
    saveSession(type, protocol, checked, totalRequired, false)
    setShowIncompleteModal(false)
    setShowModal(true)
  }

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

      {/* Floating Action Button */}
      <button
        onClick={handleDone}
        className="fixed bottom-6 right-6 z-10 px-6 py-3 bg-amber-accent text-white font-semibold rounded-xl shadow-lg hover:bg-amber-dark transition-all cursor-pointer border-0 hover:scale-105"
      >
        I'm Done ✓
      </button>

      {showModal && (
        <CompletionModal
          type={type}
          onClose={() => setShowModal(false)}
          onGoHome={() => navigate('/')}
          isComplete={isComplete}
        />
      )}

      {showIncompleteModal && (
        <IncompleteModal
          type={type}
          checkedCount={checkedCount}
          totalRequired={totalRequired}
          progress={progress}
          onConfirm={handleConfirmIncomplete}
          onCancel={() => setShowIncompleteModal(false)}
        />
      )}
    </div>
  )
}
