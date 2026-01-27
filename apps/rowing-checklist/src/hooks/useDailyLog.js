import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'rowing-checklist-log'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function useDailyLog() {
  const [log, setLog] = useLocalStorage(STORAGE_KEY, {})

  const saveSession = useCallback(
    (type, protocol, checkedItems, totalItems) => {
      const key = todayKey()
      setLog((prev) => {
        const day = prev[key] || { sessions: [] }
        return {
          ...prev,
          [key]: {
            sessions: [
              ...day.sessions,
              {
                type,
                protocol,
                completedAt: new Date().toISOString(),
                checkedItems: [...checkedItems],
                totalItems,
              },
            ],
          },
        }
      })
    },
    [setLog],
  )

  const getDay = useCallback(
    (dateStr) => {
      return log[dateStr] || null
    },
    [log],
  )

  const getTodayStatus = useCallback(() => {
    const day = log[todayKey()]
    if (!day) return { pre: false, post: false }
    const types = day.sessions.map((s) => s.type)
    return {
      pre: types.some((t) => t === 'pre' || t === 'mvpPre'),
      post: types.some((t) => t === 'post' || t === 'mvpPost'),
    }
  }, [log])

  const deleteSession = useCallback(
    (dateStr, sessionIndex) => {
      setLog((prev) => {
        const day = prev[dateStr]
        if (!day) return prev
        const sessions = day.sessions.filter((_, i) => i !== sessionIndex)
        if (sessions.length === 0) {
          const { [dateStr]: _, ...rest } = prev
          return rest
        }
        return { ...prev, [dateStr]: { sessions } }
      })
    },
    [setLog],
  )

  return { log, saveSession, deleteSession, getDay, getTodayStatus }
}
