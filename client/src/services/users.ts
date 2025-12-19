import api from './api'
import type { User, UserRole } from '../types'

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

export interface UserListItem extends User {
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UsersResponse {
  success: boolean
  data: {
    users: UserListItem[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UserResponse {
  success: boolean
  data: UserListItem
  message?: string
}

export interface GetUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
}

export const usersService = {
  async getUsers(options: GetUsersOptions = {}): Promise<UsersResponse> {
    const params = new URLSearchParams()
    if (options.page) params.set('page', options.page.toString())
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.search) params.set('search', options.search)
    if (options.role) params.set('role', options.role)

    const response = await api.get<UsersResponse>(`/users?${params.toString()}`)
    return response.data
  },

  async getUserById(id: number): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/users/${id}`)
    return response.data
  },

  async createUser(data: CreateUserData): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/users', data)
    return response.data
  },

  async updateUser(id: number, data: UpdateUserData): Promise<UserResponse> {
    const response = await api.put<UserResponse>(`/users/${id}`, data)
    return response.data
  },

  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  async toggleUserStatus(id: number): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(`/users/${id}/toggle-status`)
    return response.data
  },
}


