import { useState, useEffect } from 'react'

export function useAuth() {
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUserId = localStorage.getItem('rowing-userId')
    if (storedUserId) {
      setUserId(storedUserId)
    }
    setLoading(false)
  }, [])

  const login = (newUserId) => {
    localStorage.setItem('rowing-userId', newUserId)
    setUserId(newUserId)
  }

  const logout = () => {
    localStorage.removeItem('rowing-userId')
    setUserId(null)
  }

  return { userId, loading, login, logout, isAuthenticated: !!userId }
}
