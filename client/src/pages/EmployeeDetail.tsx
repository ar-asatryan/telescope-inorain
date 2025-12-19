import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Globe2,
  Edit2,
  Clock,
} from 'lucide-react'

// Mock employee data
const employeeData = {
  id: 1,
  firstName: 'Anna',
  lastName: 'Hovhannisyan',
  email: 'anna.h@inorain.com',
  phone: '+374 99 123456',
  position: 'Senior Frontend Developer',
  department: 'Engineering',
  team: 'Platform',
  englishLevel: 'C1',
  status: 'active',
  hireDate: '2022-03-15',
  avatar: 'AH',
  manager: 'Armen Vardanyan',
  skills: [
    { name: 'React', level: 5, years: 4 },
    { name: 'TypeScript', level: 4, years: 3 },
    { name: 'Node.js', level: 3, years: 2 },
    { name: 'GraphQL', level: 3, years: 2 },
    { name: 'TailwindCSS', level: 5, years: 3 },
  ],
  projects: [
    { id: 1, name: 'Platform Redesign', role: 'Lead Developer', status: 'active' },
    { id: 2, name: 'Mobile App', role: 'Contributor', status: 'active' },
  ],
  vacationBalance: {
    total: 20,
    used: 8,
    remaining: 12,
  },
}

const levelLabels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']

export function EmployeeDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/employees"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </Link>

      {/* Profile header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
              {employeeData.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-display font-semibold text-white">
                {employeeData.firstName} {employeeData.lastName}
              </h1>
              <p className="text-zinc-500 mt-1">{employeeData.position}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg">
                  Active
                </span>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg">
                  English: {employeeData.englishLevel}
                </span>
              </div>
            </div>
          </div>
          <button className="btn-secondary">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Mail className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-600">Email</p>
              <p className="text-sm text-white">{employeeData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Phone className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-600">Phone</p>
              <p className="text-sm text-white">{employeeData.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Building2 className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-600">Department</p>
              <p className="text-sm text-white">{employeeData.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Calendar className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-600">Hire Date</p>
              <p className="text-sm text-white">{new Date(employeeData.hireDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-white mb-4">Technical Skills</h2>
          <div className="space-y-4">
            {employeeData.skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{skill.name}</span>
                  <span className="text-xs text-zinc-500">
                    {levelLabels[skill.level]} · {skill.years} years
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vacation balance */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Vacation Balance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="12"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(employeeData.vacationBalance.remaining / employeeData.vacationBalance.total) * 352} 352`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{employeeData.vacationBalance.remaining}</span>
                  <span className="text-xs text-zinc-500">days left</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-semibold text-white">{employeeData.vacationBalance.total}</p>
                <p className="text-xs text-zinc-500">Total</p>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-semibold text-amber-400">{employeeData.vacationBalance.used}</p>
                <p className="text-xs text-zinc-500">Used</p>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-semibold text-emerald-400">{employeeData.vacationBalance.remaining}</p>
                <p className="text-xs text-zinc-500">Left</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Current Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employeeData.projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">{project.name}</h3>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-2">Role: {project.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


