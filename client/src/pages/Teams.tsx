import { useState } from 'react'
import { Plus, Search, Users, ChevronRight, User } from 'lucide-react'

const departments = [
  {
    id: 1,
    name: 'Engineering',
    head: 'Armen Vardanyan',
    headAvatar: 'AV',
    teams: [
      {
        id: 1,
        name: 'Platform',
        lead: 'Anna Hovhannisyan',
        leadAvatar: 'AH',
        members: 12,
        color: 'indigo',
      },
      {
        id: 2,
        name: 'API',
        lead: 'Tigran Sargsyan',
        leadAvatar: 'TS',
        members: 8,
        color: 'emerald',
      },
      {
        id: 3,
        name: 'Infrastructure',
        lead: 'David Grigoryan',
        leadAvatar: 'DG',
        members: 5,
        color: 'purple',
      },
      {
        id: 4,
        name: 'Quality Assurance',
        lead: 'Lusine Hakobyan',
        leadAvatar: 'LH',
        members: 6,
        color: 'amber',
      },
    ],
    employeeCount: 31,
  },
  {
    id: 2,
    name: 'Design',
    head: 'Maria Petrosyan',
    headAvatar: 'MP',
    teams: [
      {
        id: 5,
        name: 'Product Design',
        lead: 'Maria Petrosyan',
        leadAvatar: 'MP',
        members: 6,
        color: 'pink',
      },
      {
        id: 6,
        name: 'Brand',
        lead: 'Nare Arakelyan',
        leadAvatar: 'NA',
        members: 3,
        color: 'rose',
      },
    ],
    employeeCount: 9,
  },
  {
    id: 3,
    name: 'Product',
    head: 'Hayk Karapetyan',
    headAvatar: 'HK',
    teams: [
      {
        id: 7,
        name: 'Product Management',
        lead: 'Hayk Karapetyan',
        leadAvatar: 'HK',
        members: 5,
        color: 'cyan',
      },
    ],
    employeeCount: 5,
  },
]

const colorMap: Record<string, string> = {
  indigo: 'from-indigo-500 to-indigo-600',
  emerald: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  amber: 'from-amber-500 to-amber-600',
  pink: 'from-pink-500 to-pink-600',
  rose: 'from-rose-500 to-rose-600',
  cyan: 'from-cyan-500 to-cyan-600',
}

export function Teams() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedDept, setExpandedDept] = useState<number | null>(1)

  const totalEmployees = departments.reduce((acc, dept) => acc + dept.employeeCount, 0)
  const totalTeams = departments.reduce((acc, dept) => acc + dept.teams.length, 0)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-white">Teams & Structure</h1>
          <p className="text-zinc-500 mt-1">Organizational hierarchy and team management</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add Team
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/20">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-3xl font-display font-semibold text-white">{totalEmployees}</p>
              <p className="text-sm text-zinc-500">Total Employees</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-display font-semibold text-white">{departments.length}</p>
              <p className="text-sm text-zinc-500">Departments</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-display font-semibold text-white">{totalTeams}</p>
              <p className="text-sm text-zinc-500">Teams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search departments or teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Department list */}
      <div className="space-y-4">
        {departments.map((dept) => (
          <div key={dept.id} className="card p-0 overflow-hidden">
            {/* Department header */}
            <button
              onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {dept.headAvatar}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{dept.name}</h3>
                  <p className="text-sm text-zinc-500">
                    Head: {dept.head} · {dept.employeeCount} employees · {dept.teams.length} teams
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${
                  expandedDept === dept.id ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Teams */}
            {expandedDept === dept.id && (
              <div className="border-t border-zinc-800 bg-zinc-900/30">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dept.teams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[team.color]} flex items-center justify-center text-white font-medium text-sm`}
                          >
                            {team.leadAvatar}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{team.name}</h4>
                            <p className="text-sm text-zinc-500">Lead: {team.lead}</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 rounded-lg text-sm text-zinc-400">
                          <User className="w-3.5 h-3.5" />
                          {team.members}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


