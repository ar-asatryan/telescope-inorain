import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Building2,
  ArrowUpRight,
  Grid3X3,
  List,
} from 'lucide-react'

// Mock data
const employees = [
  {
    id: 1,
    name: 'Anna Hovhannisyan',
    email: 'anna.h@inorain.com',
    phone: '+374 99 123456',
    position: 'Senior Frontend Developer',
    department: 'Engineering',
    team: 'Platform',
    englishLevel: 'C1',
    status: 'active',
    avatar: 'AH',
    skills: ['React', 'TypeScript', 'Node.js'],
    gradientFrom: '#00c3ff',
    gradientTo: '#4f8fff',
  },
  {
    id: 2,
    name: 'Tigran Sargsyan',
    email: 'tigran.s@inorain.com',
    phone: '+374 91 234567',
    position: 'Backend Developer',
    department: 'Engineering',
    team: 'API',
    englishLevel: 'B2',
    status: 'active',
    avatar: 'TS',
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
    gradientFrom: '#8b5cf6',
    gradientTo: '#a855f7',
  },
  {
    id: 3,
    name: 'Maria Petrosyan',
    email: 'maria.p@inorain.com',
    phone: '+374 93 345678',
    position: 'UI/UX Designer',
    department: 'Design',
    team: 'Product',
    englishLevel: 'B2',
    status: 'vacation',
    avatar: 'MP',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    gradientFrom: '#ec4899',
    gradientTo: '#f43f5e',
  },
  {
    id: 4,
    name: 'David Grigoryan',
    email: 'david.g@inorain.com',
    phone: '+374 94 456789',
    position: 'DevOps Engineer',
    department: 'Engineering',
    team: 'Infrastructure',
    englishLevel: 'C1',
    status: 'active',
    avatar: 'DG',
    skills: ['AWS', 'Kubernetes', 'Terraform'],
    gradientFrom: '#10b981',
    gradientTo: '#00c3ff',
  },
  {
    id: 5,
    name: 'Lusine Hakobyan',
    email: 'lusine.h@inorain.com',
    phone: '+374 95 567890',
    position: 'QA Engineer',
    department: 'Engineering',
    team: 'Quality',
    englishLevel: 'B1',
    status: 'active',
    avatar: 'LH',
    skills: ['Selenium', 'Cypress', 'Jest'],
    gradientFrom: '#f59e0b',
    gradientTo: '#f97316',
  },
  {
    id: 6,
    name: 'Armen Vardanyan',
    email: 'armen.v@inorain.com',
    phone: '+374 96 678901',
    position: 'Tech Lead',
    department: 'Engineering',
    team: 'Platform',
    englishLevel: 'C2',
    status: 'active',
    avatar: 'AV',
    skills: ['React', 'Go', 'System Design'],
    gradientFrom: '#00c3ff',
    gradientTo: '#8b5cf6',
  },
]

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

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filters
        </button>
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

      {/* Employee grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {filteredEmployees.map((employee) => {
          const status = statusConfig[employee.status as keyof typeof statusConfig]
          return (
            <Link
              key={employee.id}
              to={`/employees/${employee.id}`}
              className="card group transition-all duration-300 relative overflow-hidden hover:scale-[1.02]"
            >
              {/* Top gradient line on hover */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${employee.gradientFrom}, ${employee.gradientTo})` }}
              />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg group-hover:scale-105 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${employee.gradientFrom}, ${employee.gradientTo})` }}
                  >
                    {employee.avatar}
                  </div>
                  <div>
                    <h3 
                      className="font-semibold transition-colors"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {employee.name}
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
                  {employee.department} · {employee.team}
                </div>
              </div>

              <div 
                className="mt-4 pt-4 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <div className="flex gap-1.5">
                  {employee.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors"
                      style={{ 
                        background: 'var(--color-bg-hover)',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
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

      {/* Pagination */}
      <div 
        className="flex items-center justify-between text-sm pt-4"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span>
          Showing{' '}
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
            {filteredEmployees.length}
          </span>{' '}
          of{' '}
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
            {employees.length}
          </span>{' '}
          employees
        </span>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded-lg transition-all duration-300"
            style={{ 
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)'
            }}
          >
            Previous
          </button>
          <button 
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-inorain-blue))' }}
          >
            1
          </button>
          <button 
            className="px-4 py-2 rounded-lg transition-all duration-300"
            style={{ 
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)'
            }}
          >
            2
          </button>
          <button 
            className="px-4 py-2 rounded-lg transition-all duration-300"
            style={{ 
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
