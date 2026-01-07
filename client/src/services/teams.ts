import api from './api'
import type { Team } from '../types'

export const teamService = {
  // Get all teams (optionally filtered by department)
  async getAll(departmentId?: number): Promise<Team[]> {
    const params = departmentId ? `?departmentId=${departmentId}` : ''
    const response = await api.get(`/teams${params}`)
    // Server returns { success, data: [...teams] }
    return response.data.data || []
  },

  // Get single team by ID
  async getById(id: number): Promise<Team> {
    const response = await api.get(`/teams/${id}`)
    return response.data.data
  },
}

