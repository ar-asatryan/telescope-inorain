import { useState, useEffect, useCallback } from 'react'
import { employeeService, EmployeeFilters } from '../services/employees'
import type { Employee } from '../types'

interface UseEmployeesState {
  employees: Employee[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
}

export function useEmployees(initialFilters?: EmployeeFilters) {
  const [state, setState] = useState<UseEmployeesState>({
    employees: [],
    loading: true,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,
  })

  const [filters, setFilters] = useState<EmployeeFilters>(initialFilters || {})

  const fetchEmployees = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await employeeService.getAll(filters)
      setState({
        employees: response.data,
        loading: false,
        error: null,
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
      })
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch employees',
      }))
    }
  }, [filters])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const updateFilters = useCallback((newFilters: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const refetch = useCallback(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return {
    ...state,
    filters,
    updateFilters,
    refetch,
  }
}



