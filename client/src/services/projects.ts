import api from './api'
import type { Project } from '@/types'

export interface ProjectFilters {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface PaginatedProjects {
  data: Project[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const projectService = {
  // Get all projects with optional filters
  async getAll(filters?: ProjectFilters): Promise<Project[]> {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const response = await api.get(`/projects?${params.toString()}`)
    // Handle both paginated and non-paginated responses
    const responseData = response.data.data || response.data
    return Array.isArray(responseData) ? responseData : responseData.data || []
  },

  // Get paginated projects
  async getPaginated(filters?: ProjectFilters): Promise<PaginatedProjects> {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const response = await api.get(`/projects?${params.toString()}`)
    const responseData = response.data.data || response.data
    return responseData
  },

  // Get a single project by ID
  async getById(id: number): Promise<Project> {
    const response = await api.get(`/projects/${id}`)
    return response.data.data || response.data
  },
}

