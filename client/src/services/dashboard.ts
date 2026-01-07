import api from './api'
import type { Employee, PaginatedResponse } from '../types'

export interface DashboardStats {
  totalEmployees: number
  onVacation: number
  activeProjects: number
  skillsTracked: number
}

export interface RecentEmployee {
  id: number
  firstName: string
  lastName: string
  position: string
  hireDate: string
  status: string
}

export const dashboardService = {
  // Get dashboard stats by making parallel API calls
  async getStats(): Promise<DashboardStats> {
    try {
      // Fetch employees to get count
      const employeesRes = await api.get<PaginatedResponse<Employee>>('/employees?limit=1')
      const totalEmployees = employeesRes.data.total || 0

      // Count employees on vacation
      const vacationRes = await api.get<PaginatedResponse<Employee>>('/employees?status=vacation&limit=1')
      const onVacation = vacationRes.data.total || 0

      // Try to get projects count (might fail if endpoint doesn't exist)
      let activeProjects = 0
      try {
        const projectsRes = await api.get('/projects?status=active&limit=1')
        activeProjects = projectsRes.data.total || 0
      } catch {
        activeProjects = 0
      }

      // Try to get skills count
      let skillsTracked = 0
      try {
        const skillsRes = await api.get('/skills')
        skillsTracked = Array.isArray(skillsRes.data) ? skillsRes.data.length : skillsRes.data?.data?.length || 0
      } catch {
        skillsTracked = 0
      }

      return {
        totalEmployees,
        onVacation,
        activeProjects,
        skillsTracked,
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      return {
        totalEmployees: 0,
        onVacation: 0,
        activeProjects: 0,
        skillsTracked: 0,
      }
    }
  },

  // Get recent employees (newest hires)
  async getRecentEmployees(limit = 5): Promise<RecentEmployee[]> {
    try {
      const response = await api.get<PaginatedResponse<Employee>>(`/employees?limit=${limit}`)
      return response.data.data.map((emp: Employee) => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        position: emp.position,
        hireDate: emp.hireDate,
        status: emp.status,
      }))
    } catch {
      return []
    }
  },
}

