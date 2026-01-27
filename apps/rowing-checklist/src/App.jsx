import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import HomePage from './screens/HomePage'
import ChecklistScreen from './screens/ChecklistScreen'
import HistoryScreen from './screens/HistoryScreen'
import AuthScreen from './screens/AuthScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const { userId, loading, login, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🚣</div>
            <p className="text-warm-gray-400">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <AuthScreen onAuthenticated={login} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <HashRouter>
        <Layout userId={userId}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checklist/:type" element={<ChecklistScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  )
}
