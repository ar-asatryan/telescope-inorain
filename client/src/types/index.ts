// Employee types
export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  departmentId: number
  teamId: number
  managerId: number | null
  englishLevel: EnglishLevel
  hireDate: string
  status: EmployeeStatus
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export type EmployeeStatus = 'active' | 'vacation' | 'inactive'
export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

// Skill types
export interface Skill {
  id: number
  name: string
  category: SkillCategory
  description?: string
}

export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'design' | 'management' | 'other'

export interface EmployeeSkill {
  id: number
  employeeId: number
  skillId: number
  level: SkillLevel
  yearsOfExperience: number
  skill?: Skill
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5

// Vacation types
export interface Vacation {
  id: number
  employeeId: number
  type: VacationType
  startDate: string
  endDate: string
  status: VacationStatus
  reason?: string
  approvedById: number | null
  approvedAt: string | null
  createdAt: string
  employee?: Employee
}

export type VacationType = 'vacation' | 'sick_leave' | 'day_off' | 'remote'
export type VacationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

// Department types
export interface Department {
  id: number
  name: string
  description?: string
  headId: number | null
  head?: Employee
  teams?: Team[]
}

// Team types
export interface Team {
  id: number
  name: string
  departmentId: number
  leadId: number | null
  description?: string
  lead?: Employee
  members?: Employee[]
}

// Project types
export interface Project {
  id: number
  name: string
  description?: string
  status: ProjectStatus
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'

export interface ProjectAssignment {
  id: number
  projectId: number
  employeeId: number
  role: string
  startDate: string
  endDate?: string
  project?: Project
  employee?: Employee
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Auth types
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export type UserRole = 'admin' | 'manager' | 'employee'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}


