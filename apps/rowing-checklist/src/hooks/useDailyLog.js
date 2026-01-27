import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'rowing-checklist-log'
const CURRENT_VERSION = 2

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function useDailyLog() {
  const [log, setLog] = useLocalStorage(STORAGE_KEY, {})
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)
  const initialLoadDone = useRef(false)
  const syncTimeoutRef = useRef(null)

  // Load data from cloud on mount
  useEffect(() => {
    const loadFromCloud = async () => {
      const userId = localStorage.getItem('rowing-userId')
      if (!userId) {
        initialLoadDone.current = true
        return
      }

      try {
        const response = await fetch(`/api/log/read?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.log && Object.keys(data.log).length > 0) {
            setLog(data.log)
          }
        }
      } catch (error) {
        console.error('Failed to load from cloud:', error)
        setSyncError('Failed to sync with cloud')
      } finally {
        initialLoadDone.current = true
      }
    }

    loadFromCloud()
  }, [])

  // Migration logic: run after initial load
  useEffect(() => {
    if (!initialLoadDone.current) return

    if (!log.version || log.version < CURRENT_VERSION) {
      setLog((prev) => {
        const migrated = { ...prev, version: CURRENT_VERSION }

        // Migrate all existing sessions to add sessionType and isComplete
        Object.keys(migrated).forEach((key) => {
          if (key === 'version') return

          const dayData = migrated[key]
          if (dayData?.sessions) {
            dayData.sessions = dayData.sessions.map((session) => ({
              ...session,
              sessionType: session.sessionType || 'checklist',
              isComplete: session.isComplete !== undefined ? session.isComplete : true,
            }))
          }
        })

        return migrated
      })
    }
  }, [initialLoadDone.current])

  // Sync to cloud when log changes
  useEffect(() => {
    if (!initialLoadDone.current) return

    const userId = localStorage.getItem('rowing-userId')
    if (!userId) return

    // Debounce sync to avoid too many API calls
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }

    syncTimeoutRef.current = setTimeout(async () => {
      setSyncing(true)
      setSyncError(null)

      try {
        const response = await fetch('/api/log/write', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, log }),
        })

        if (!response.ok) {
          throw new Error('Sync failed')
        }
      } catch (error) {
        console.error('Failed to sync to cloud:', error)
        setSyncError('Failed to sync')
      } finally {
        setSyncing(false)
      }
    }, 1000) // Wait 1 second after last change before syncing

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [log])

  const saveSession = useCallback(
    (type, protocol, checkedItems, totalItems, isComplete = true) => {
      const key = todayKey()
      setLog((prev) => {
        const day = prev[key] || { sessions: [] }
        return {
          ...prev,
          [key]: {
            sessions: [
              ...day.sessions,
              {
                sessionType: 'checklist',
                type,
                protocol,
                completedAt: new Date().toISOString(),
                checkedItems: [...checkedItems],
                totalItems,
                isComplete,
              },
            ],
          },
        }
      })
    },
    [setLog],
  )

  const saveRowingSession = useCallback(
    (workoutName, duration, distance, comment = '') => {
      const key = todayKey()
      setLog((prev) => {
        const day = prev[key] || { sessions: [] }
        return {
          ...prev,
          [key]: {
            sessions: [
              ...day.sessions,
              {
                sessionType: 'rowing',
                workoutName,
                duration,
                distance,
                comment,
                completedAt: new Date().toISOString(),
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

  return {
    log,
    saveSession,
    saveRowingSession,
    deleteSession,
    getDay,
    getTodayStatus,
    syncing,
    syncError,
  }
}
