import { useState, useEffect } from 'react'
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
  Loader2,
  AlertCircle,
  MapPin,
  Briefcase,
} from 'lucide-react'
import { employeeService } from '@/services/employees'
import type { Employee, EmployeeSkill } from '@/types'

const levelLabels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']

// Generate gradient colors based on employee id
const getGradientColors = (id: number) => {
  const gradients = [
    { from: '#00c3ff', to: '#4f8fff' },
    { from: '#8b5cf6', to: '#a855f7' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#10b981', to: '#00c3ff' },
    { from: '#f59e0b', to: '#f97316' },
    { from: '#00c3ff', to: '#8b5cf6' },
  ]
  return gradients[id % gradients.length]
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const statusConfig = {
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Active' },
  vacation: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'On Vacation' },
  inactive: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'Inactive' },
}

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [skills, setSkills] = useState<EmployeeSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmployee() {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const employeeData = await employeeService.getById(parseInt(id))
        setEmployee(employeeData)

        // Try to fetch skills (may fail if not implemented)
        try {
          const skillsData = await employeeService.getSkills(parseInt(id))
          setSkills(skillsData)
        } catch {
          // Skills endpoint might not be available
          setSkills([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
        <span className="ml-3" style={{ color: 'var(--color-text-secondary)' }}>
          Loading employee...
        </span>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="space-y-6">
        <Link
          to="/employees"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Failed to load employee
          </h2>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            {error || 'Employee not found'}
          </p>
        </div>
      </div>
    )
  }

  const status = statusConfig[employee.status as keyof typeof statusConfig] || statusConfig.active
  const gradient = getGradientColors(employee.id)
  const initials = getInitials(employee.firstName, employee.lastName)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/employees"
        className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </Link>

      {/* Profile header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
            >
              {employee.avatarUrl ? (
                <img 
                  src={employee.avatarUrl} 
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 
                className="text-2xl font-display font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {employee.firstName} {employee.lastName}
              </h1>
              <p style={{ color: 'var(--color-text-muted)' }} className="mt-1">
                {employee.position}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className={`px-3 py-1 ${status.bg} ${status.text} text-sm font-medium rounded-lg`}>
                  {status.label}
                </span>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg">
                  English: {employee.englishLevel}
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
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <Mail className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Email</p>
              <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <Phone className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Phone</p>
              <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {employee.phone || 'Not provided'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <Briefcase className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Position</p>
              <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{employee.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Hire Date</p>
              <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {new Date(employee.hireDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills */}
        <div className="lg:col-span-2 card">
          <h2 
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Technical Skills
          </h2>
          {skills.length > 0 ? (
            <div className="space-y-4">
              {skills.map((employeeSkill) => (
                <div key={employeeSkill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {employeeSkill.skill?.name || `Skill ${employeeSkill.skillId}`}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {levelLabels[employeeSkill.level]} · {employeeSkill.yearsOfExperience} years
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-bg-hover)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(employeeSkill.level / 5) * 100}%`,
                        background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <p>No skills recorded yet</p>
            </div>
          )}
        </div>

        {/* Employee Info */}
        <div className="card">
          <h2 
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Employee Info
          </h2>
          <div className="space-y-4">
            <div 
              className="p-3 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Employee ID
              </p>
              <p 
                className="text-xl font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                #{employee.id}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                English Level
              </p>
              <p 
                className="text-xl font-semibold"
                style={{ color: 'var(--color-accent)' }}
              >
                {employee.englishLevel}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Status
              </p>
              <p 
                className={`text-xl font-semibold ${status.text}`}
              >
                {status.label}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ background: 'var(--color-bg-hover)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Joined
              </p>
              <p 
                className="text-xl font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {new Date(employee.hireDate).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
