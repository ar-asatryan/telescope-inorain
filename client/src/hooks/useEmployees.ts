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

export function useEmployees(externalFilters?: EmployeeFilters) {
  const [state, setState] = useState<UseEmployeesState>({
    employees: [],
    loading: true,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,
  })

  // Internal page state for pagination
  const [currentPage, setCurrentPage] = useState(1)
  
  // Create a stable key for external filters to detect changes
  const filterKey = JSON.stringify({
    search: externalFilters?.search,
    departmentId: externalFilters?.departmentId,
    teamId: externalFilters?.teamId,
    status: externalFilters?.status,
    projectId: externalFilters?.projectId,
    limit: externalFilters?.limit,
  })

  const fetchEmployees = useCallback(async (page: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const filtersToUse: EmployeeFilters = {
        ...externalFilters,
        page,
      }
      console.log('Fetching employees with filters:', JSON.stringify(filtersToUse)) // Debug log
      const response = await employeeService.getAll(filtersToUse)
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
  }, [externalFilters])

  // Fetch when external filters change - reset to page 1
  useEffect(() => {
    console.log('Filter key changed:', filterKey) // Debug log
    setCurrentPage(1)
    fetchEmployees(1)
  }, [filterKey])

  // Update page handler
  const updateFilters = useCallback((newFilters: Partial<EmployeeFilters>) => {
    if (newFilters.page !== undefined) {
      setCurrentPage(newFilters.page)
      fetchEmployees(newFilters.page)
    }
  }, [fetchEmployees])

  const refetch = useCallback(() => {
    fetchEmployees(currentPage)
  }, [fetchEmployees, currentPage])

  return {
    ...state,
    filters: { ...externalFilters, page: currentPage },
    updateFilters,
    refetch,
  }
}



