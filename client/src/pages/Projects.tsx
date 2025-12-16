import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
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
      { name: 'Anna H.', avatar: 'AH' },
      { name: 'Tigran S.', avatar: 'TS' },
      { name: 'Maria P.', avatar: 'MP' },
      { name: 'David G.', avatar: 'DG' },
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
      { name: 'Gor M.', avatar: 'GM' },
      { name: 'Nare A.', avatar: 'NA' },
      { name: 'Hayk K.', avatar: 'HK' },
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
      { name: 'Tigran S.', avatar: 'TS' },
      { name: 'David G.', avatar: 'DG' },
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
      { name: 'Anna H.', avatar: 'AH' },
      { name: 'Maria P.', avatar: 'MP' },
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
      { name: 'David G.', avatar: 'DG' },
      { name: 'Lusine H.', avatar: 'LH' },
    ],
    lead: 'David Grigoryan',
  },
]

const statusConfig = {
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Active' },
  planning: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Planning' },
  completed: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', label: 'Completed' },
  'on-hold': { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'On Hold' },
}

const priorityConfig = {
  high: { color: 'text-red-400', dot: 'bg-red-400' },
  medium: { color: 'text-amber-400', dot: 'bg-amber-400' },
  low: { color: 'text-emerald-400', dot: 'bg-emerald-400' },
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
          <h1 className="text-2xl font-display font-semibold text-white">Projects</h1>
          <p className="text-zinc-500 mt-1">Track project progress and team assignments</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Total Projects</p>
              <p className="text-3xl font-display font-semibold text-white mt-1">
                {projects.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/20">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilter('active')}
          className={`card cursor-pointer transition-all duration-200 ${
            filter === 'active' ? 'border-emerald-500/50' : 'hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Active</p>
              <p className="text-3xl font-display font-semibold text-emerald-400 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilter('planning')}
          className={`card cursor-pointer transition-all duration-200 ${
            filter === 'planning' ? 'border-amber-500/50' : 'hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Planning</p>
              <p className="text-3xl font-display font-semibold text-amber-400 mt-1">
                {stats.planning}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilter('completed')}
          className={`card cursor-pointer transition-all duration-200 ${
            filter === 'completed' ? 'border-indigo-500/50' : 'hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Completed</p>
              <p className="text-3xl font-display font-semibold text-indigo-400 mt-1">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/20">
              <CheckCircle2 className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          All
        </button>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-children">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="card group hover:border-zinc-700 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                      statusConfig[project.status as keyof typeof statusConfig].bg
                    } ${statusConfig[project.status as keyof typeof statusConfig].text}`}
                  >
                    {statusConfig[project.status as keyof typeof statusConfig].label}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{project.description}</p>
              </div>
              <button className="p-1 text-zinc-600 hover:text-white rounded transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-500">Progress</span>
                <span className="text-white font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Meta info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.endDate).toLocaleDateString()}
                </div>
                <span
                  className={`flex items-center gap-1.5 text-sm ${
                    priorityConfig[project.priority as keyof typeof priorityConfig].color
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      priorityConfig[project.priority as keyof typeof priorityConfig].dot
                    }`}
                  />
                  {project.priority}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 4).map((member, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium ring-2 ring-zinc-900"
                      title={member.name}
                    >
                      {member.avatar}
                    </div>
                  ))}
                  {project.team.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-medium ring-2 ring-zinc-900">
                      +{project.team.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

