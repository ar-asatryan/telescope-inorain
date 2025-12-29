import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
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
  },
]

const statusColors = {
  active: 'bg-emerald-500/20 text-emerald-400',
  vacation: 'bg-amber-500/20 text-amber-400',
  inactive: 'bg-zinc-500/20 text-zinc-400',
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
          <h1 className="text-2xl font-display font-semibold text-white">Employees</h1>
          <p className="text-zinc-500 mt-1">Manage your team members and their information</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filters
        </button>
        <div className="flex rounded-lg border border-zinc-700 overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 text-sm ${
              view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
            } transition-colors`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 text-sm ${
              view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
            } transition-colors`}
          >
            List
          </button>
        </div>
      </div>

      {/* Employee grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filteredEmployees.map((employee) => (
          <Link
            key={employee.id}
            to={`/employees/${employee.id}`}
            className="card group hover:border-zinc-700 hover:bg-zinc-800/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {employee.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-zinc-500">{employee.position}</p>
                </div>
              </div>
              <button className="p-1 text-zinc-600 hover:text-white rounded transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="w-4 h-4" />
                {employee.email}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Building2 className="w-4 h-4" />
                {employee.department} · {employee.team}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1">
                {employee.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  statusColors[employee.status as keyof typeof statusColors]
                }`}
              >
                {employee.status}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white">
            1
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}



