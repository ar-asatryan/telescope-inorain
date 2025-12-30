import { useState } from 'react'
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
} from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'Platform Redesign',
    description: 'Complete redesign of the main platform UI/UX',
    status: 'active',
    priority: 'high',
    startDate: '2024-09-01',
    endDate: '2025-03-01',
    progress: 65,
    team: [
      { name: 'Anna H.', avatar: 'AH', colorFrom: '#00c3ff', colorTo: '#4f8fff' },
      { name: 'Tigran S.', avatar: 'TS', colorFrom: '#8b5cf6', colorTo: '#a855f7' },
      { name: 'Maria P.', avatar: 'MP', colorFrom: '#ec4899', colorTo: '#f43f5e' },
      { name: 'David G.', avatar: 'DG', colorFrom: '#10b981', colorTo: '#00c3ff' },
    ],
    lead: 'Anna Hovhannisyan',
  },
  {
    id: 2,
    name: 'Mobile Application',
    description: 'Native mobile app for iOS and Android platforms',
    status: 'active',
    priority: 'high',
    startDate: '2024-10-15',
    endDate: '2025-04-15',
    progress: 35,
    team: [
      { name: 'Gor M.', avatar: 'GM', colorFrom: '#f59e0b', colorTo: '#f97316' },
      { name: 'Nare A.', avatar: 'NA', colorFrom: '#00c3ff', colorTo: '#8b5cf6' },
      { name: 'Hayk K.', avatar: 'HK', colorFrom: '#10b981', colorTo: '#00c3ff' },
    ],
    lead: 'Gor Manukyan',
  },
  {
    id: 3,
    name: 'API v2.0',
    description: 'New version of public API with improved performance',
    status: 'active',
    priority: 'medium',
    startDate: '2024-11-01',
    endDate: '2025-02-01',
    progress: 80,
    team: [
      { name: 'Tigran S.', avatar: 'TS', colorFrom: '#8b5cf6', colorTo: '#a855f7' },
      { name: 'David G.', avatar: 'DG', colorFrom: '#10b981', colorTo: '#00c3ff' },
    ],
    lead: 'Tigran Sargsyan',
  },
  {
    id: 4,
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard',
    status: 'planning',
    priority: 'medium',
    startDate: '2025-01-01',
    endDate: '2025-05-01',
    progress: 10,
    team: [
      { name: 'Anna H.', avatar: 'AH', colorFrom: '#00c3ff', colorTo: '#4f8fff' },
      { name: 'Maria P.', avatar: 'MP', colorFrom: '#ec4899', colorTo: '#f43f5e' },
    ],
    lead: 'Anna Hovhannisyan',
  },
  {
    id: 5,
    name: 'Infrastructure Migration',
    description: 'Migrate infrastructure to Kubernetes',
    status: 'completed',
    priority: 'high',
    startDate: '2024-06-01',
    endDate: '2024-11-01',
    progress: 100,
    team: [
      { name: 'David G.', avatar: 'DG', colorFrom: '#10b981', colorTo: '#00c3ff' },
      { name: 'Lusine H.', avatar: 'LH', colorFrom: '#f59e0b', colorTo: '#f97316' },
    ],
    lead: 'David Grigoryan',
  },
]

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

  const filteredProjects = projects.filter(
    (project) =>
      (filter === 'all' || project.status === filter) &&
      (project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()))
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

      {/* Project cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger-children">
        {filteredProjects.map((project) => {
          const status = statusConfig[project.status as keyof typeof statusConfig]
          const priority = priorityConfig[project.priority as keyof typeof priorityConfig]
          
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
                    {project.description}
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
                    {project.progress}%
                  </span>
                </div>
                <div 
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--color-bg-hover)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${project.progress}%`,
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
                  <div 
                    className="flex items-center gap-1.5 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    {new Date(project.endDate).toLocaleDateString()}
                  </div>
                  <div 
                    className="flex items-center gap-1.5 text-sm capitalize"
                    style={{ color: priority.color }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ background: priority.dot }}
                    />
                    {project.priority}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 4).map((member, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 transition-all"
                        style={{ 
                          background: `linear-gradient(135deg, ${member.colorFrom}, ${member.colorTo})`,
                          ringColor: 'var(--color-bg-card)'
                        }}
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    ))}
                    {project.team.length > 4 && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-2"
                        style={{ 
                          background: 'var(--color-bg-hover)',
                          color: 'var(--color-text-secondary)',
                          ringColor: 'var(--color-bg-card)'
                        }}
                      >
                        +{project.team.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover arrow */}
              <ArrowUpRight 
                className="absolute bottom-6 right-6 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ color: 'var(--color-accent)' }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
