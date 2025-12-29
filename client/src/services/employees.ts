import api from './api'
import type { Employee, PaginatedResponse, EmployeeSkill, Vacation } from '../types'

export interface EmployeeFilters {
  search?: string
  departmentId?: number
  teamId?: number
  status?: string
  page?: number
  limit?: number
}

export const employeeService = {
  // Get all employees with filters
  async getAll(filters?: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.departmentId) params.append('departmentId', String(filters.departmentId))
    if (filters?.teamId) params.append('teamId', String(filters.teamId))
    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))

    const response = await api.get(`/employees?${params.toString()}`)
    return response.data
  },

  // Get single employee by ID
  async getById(id: number): Promise<Employee> {
    const response = await api.get(`/employees/${id}`)
    return response.data
  },

  // Create new employee
  async create(data: Partial<Employee>): Promise<Employee> {
    const response = await api.post('/employees', data)
    return response.data
  },

  // Update employee
  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const response = await api.put(`/employees/${id}`, data)
    return response.data
  },

  // Delete employee
  async delete(id: number): Promise<void> {
    await api.delete(`/employees/${id}`)
  },

  // Get employee skills
  async getSkills(id: number): Promise<EmployeeSkill[]> {
    const response = await api.get(`/employees/${id}/skills`)
    return response.data
  },

  // Get employee vacations
  async getVacations(id: number): Promise<Vacation[]> {
    const response = await api.get(`/employees/${id}/vacations`)
    return response.data
  },
}



