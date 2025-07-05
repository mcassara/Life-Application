import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Initialize theme on app start
const initializeTheme = () => {
  const stored = localStorage.getItem('theme-storage')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const isDark = parsed.state?.isDarkMode ?? false
      
      if (isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      console.error('Error parsing theme storage:', e)
    }
  } else {
    // Default to light mode
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }
}

initializeTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
