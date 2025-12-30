import { useState } from 'react'
import { Plus, Search, Users, ChevronRight, User } from 'lucide-react'

const departments = [
  {
    id: 1,
    name: 'Engineering',
    head: 'Armen Vardanyan',
    headAvatar: 'AV',
    teams: [
      { id: 1, name: 'Platform', lead: 'Anna Hovhannisyan', leadAvatar: 'AH', members: 12, colorFrom: '#00c3ff', colorTo: '#4f8fff' },
      { id: 2, name: 'API', lead: 'Tigran Sargsyan', leadAvatar: 'TS', members: 8, colorFrom: '#10b981', colorTo: '#34d399' },
      { id: 3, name: 'Infrastructure', lead: 'David Grigoryan', leadAvatar: 'DG', members: 5, colorFrom: '#8b5cf6', colorTo: '#a78bfa' },
      { id: 4, name: 'Quality Assurance', lead: 'Lusine Hakobyan', leadAvatar: 'LH', members: 6, colorFrom: '#f59e0b', colorTo: '#fbbf24' },
    ],
    employeeCount: 31,
  },
  {
    id: 2,
    name: 'Design',
    head: 'Maria Petrosyan',
    headAvatar: 'MP',
    teams: [
      { id: 5, name: 'Product Design', lead: 'Maria Petrosyan', leadAvatar: 'MP', members: 6, colorFrom: '#ec4899', colorTo: '#f472b6' },
      { id: 6, name: 'Brand', lead: 'Nare Arakelyan', leadAvatar: 'NA', members: 3, colorFrom: '#f43f5e', colorTo: '#fb7185' },
    ],
    employeeCount: 9,
  },
  {
    id: 3,
    name: 'Product',
    head: 'Hayk Karapetyan',
    headAvatar: 'HK',
    teams: [
      { id: 7, name: 'Product Management', lead: 'Hayk Karapetyan', leadAvatar: 'HK', members: 5, colorFrom: '#00c3ff', colorTo: '#8b5cf6' },
    ],
    employeeCount: 5,
  },
]

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
          <h1 
            className="text-2xl font-display font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Teams & Structure
          </h1>
          <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Organizational hierarchy and team management
          </p>
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
            <div 
              className="p-3 rounded-xl"
              style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
            >
              <Users className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <p 
                className="text-3xl font-display font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {totalEmployees}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Total Employees</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl"
              style={{ background: 'color-mix(in srgb, var(--color-inorain-purple) 15%, transparent)' }}
            >
              <Users className="w-6 h-6" style={{ color: 'var(--color-inorain-purple)' }} />
            </div>
            <div>
              <p 
                className="text-3xl font-display font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {departments.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Departments</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <Users className="w-6 h-6" style={{ color: '#34d399' }} />
            </div>
            <div>
              <p 
                className="text-3xl font-display font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {totalTeams}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Teams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--color-text-muted)' }}
        />
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
          <div 
            key={dept.id} 
            className="rounded-xl overflow-hidden"
            style={{ 
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Department header */}
            <button
              onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
              className="w-full flex items-center justify-between p-4 transition-colors"
              style={{ 
                background: expandedDept === dept.id 
                  ? 'color-mix(in srgb, var(--color-bg-hover) 50%, transparent)' 
                  : 'transparent'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-inorain-purple))' }}
                >
                  {dept.headAvatar}
                </div>
                <div className="text-left">
                  <h3 
                    className="font-semibold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {dept.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Head: {dept.head} · {dept.employeeCount} employees · {dept.teams.length} teams
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 transition-transform duration-200 ${expandedDept === dept.id ? 'rotate-90' : ''}`}
                style={{ color: 'var(--color-text-muted)' }}
              />
            </button>

            {/* Teams */}
            {expandedDept === dept.id && (
              <div style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-primary)' }}>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dept.teams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                      style={{ 
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-sm"
                            style={{ background: `linear-gradient(135deg, ${team.colorFrom}, ${team.colorTo})` }}
                          >
                            {team.leadAvatar}
                          </div>
                          <div>
                            <h4 
                              className="font-medium"
                              style={{ color: 'var(--color-text-primary)' }}
                            >
                              {team.name}
                            </h4>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                              Lead: {team.lead}
                            </p>
                          </div>
                        </div>
                        <span 
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm"
                          style={{ 
                            background: 'var(--color-bg-hover)',
                            color: 'var(--color-text-secondary)'
                          }}
                        >
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
