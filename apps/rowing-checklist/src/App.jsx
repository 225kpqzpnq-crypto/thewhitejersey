import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import Layout from './components/Layout'
import HomePage from './screens/HomePage'
import ChecklistScreen from './screens/ChecklistScreen'
import HistoryScreen from './screens/HistoryScreen'

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checklist/:type" element={<ChecklistScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  )
}
