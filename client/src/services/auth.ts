import api from './api'
import type { User } from '../types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface MeResponse {
  success: boolean
  data: User
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore logout errors
    }
  },

  async me(): Promise<MeResponse> {
    const response = await api.get<MeResponse>('/auth/me')
    return response.data
  },
}


