import { useState } from 'react'
import { Plus, Search, Filter, Users, TrendingUp } from 'lucide-react'

const skillCategories = [
  {
    name: 'Frontend',
    color: 'indigo',
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
    color: 'emerald',
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
    color: 'purple',
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
    color: 'pink',
    skills: [
      { name: 'Figma', count: 20, trend: '+5' },
      { name: 'Adobe XD', count: 12, trend: '0' },
      { name: 'UI/UX', count: 18, trend: '+3' },
      { name: 'Prototyping', count: 15, trend: '+2' },
    ],
  },
]

const colorMap: Record<string, string> = {
  indigo: 'from-indigo-500 to-indigo-600',
  emerald: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
}

const bgColorMap: Record<string, string> = {
  indigo: 'bg-indigo-500/20 text-indigo-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  purple: 'bg-purple-500/20 text-purple-400',
  pink: 'bg-pink-500/20 text-pink-400',
}

export function Skills() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-white">Skills Matrix</h1>
          <p className="text-zinc-500 mt-1">Track and manage team technical competencies</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Skill categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <div key={category.name} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-br ${colorMap[category.color]}`}
                />
                <h2 className="text-lg font-semibold text-white">{category.name}</h2>
              </div>
              <span className="text-sm text-zinc-500">
                {category.skills.length} skills
              </span>
            </div>

            <div className="space-y-3">
              {category.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg ${bgColorMap[category.color]}`}
                    >
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <span className="text-white font-medium">{skill.count}</span>
                      <span className="text-zinc-500">people</span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        skill.trend.startsWith('+')
                          ? 'text-emerald-400'
                          : skill.trend === '0'
                          ? 'text-zinc-500'
                          : 'text-red-400'
                      }`}
                    >
                      {skill.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 border border-dashed border-zinc-700 rounded-lg text-sm text-zinc-500 hover:text-white hover:border-zinc-600 transition-all duration-200">
              + Add skill to {category.name}
            </button>
          </div>
        ))}
      </div>

      {/* Skill gap analysis card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Skill Gap Analysis</h2>
          </div>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            View detailed report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <h3 className="text-sm font-medium text-emerald-400 mb-2">Strong Areas</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Docker', 'Node.js'].map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-sm font-medium text-amber-400 mb-2">Growing Areas</h3>
            <div className="flex flex-wrap gap-2">
              {['Kubernetes', 'Go', 'TailwindCSS'].map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <h3 className="text-sm font-medium text-red-400 mb-2">Needs Attention</h3>
            <div className="flex flex-wrap gap-2">
              {['Angular', 'Java', 'Azure'].map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

