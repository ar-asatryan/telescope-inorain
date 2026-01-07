import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  ArrowUpRight,
  Rocket,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { projectService } from '@/services/projects'
import { getClickUpFolderUrl } from '@/utils/clickup'
import type { Project, ProjectStatus } from '@/types'

// Avatar color generator based on name
const getAvatarColors = (name: string) => {
  const colors = [
    { from: '#00c3ff', to: '#4f8fff' },
    { from: '#8b5cf6', to: '#a855f7' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#10b981', to: '#00c3ff' },
    { from: '#f59e0b', to: '#f97316' },
    { from: '#6366f1', to: '#8b5cf6' },
  ]
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const statusConfig = {
  active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)', label: 'Active' },
  planning: { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)', label: 'Planning' },
  completed: { bg: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', color: 'var(--color-accent)', borderColor: 'color-mix(in srgb, var(--color-accent) 30%, transparent)', label: 'Completed' },
  'on-hold': { bg: 'rgba(107, 114, 128, 0.1)', color: '#9ca3af', borderColor: 'rgba(107, 114, 128, 0.3)', label: 'On Hold' },
}

const priorityConfig = {
  high: { color: '#f87171', dot: '#ef4444' },
  medium: { color: '#fbbf24', dot: '#f59e0b' },
  low: { color: '#34d399', dot: '#10b981' },
}

export function Projects() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'planning' | 'completed'>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      setError(null)
      try {
        const data = await projectService.getAll()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
        console.error('Failed to load projects:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(
    (project) =>
      (filter === 'all' || project.status === filter) &&
      (project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false))
  )

  const stats = {
    active: projects.filter((p) => p.status === 'active').length,
    planning: projects.filter((p) => p.status === 'planning').length,
    completed: projects.filter((p) => p.status === 'completed').length,
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
            Projects
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            Track project progress and team assignments
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Total Projects
              </p>
              <p 
                className="text-4xl font-display font-bold mt-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {projects.length}
              </p>
            </div>
            <div 
              className="p-3.5 rounded-xl"
              style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
            >
              <Rocket className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
            </div>
          </div>
        </div>
        <button
          onClick={() => setFilter('active')}
          className="card cursor-pointer text-left transition-all duration-300"
          style={{
            borderColor: filter === 'active' ? 'rgba(16, 185, 129, 0.5)' : undefined
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Active
              </p>
              <p className="text-4xl font-display font-bold text-emerald-400 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="p-3.5 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('planning')}
          className="card cursor-pointer text-left transition-all duration-300"
          style={{
            borderColor: filter === 'planning' ? 'rgba(245, 158, 11, 0.5)' : undefined
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Planning
              </p>
              <p className="text-4xl font-display font-bold text-amber-400 mt-1">
                {stats.planning}
              </p>
            </div>
            <div className="p-3.5 rounded-xl" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className="card cursor-pointer text-left transition-all duration-300"
          style={{
            borderColor: filter === 'completed' ? 'color-mix(in srgb, var(--color-accent) 50%, transparent)' : undefined
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Completed
              </p>
              <p 
                className="text-4xl font-display font-bold mt-1"
                style={{ color: 'var(--color-accent)' }}
              >
                {stats.completed}
              </p>
            </div>
            <div 
              className="p-3.5 rounded-xl"
              style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
            </div>
          </div>
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300"
          style={{
            background: filter === 'all' 
              ? 'linear-gradient(90deg, var(--color-accent), var(--color-inorain-blue))' 
              : 'var(--color-bg-hover)',
            color: filter === 'all' ? 'white' : 'var(--color-text-secondary)'
          }}
        >
          All
        </button>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="card p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
        </div>
      )}

      {/* Project cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger-children">
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 card p-8 text-center">
              <Rocket className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.active
              const priority = priorityConfig[(project.priority || 'medium') as keyof typeof priorityConfig]
              const team = project.assignments || []
              const clickupUrl = getClickUpFolderUrl(project.name)
              
              return (
                <div
                  key={project.id}
                  className="card group transition-all duration-300 relative overflow-hidden hover:scale-[1.01]"
                >
                  {/* Top gradient line */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-inorain-blue), var(--color-inorain-purple))' }}
                  />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 
                          className="font-display font-semibold text-lg transition-colors"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {project.name}
                        </h3>
                        <span
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg"
                          style={{ 
                            background: status.bg,
                            color: status.color,
                            border: `1px solid ${status.borderColor}`
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {project.description || 'No description'}
                      </p>
                    </div>
                    <button 
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span style={{ color: 'var(--color-text-secondary)' }}>Progress</span>
                      <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {project.progress || 0}%
                      </span>
                    </div>
                    <div 
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--color-bg-hover)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${project.progress || 0}%`,
                          background: 'linear-gradient(90deg, var(--color-accent), var(--color-inorain-blue))'
                        }}
                      />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div 
                    className="flex items-center justify-between mt-5 pt-5"
                    style={{ borderTop: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-center gap-3">
                      {project.endDate && (
                        <div 
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                          {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      )}
                      <div 
                        className="flex items-center gap-1.5 text-sm capitalize"
                        style={{ color: priority.color }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ background: priority.dot }}
                        />
                        {project.priority || 'medium'}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {team.slice(0, 4).map((assignment, i) => {
                          const employee = assignment.employee
                          if (!employee) return null
                          const colors = getAvatarColors(`${employee.firstName} ${employee.lastName}`)
                          return (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 transition-all"
                              style={{ 
                                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                                ringColor: 'var(--color-bg-card)'
                              }}
                              title={`${employee.firstName} ${employee.lastName}`}
                            >
                              {getInitials(employee.firstName, employee.lastName)}
                            </div>
                          )
                        })}
                        {team.length > 4 && (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-2"
                            style={{ 
                              background: 'var(--color-bg-hover)',
                              color: 'var(--color-text-secondary)',
                              ringColor: 'var(--color-bg-card)'
                            }}
                          >
                            +{team.length - 4}
                          </div>
                        )}
                        {team.length === 0 && (
                          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            No team assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ClickUp Button */}
                  {clickupUrl && (
                    <div 
                      className="mt-4 pt-4"
                      style={{ borderTop: '1px solid var(--color-border)' }}
                    >
                      <a
                        href={clickupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #7B68EE 0%, #49CCF9 50%, #FF6BB5 100%)',
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(123, 104, 238, 0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M4.14 14.64L2 12.5l5.34-5.34 2.14 2.14L4.14 14.64zM9.48 20L7.34 17.86l5.34-5.34 2.14 2.14L9.48 20zM12 7.5L9.86 5.36 15.2 0l2.14 2.14L12 7.5zM17.34 12.84l-2.14-2.14 5.34-5.34L22.68 7.5l-5.34 5.34z"/>
                        </svg>
                        Open in ClickUp
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    </div>
                  )}

                  {/* Hover arrow */}
                  <ArrowUpRight 
                    className="absolute bottom-6 right-6 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ color: 'var(--color-accent)' }}
                  />
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
