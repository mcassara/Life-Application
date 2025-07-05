import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import NeedsAnalysis from './pages/NeedsAnalysis'
import ClientIntake from './pages/ClientIntake'
import FutureTools from './pages/FutureTools'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const { user } = useAuthStore()
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/needs-analysis" element={<NeedsAnalysis />} />
          <Route path="/client-intake" element={<ClientIntake />} />
          <Route path="/future-tools" element={<FutureTools />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
