import api from './api'
import type { Department } from '../types'

export const departmentService = {
  // Get all departments
  async getAll(): Promise<Department[]> {
    const response = await api.get('/departments')
    // Server returns { success, data: [...departments] }
    return response.data.data || []
  },

  // Get single department by ID
  async getById(id: number): Promise<Department> {
    const response = await api.get(`/departments/${id}`)
    return response.data.data
  },
}

