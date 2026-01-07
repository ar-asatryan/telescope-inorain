import { useState, useEffect, useRef } from 'react'
import { Filter, X, ChevronDown, Check, Loader2 } from 'lucide-react'
import { departmentService } from '@/services/departments'
import { teamService } from '@/services/teams'
import { projectService } from '@/services/projects'
import type { Department, Team, Project, EmployeeStatus } from '@/types'

export interface FilterState {
  departmentId?: number
  teamId?: number
  status?: EmployeeStatus
  projectId?: number
}

interface EmployeeFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

const statusOptions: { value: EmployeeStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'vacation', label: 'On Vacation' },
  { value: 'inactive', label: 'Inactive' },
]

export function EmployeeFilters({ filters, onFilterChange }: EmployeeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Local state for the filter form
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  // Count active filters
  const activeFilterCount = [
    filters.departmentId,
    filters.teamId,
    filters.status,
    filters.projectId,
  ].filter(Boolean).length

  // Load departments and teams when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadFilterOptions()
    }
  }, [isOpen])

  // Load teams when department changes
  useEffect(() => {
    if (localFilters.departmentId) {
      loadTeams(localFilters.departmentId)
    } else {
      loadTeams()
    }
  }, [localFilters.departmentId])

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadFilterOptions = async () => {
    setLoading(true)
    try {
      const [depts, tms, projs] = await Promise.all([
        departmentService.getAll(),
        teamService.getAll(),
        projectService.getAll()
      ])
      setDepartments(depts)
      setTeams(tms)
      setProjects(projs)
    } catch (error) {
      console.error('Failed to load filter options:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTeams = async (departmentId?: number) => {
    try {
      const tms = await teamService.getAll(departmentId)
      setTeams(tms)
    } catch (error) {
      console.error('Failed to load teams:', error)
    }
  }

  const handleDepartmentChange = (departmentId: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      departmentId,
      teamId: undefined, // Reset team when department changes
    }))
  }

  const handleTeamChange = (teamId: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      teamId,
    }))
  }

  const handleStatusChange = (status: EmployeeStatus | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      status,
    }))
  }

  const handleProjectChange = (projectId: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      projectId,
    }))
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {}
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const handleClearAll = () => {
    handleClearFilters()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary relative"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span 
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
            style={{ background: 'var(--color-accent)' }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in"
          style={{ 
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)'
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Filter Employees
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg transition-colors hover:bg-[var(--color-bg-hover)]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-accent)' }} />
              </div>
            ) : (
              <>
                {/* Department Filter */}
                <div className="space-y-2">
                  <label 
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Department
                  </label>
                  <SelectDropdown
                    value={localFilters.departmentId}
                    options={[
                      { value: undefined, label: 'All Departments' },
                      ...departments.map(d => ({ value: d.id, label: d.name }))
                    ]}
                    onChange={handleDepartmentChange}
                    placeholder="Select department"
                  />
                </div>

                {/* Team Filter */}
                <div className="space-y-2">
                  <label 
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Team
                  </label>
                  <SelectDropdown
                    value={localFilters.teamId}
                    options={[
                      { value: undefined, label: 'All Teams' },
                      ...teams.map(t => ({ value: t.id, label: t.name }))
                    ]}
                    onChange={handleTeamChange}
                    placeholder="Select team"
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label 
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Status
                  </label>
                  <SelectDropdown
                    value={localFilters.status}
                    options={statusOptions.map(s => ({ 
                      value: s.value || undefined, 
                      label: s.label 
                    }))}
                    onChange={(val) => handleStatusChange(val as EmployeeStatus | undefined)}
                    placeholder="Select status"
                  />
                </div>

                {/* Project Filter */}
                <div className="space-y-2">
                  <label 
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Project
                  </label>
                  <SelectDropdown
                    value={localFilters.projectId}
                    options={[
                      { value: undefined, label: 'All Projects' },
                      ...projects.map(p => ({ value: p.id, label: p.name }))
                    ]}
                    onChange={handleProjectChange}
                    placeholder="Select project"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div 
            className="flex items-center justify-between px-4 py-3 gap-2"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <button
              onClick={handleClearAll}
              className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Clear all
            </button>
            <button
              onClick={handleApplyFilters}
              className="btn-primary text-sm px-4 py-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Reusable Select Dropdown Component
interface SelectOption<T> {
  value: T
  label: string
}

interface SelectDropdownProps<T> {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
}

function SelectDropdown<T>({ value, options, onChange, placeholder }: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all"
        style={{ 
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          color: selectedOption ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
        }}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-text-muted)' }}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
          style={{ 
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)'
          }}
        >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors hover:bg-[var(--color-bg-hover)]"
              style={{ 
                color: option.value === value 
                  ? 'var(--color-accent)' 
                  : 'var(--color-text-primary)'
              }}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

