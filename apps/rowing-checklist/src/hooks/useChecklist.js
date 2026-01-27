import { useState, useMemo, useCallback } from 'react'
import { getRequiredItemIds, getAllItemIds } from '../data/checklists'

export function useChecklist(type) {
  const [checked, setChecked] = useState(new Set())

  const requiredIds = useMemo(() => getRequiredItemIds(type), [type])
  const allIds = useMemo(() => getAllItemIds(type), [type])

  const toggle = useCallback((id) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const checkedCount = checked.size
  const totalRequired = requiredIds.length
  const totalAll = allIds.length
  const progress = totalRequired > 0 ? checkedCount / totalRequired : 0
  const isComplete = requiredIds.every((id) => checked.has(id))

  const reset = useCallback(() => setChecked(new Set()), [])

  return {
    checked,
    toggle,
    checkedCount,
    totalRequired,
    totalAll,
    progress: Math.min(progress, 1),
    isComplete,
    reset,
  }
}
