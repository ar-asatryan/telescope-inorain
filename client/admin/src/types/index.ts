export type UserRole = 'admin' | 'manager' | 'employee'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  users: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}


