import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'system'
export type AccentColor = 'cyan' | 'purple' | 'green' | 'amber' | 'pink'

interface ThemeState {
  theme: Theme
  accentColor: AccentColor
  compactSidebar: boolean
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
  toggleCompactSidebar: () => void
  getEffectiveTheme: () => 'dark' | 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      accentColor: 'cyan',
      compactSidebar: false,
      
      setTheme: (theme) => {
        console.log('setTheme called with:', theme)
        set({ theme })
        applyTheme(theme)
        console.log('Theme applied:', theme, 'Current state:', get().theme)
      },
      
      setAccentColor: (accentColor) => {
        set({ accentColor })
        applyAccentColor(accentColor)
      },
      
      toggleCompactSidebar: () => {
        set((state) => ({ compactSidebar: !state.compactSidebar }))
      },
      
      getEffectiveTheme: () => {
        const { theme } = get()
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme
      },
    }),
    {
      name: 'telescope-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
          applyAccentColor(state.accentColor)
        }
      },
    }
  )
)

// Apply theme to document
function applyTheme(theme: Theme) {
  const root = document.documentElement
  const effectiveTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  root.classList.remove('dark', 'light')
  root.classList.add(effectiveTheme)
  root.setAttribute('data-theme', effectiveTheme)
}

// Apply accent color to document
function applyAccentColor(color: AccentColor) {
  const root = document.documentElement
  root.setAttribute('data-accent', color)
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const state = useThemeStore.getState()
    if (state.theme === 'system') {
      applyTheme('system')
    }
  })
}

