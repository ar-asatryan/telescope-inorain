import api from './api'
import type { Vacation, VacationType, VacationStatus, PaginatedResponse, ApiResponse } from '../types'

export interface CreateVacationDto {
  employeeId: number
  type: VacationType
  startDate: string
  endDate: string
  reason?: string
}

export interface QueryVacationsDto {
  page?: number
  limit?: number
  status?: VacationStatus
  employeeId?: number
  type?: VacationType
  startDate?: string
  endDate?: string
}

export interface VacationWithEmployee extends Vacation {
  employee?: {
    id: number
    firstName: string
    lastName: string
    email: string
    position: string
  }
}

export const vacationsService = {
  // Get all vacations with pagination and filters
  async getAll(query?: QueryVacationsDto): Promise<PaginatedResponse<VacationWithEmployee>> {
    const params = new URLSearchParams()
    if (query?.page) params.append('page', query.page.toString())
    if (query?.limit) params.append('limit', query.limit.toString())
    if (query?.status) params.append('status', query.status)
    if (query?.employeeId) params.append('employeeId', query.employeeId.toString())
    if (query?.type) params.append('type', query.type)
    if (query?.startDate) params.append('startDate', query.startDate)
    if (query?.endDate) params.append('endDate', query.endDate)

    const response = await api.get<PaginatedResponse<VacationWithEmployee>>(`/vacations?${params}`)
    return response.data
  },

  // Get vacation by ID
  async getById(id: number): Promise<VacationWithEmployee> {
    const response = await api.get<ApiResponse<VacationWithEmployee>>(`/vacations/${id}`)
    return response.data.data
  },

  // Create new vacation request
  async create(data: CreateVacationDto): Promise<Vacation> {
    const response = await api.post<ApiResponse<Vacation>>('/vacations', data)
    return response.data.data
  },

  // Approve vacation request
  async approve(id: number): Promise<Vacation> {
    const response = await api.put<ApiResponse<Vacation>>(`/vacations/${id}/approve`)
    return response.data.data
  },

  // Reject vacation request
  async reject(id: number, rejectionReason: string): Promise<Vacation> {
    const response = await api.put<ApiResponse<Vacation>>(`/vacations/${id}/reject`, { rejectionReason })
    return response.data.data
  },

  // Cancel vacation request
  async cancel(id: number): Promise<Vacation> {
    const response = await api.put<ApiResponse<Vacation>>(`/vacations/${id}/cancel`)
    return response.data.data
  },

  // Get vacations for calendar view (returns all vacations in a date range)
  async getForCalendar(startDate: string, endDate: string): Promise<VacationWithEmployee[]> {
    const response = await api.get<PaginatedResponse<VacationWithEmployee>>(
      `/vacations?startDate=${startDate}&endDate=${endDate}&limit=1000`
    )
    return response.data.data
  },
}

export default vacationsService

