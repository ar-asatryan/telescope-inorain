import { useState } from 'react'
import { Plus, Search, Filter, Users, TrendingUp, Zap, Code2, Palette, Server, Cloud } from 'lucide-react'

const skillCategories = [
  {
    name: 'Frontend',
    icon: Code2,
    colorFrom: '#00c3ff',
    colorTo: '#4f8fff',
    skills: [
      { name: 'React', count: 45, trend: '+5' },
      { name: 'TypeScript', count: 38, trend: '+8' },
      { name: 'Vue.js', count: 12, trend: '+2' },
      { name: 'Angular', count: 8, trend: '0' },
      { name: 'TailwindCSS', count: 32, trend: '+10' },
    ],
  },
  {
    name: 'Backend',
    icon: Server,
    colorFrom: '#10b981',
    colorTo: '#34d399',
    skills: [
      { name: 'Node.js', count: 40, trend: '+3' },
      { name: 'Python', count: 25, trend: '+4' },
      { name: 'Go', count: 15, trend: '+6' },
      { name: 'Java', count: 18, trend: '-2' },
      { name: 'PostgreSQL', count: 35, trend: '+2' },
    ],
  },
  {
    name: 'DevOps',
    icon: Cloud,
    colorFrom: '#8b5cf6',
    colorTo: '#a855f7',
    skills: [
      { name: 'Docker', count: 48, trend: '+5' },
      { name: 'Kubernetes', count: 22, trend: '+8' },
      { name: 'AWS', count: 30, trend: '+4' },
      { name: 'Terraform', count: 15, trend: '+6' },
      { name: 'CI/CD', count: 42, trend: '+3' },
    ],
  },
  {
    name: 'Design',
    icon: Palette,
    colorFrom: '#ec4899',
    colorTo: '#f43f5e',
    skills: [
      { name: 'Figma', count: 20, trend: '+5' },
      { name: 'Adobe XD', count: 12, trend: '0' },
      { name: 'UI/UX', count: 18, trend: '+3' },
      { name: 'Prototyping', count: 15, trend: '+2' },
    ],
  },
]

export function Skills() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-display font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Skills Matrix
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            Track and manage team technical competencies
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Skill
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
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Skill categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <div key={category.name} className="card">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2.5 rounded-xl"
                    style={{ background: `color-mix(in srgb, ${category.colorFrom} 15%, transparent)` }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: category.colorFrom }} />
                  </div>
                  <h2 
                    className="text-lg font-display font-semibold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {category.name}
                  </h2>
                </div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {category.skills.length} skills
                </span>
              </div>

              <div className="space-y-3">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 cursor-pointer group"
                    style={{ 
                      background: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg"
                        style={{ 
                          background: `color-mix(in srgb, ${category.colorFrom} 15%, transparent)`,
                          color: category.colorFrom
                        }}
                      >
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                        <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          {skill.count}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)' }}>people</span>
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{ 
                          color: skill.trend.startsWith('+') 
                            ? '#34d399' 
                            : skill.trend === '0' 
                              ? 'var(--color-text-muted)' 
                              : '#f87171'
                        }}
                      >
                        {skill.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="w-full mt-4 py-3 border border-dashed rounded-xl text-sm transition-all duration-300"
                style={{ 
                  borderColor: 'var(--color-border-light)',
                  color: 'var(--color-text-muted)'
                }}
              >
                + Add skill to {category.name}
              </button>
            </div>
          )
        })}
      </div>

      {/* Skill gap analysis card */}
      <div className="card relative overflow-hidden">
        {/* Decorative gradient */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--color-accent)' }}
        />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl"
                style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 
                className="text-lg font-display font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Skill Gap Analysis
              </h2>
            </div>
            <button 
              className="text-sm font-medium flex items-center gap-1 transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              View detailed report
              <Zap className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="p-5 rounded-xl"
              style={{ 
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Strong Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Docker', 'Node.js'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg"
                    style={{ 
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#6ee7b7',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div 
              className="p-5 rounded-xl"
              style={{ 
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}
            >
              <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Growing Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Kubernetes', 'Go', 'TailwindCSS'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg"
                    style={{ 
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#fcd34d',
                      border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div 
              className="p-5 rounded-xl"
              style={{ 
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Needs Attention
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Angular', 'Java', 'Azure'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg"
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#fca5a5',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
