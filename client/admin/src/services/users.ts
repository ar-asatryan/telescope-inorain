import api from './api'
import type { User, UserRole, ApiResponse, PaginatedResponse } from '../types'

export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}

export interface UpdateUserData {
  email?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  isActive?: boolean
}

export interface GetUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
}

export const usersService = {
  async getUsers(options: GetUsersOptions = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = new URLSearchParams()
    if (options.page) params.set('page', options.page.toString())
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.search) params.set('search', options.search)
    if (options.role) params.set('role', options.role)

    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users?${params.toString()}`)
    return response.data
  },

  async getUserById(id: number): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`)
    return response.data
  },

  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/users', data)
    return response.data
  },

  async updateUser(id: number, data: UpdateUserData): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data)
    return response.data
  },

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`)
    return response.data
  },

  async toggleUserStatus(id: number): Promise<ApiResponse<User>> {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/toggle-status`)
    return response.data
  },
}

