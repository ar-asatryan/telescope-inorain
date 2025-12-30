import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Initialize theme from localStorage before render
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem('telescope-theme')
    if (stored) {
      const { state } = JSON.parse(stored)
      const theme = state?.theme || 'dark'
      const accentColor = state?.accentColor || 'cyan'
      
      const effectiveTheme = theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme
      
      document.documentElement.classList.add(effectiveTheme)
      document.documentElement.setAttribute('data-theme', effectiveTheme)
      document.documentElement.setAttribute('data-accent', accentColor)
    } else {
      // Default to dark theme
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.setAttribute('data-accent', 'cyan')
    }
  } catch {
    // Fallback to dark theme
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.setAttribute('data-accent', 'cyan')
  }
}

initializeTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
