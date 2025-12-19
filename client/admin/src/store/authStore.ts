import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, token) => {
        localStorage.setItem('admin_token', token)
        set({ user, token, isAuthenticated: true, isLoading: false })
      },
      setUser: (user) => {
        set({ user, isAuthenticated: true, isLoading: false })
      },
      logout: () => {
        localStorage.removeItem('admin_token')
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
      },
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false)
        }
      },
    }
  )
)

