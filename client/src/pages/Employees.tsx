import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Building2,
  ArrowUpRight,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react'
import { useEmployees } from '@/hooks/useEmployees'
import { EmployeeFilters, type FilterState } from '@/components/employees'
import type { Employee } from '@/types'

// Generate gradient colors based on employee name/id
const getGradientColors = (id: number) => {
  const gradients = [
    { from: '#00c3ff', to: '#4f8fff' },
    { from: '#8b5cf6', to: '#a855f7' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#10b981', to: '#00c3ff' },
    { from: '#f59e0b', to: '#f97316' },
    { from: '#00c3ff', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#14b8a6', to: '#22c55e' },
  ]
  return gradients[id % gradients.length]
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const statusConfig = {
  active: { 
    dotColor: '#10b981',
    label: 'Active' 
  },
  vacation: { 
    dotColor: '#f59e0b',
    label: 'Vacation' 
  },
  inactive: { 
    dotColor: '#6b7280',
    label: 'Inactive' 
  },
}

export function Employees() {
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState<FilterState>({})

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Debounce complete, setting search to:', searchQuery) // Debug log
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Pass filters directly to the hook - it will refetch when they change
  const { employees, loading, error, total, page, totalPages, updateFilters } = useEmployees({
    search: debouncedSearch || undefined,
    departmentId: filters.departmentId,
    teamId: filters.teamId,
    status: filters.status,
    projectId: filters.projectId,
    limit: 12,
  })

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage })
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  // Count active filters (excluding search)
  const activeFilterCount = [
    filters.departmentId,
    filters.teamId,
    filters.status,
    filters.projectId,
  ].filter(Boolean).length

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Failed to load employees
        </h2>
        <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-display font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Employees
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your team members and their information
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search employees by name, email, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors hover:bg-[var(--color-bg-hover)]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <EmployeeFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div 
          className="flex rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <button
            onClick={() => setView('grid')}
            className="p-2.5 transition-all duration-300"
            style={{
              background: view === 'grid' ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)' : 'transparent',
              color: view === 'grid' ? 'var(--color-accent)' : 'var(--color-text-muted)'
            }}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className="p-2.5 transition-all duration-300"
            style={{
              background: view === 'list' ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)' : 'transparent',
              color: view === 'list' ? 'var(--color-accent)' : 'var(--color-text-muted)'
            }}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || activeFilterCount > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Active filters:
          </span>
          {searchQuery && (
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-lg"
              style={{ 
                background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
                color: 'var(--color-accent)'
              }}
            >
              Search: "{searchQuery}"
              <button 
                onClick={clearSearch}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.departmentId && (
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-lg"
              style={{ 
                background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
                color: 'var(--color-accent)'
              }}
            >
              Department
              <button 
                onClick={() => handleFilterChange({ ...filters, departmentId: undefined })}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.teamId && (
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-lg"
              style={{ 
                background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
                color: 'var(--color-accent)'
              }}
            >
              Team
              <button 
                onClick={() => handleFilterChange({ ...filters, teamId: undefined })}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.status && (
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-lg"
              style={{ 
                background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
                color: 'var(--color-accent)'
              }}
            >
              Status: {filters.status}
              <button 
                onClick={() => handleFilterChange({ ...filters, status: undefined })}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.projectId && (
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-lg"
              style={{ 
                background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
                color: 'var(--color-accent)'
              }}
            >
              Project
              <button 
                onClick={() => handleFilterChange({ ...filters, projectId: undefined })}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(searchQuery || activeFilterCount > 0) && (
            <button
              onClick={() => {
                clearSearch()
                handleFilterChange({})
              }}
              className="text-sm px-2 py-1 transition-colors hover:underline"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
          <span className="ml-3" style={{ color: 'var(--color-text-secondary)' }}>
            Loading employees...
          </span>
        </div>
      )}

      {/* Empty state */}
      {!loading && employees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--color-bg-hover)' }}
          >
            <Search className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            No employees found
          </h2>
          <p className="mt-2 text-center max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
            {(searchQuery || activeFilterCount > 0) 
              ? 'Try adjusting your search terms or removing some filters' 
              : 'Add your first employee to get started'}
          </p>
          {(searchQuery || activeFilterCount > 0) && (
            <button
              onClick={() => {
                clearSearch()
                handleFilterChange({})
              }}
              className="mt-4 btn-secondary"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Employee grid */}
      {!loading && employees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {employees.map((employee: Employee) => {
            const status = statusConfig[employee.status as keyof typeof statusConfig] || statusConfig.active
            const gradient = getGradientColors(employee.id)
            const initials = getInitials(employee.firstName, employee.lastName)
            
            return (
              <Link
                key={employee.id}
                to={`/employees/${employee.id}`}
                className="card group transition-all duration-300 relative overflow-hidden hover:scale-[1.02]"
              >
                {/* Top gradient line on hover */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }}
                />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg group-hover:scale-105 transition-transform duration-300"
                      style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                    >
                      {employee.avatarUrl ? (
                        <img 
                          src={employee.avatarUrl} 
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div>
                      <h3 
                        className="font-semibold transition-colors"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {employee.position}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => e.preventDefault()}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <Mail className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <Building2 className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    {employee.position}
                  </div>
                </div>

                <div 
                  className="mt-4 pt-4 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  <div className="flex gap-1.5">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors"
                      style={{ 
                        background: 'var(--color-bg-hover)',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {employee.englishLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ background: status.dotColor }}
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: status.dotColor }}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Hover arrow */}
                <ArrowUpRight 
                  className="absolute bottom-6 right-6 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                  style={{ color: 'var(--color-accent)' }}
                />
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && employees.length > 0 && (
        <div 
          className="flex items-center justify-between text-sm pt-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>
            Showing{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              {employees.length}
            </span>{' '}
            of{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              {total}
            </span>{' '}
            employees
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
              <button 
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={page === pageNum ? {
                  background: 'linear-gradient(90deg, var(--color-accent), var(--color-inorain-blue))',
                  color: 'white'
                } : { 
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {pageNum}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
