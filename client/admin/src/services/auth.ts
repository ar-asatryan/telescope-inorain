import api from './api'
import type { User, ApiResponse } from '../types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore logout errors
    }
  },

  async me(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data
  },
}


