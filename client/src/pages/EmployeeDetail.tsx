import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Loader2,
  AlertCircle,
  Briefcase,
  Users,
  Umbrella,
  Star,
  ChevronRight,
  Clock,
  FolderKanban,
  UserCheck,
} from 'lucide-react'
import { employeeService } from '@/services/employees'
import type { 
  Employee, 
  EmployeeSkill, 
  VacationBalance, 
  TeamChainMember, 
  ProjectAssignment 
} from '@/types'

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

const roleLabels = {
  employee: 'You',
  team_lead: 'Team Lead',
  manager: 'Manager',
  department_head: 'Department Head',
}

const roleColors = {
  employee: 'from-blue-500 to-cyan-500',
  team_lead: 'from-purple-500 to-pink-500',
  manager: 'from-orange-500 to-amber-500',
  department_head: 'from-emerald-500 to-teal-500',
}

const projectStatusConfig = {
  planning: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  on_hold: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  completed: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400' },
}

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [skills, setSkills] = useState<EmployeeSkill[]>([])
  const [vacationBalance, setVacationBalance] = useState<VacationBalance | null>(null)
  const [teamChain, setTeamChain] = useState<TeamChainMember[]>([])
  const [currentProjects, setCurrentProjects] = useState<ProjectAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmployeeProfile() {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch the detailed profile (all data in one request)
        const profile = await employeeService.getDetailedProfile(parseInt(id))
        setEmployee(profile.employee)
        setSkills(profile.skills)
        setVacationBalance(profile.vacationBalance)
        setTeamChain(profile.teamChain)
        setCurrentProjects(profile.currentProjects)
      } catch (err) {
        // Fallback to individual requests if profile endpoint fails
        try {
          const employeeData = await employeeService.getById(parseInt(id))
          setEmployee(employeeData)

          // Fetch other data in parallel
          const [skillsData, balanceData, chainData, projectsData] = await Promise.allSettled([
            employeeService.getSkills(parseInt(id)),
            employeeService.getVacationBalance(parseInt(id)),
            employeeService.getTeamChain(parseInt(id)),
            employeeService.getCurrentProjects(parseInt(id)),
          ])

          if (skillsData.status === 'fulfilled') setSkills(skillsData.value)
          if (balanceData.status === 'fulfilled') setVacationBalance(balanceData.value)
          if (chainData.status === 'fulfilled') setTeamChain(chainData.value)
          if (projectsData.status === 'fulfilled') setCurrentProjects(projectsData.value)
        } catch (fallbackErr) {
          setError(fallbackErr instanceof Error ? fallbackErr.message : 'Failed to load employee')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeProfile()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
        <span className="ml-3" style={{ color: 'var(--color-text-secondary)' }}>
          Loading employee profile...
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

      {/* Vacation Balance Card */}
      {vacationBalance && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Umbrella className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Vacation Balance
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Vacation Days */}
            <div 
              className="p-4 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 195, 255, 0.1))' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Vacation Days
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Annual
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {vacationBalance.remainingVacationDays}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  / {vacationBalance.totalVacationDays}
                </span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                {vacationBalance.usedVacationDays} used
                {vacationBalance.pendingVacationDays > 0 && ` · ${vacationBalance.pendingVacationDays} pending`}
              </p>
              {/* Progress bar */}
              <div 
                className="mt-3 h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--color-bg-secondary)' }}
              >
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  style={{ 
                    width: `${(vacationBalance.remainingVacationDays / vacationBalance.totalVacationDays) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Sick Leave Days */}
            <div 
              className="p-4 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.1))' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Sick Leave
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                  Annual
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {vacationBalance.remainingSickLeaveDays}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  / {vacationBalance.annualSickLeaveDays}
                </span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                {vacationBalance.usedSickLeaveDays} used
              </p>
              {/* Progress bar */}
              <div 
                className="mt-3 h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--color-bg-secondary)' }}
              >
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ 
                    width: `${(vacationBalance.remainingSickLeaveDays / vacationBalance.annualSickLeaveDays) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Bonus Days */}
            <div 
              className="p-4 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(249, 115, 22, 0.1))' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Bonus Days
                </p>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {vacationBalance.bonusVacationDays}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  days
                </span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                Extra allocation
              </p>
            </div>

            {/* Pending Requests */}
            <div 
              className="p-4 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.1))' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Pending
                </p>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {vacationBalance.pendingVacationDays}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  days
                </span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                Awaiting approval
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two column layout: Current Projects & Team Chain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Projects */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Current Projects
            </h2>
          </div>
          {currentProjects.length > 0 ? (
            <div className="space-y-3">
              {currentProjects.map((assignment) => {
                const projectStatus = assignment.project?.status || 'active'
                const statusStyle = projectStatusConfig[projectStatus as keyof typeof projectStatusConfig] || projectStatusConfig.active
                
                return (
                  <div 
                    key={assignment.id}
                    className="p-4 rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--color-bg-hover)' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 
                            className="font-medium"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {assignment.project?.name || `Project #${assignment.projectId}`}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                            {projectStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          Role: <span style={{ color: 'var(--color-accent)' }}>{assignment.role}</span>
                        </p>
                        {assignment.project?.description && (
                          <p 
                            className="text-sm mt-2 line-clamp-2"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {assignment.project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>
                        Started: {new Date(assignment.startDate).toLocaleDateString()}
                      </span>
                      {assignment.project?.b2bClient && (
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                          {assignment.project.b2bClient}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div 
              className="text-center py-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No active project assignments</p>
            </div>
          )}
        </div>

        {/* Team Chain */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Team Chain
            </h2>
          </div>
          {teamChain.length > 0 ? (
            <div className="space-y-0">
              {teamChain.map((member, index) => {
                const memberGradient = getGradientColors(member.id)
                const memberInitials = getInitials(member.firstName, member.lastName)
                const isLast = index === teamChain.length - 1
                
                return (
                  <div key={member.id} className="relative">
                    {/* Connector line */}
                    {!isLast && (
                      <div 
                        className="absolute left-6 top-14 w-0.5 h-8"
                        style={{ background: 'var(--color-border)' }}
                      />
                    )}
                    
                    <div 
                      className="flex items-center gap-4 p-3 rounded-xl transition-all hover:scale-[1.01]"
                      style={{ background: index === 0 ? 'var(--color-bg-hover)' : 'transparent' }}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${memberGradient.from}, ${memberGradient.to})` }}
                      >
                        {member.avatarUrl ? (
                          <img 
                            src={member.avatarUrl} 
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          memberInitials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 
                            className="font-medium truncate"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {member.firstName} {member.lastName}
                          </h3>
                          <span 
                            className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${roleColors[member.role]} text-white`}
                          >
                            {roleLabels[member.role]}
                          </span>
                        </div>
                        <p 
                          className="text-sm truncate"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {member.position}
                        </p>
                      </div>
                      {!isLast && (
                        <ChevronRight 
                          className="w-4 h-4 rotate-90 flex-shrink-0" 
                          style={{ color: 'var(--color-text-muted)' }} 
                        />
                      )}
                      {isLast && member.role !== 'employee' && (
                        <UserCheck 
                          className="w-4 h-4 flex-shrink-0" 
                          style={{ color: 'var(--color-accent)' }} 
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div 
              className="text-center py-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No team hierarchy information</p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Skills & Employee Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Technical Skills */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Technical Skills
            </h2>
          </div>
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((employeeSkill) => (
                <div 
                  key={employeeSkill.id} 
                  className="p-4 rounded-xl"
                  style={{ background: 'var(--color-bg-hover)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {employeeSkill.skill?.name || `Skill ${employeeSkill.skillId}`}
                      </span>
                      {employeeSkill.skill?.category && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            background: 'var(--color-bg-secondary)', 
                            color: 'var(--color-text-muted)' 
                          }}
                        >
                          {employeeSkill.skill.category}
                        </span>
                      )}
                    </div>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {levelLabels[employeeSkill.level]}
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-bg-secondary)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(employeeSkill.level / 5) * 100}%`,
                        background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`
                      }}
                    />
                  </div>
                  <p 
                    className="text-xs mt-2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {employeeSkill.yearsOfExperience} years of experience
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
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
            {employee.team && (
              <div 
                className="p-3 rounded-lg"
                style={{ background: 'var(--color-bg-hover)' }}
              >
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Team
                </p>
                <p 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {employee.team.name}
                </p>
              </div>
            )}
            {employee.department && (
              <div 
                className="p-3 rounded-lg"
                style={{ background: 'var(--color-bg-hover)' }}
              >
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Department
                </p>
                <p 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {employee.department.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
