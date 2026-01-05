import { useState } from 'react'
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react'
import { RequestTimeOffModal } from '../components/vacations/RequestTimeOffModal'
import { CalendarView } from '../components/vacations/CalendarView'
import type { VacationType } from '../types'

// Mock data - in a real app this would come from the API
const initialVacationRequests = [
  {
    id: 1,
    employee: 'Anna Hovhannisyan',
    avatar: 'AH',
    type: 'Vacation',
    startDate: '2024-12-20',
    endDate: '2024-12-31',
    days: 8,
    status: 'pending',
    reason: 'Family holiday trip',
    gradientFrom: '#00c3ff',
    gradientTo: '#4f8fff',
  },
  {
    id: 2,
    employee: 'Tigran Sargsyan',
    avatar: 'TS',
    type: 'Sick Leave',
    startDate: '2024-12-10',
    endDate: '2024-12-12',
    days: 3,
    status: 'approved',
    reason: 'Medical appointment',
    gradientFrom: '#8b5cf6',
    gradientTo: '#a855f7',
  },
  {
    id: 3,
    employee: 'Maria Petrosyan',
    avatar: 'MP',
    type: 'Day Off',
    startDate: '2024-12-15',
    endDate: '2024-12-15',
    days: 1,
    status: 'approved',
    reason: 'Personal matters',
    gradientFrom: '#ec4899',
    gradientTo: '#f43f5e',
  },
  {
    id: 4,
    employee: 'David Grigoryan',
    avatar: 'DG',
    type: 'Vacation',
    startDate: '2024-12-23',
    endDate: '2024-12-27',
    days: 5,
    status: 'pending',
    reason: 'New Year preparations',
    gradientFrom: '#10b981',
    gradientTo: '#00c3ff',
  },
  {
    id: 5,
    employee: 'Lusine Hakobyan',
    avatar: 'LH',
    type: 'Vacation',
    startDate: '2024-11-20',
    endDate: '2024-11-25',
    days: 6,
    status: 'rejected',
    reason: 'Travel plans',
    gradientFrom: '#f59e0b',
    gradientTo: '#f97316',
  },
]

const statusConfig = {
  pending: { 
    bg: 'rgba(245, 158, 11, 0.1)',
    color: '#fbbf24',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    icon: Clock,
    label: 'Pending'
  },
  approved: { 
    bg: 'rgba(16, 185, 129, 0.1)',
    color: '#34d399',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    icon: CheckCircle2,
    label: 'Approved'
  },
  rejected: { 
    bg: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    icon: XCircle,
    label: 'Rejected'
  },
}

const typeConfig = {
  Vacation: { bg: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', color: 'var(--color-accent)' },
  'Sick Leave': { bg: 'rgba(244, 63, 94, 0.1)', color: '#fb7185' },
  'Day Off': { bg: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee' },
  Remote: { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' },
}

// Map VacationType to display names
const typeDisplayNames: Record<VacationType, string> = {
  vacation: 'Vacation',
  sick_leave: 'Sick Leave',
  day_off: 'Day Off',
  remote: 'Remote',
}

// Gradient colors for new requests
const gradientColors = [
  { from: '#00c3ff', to: '#4f8fff' },
  { from: '#8b5cf6', to: '#a855f7' },
  { from: '#ec4899', to: '#f43f5e' },
  { from: '#10b981', to: '#00c3ff' },
  { from: '#f59e0b', to: '#f97316' },
]

export function Vacations() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [vacationRequests, setVacationRequests] = useState(initialVacationRequests)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showCalendarView, setShowCalendarView] = useState(false)

  const filteredRequests = vacationRequests.filter(
    (req) => filter === 'all' || req.status === filter
  )

  const stats = {
    pending: vacationRequests.filter((r) => r.status === 'pending').length,
    approved: vacationRequests.filter((r) => r.status === 'approved').length,
    rejected: vacationRequests.filter((r) => r.status === 'rejected').length,
  }

  const handleRequestTimeOff = async (data: {
    type: VacationType
    startDate: string
    endDate: string
    reason: string
  }) => {
    // Calculate days
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // Get random gradient
    const gradient = gradientColors[Math.floor(Math.random() * gradientColors.length)]

    // Create new vacation request
    const newRequest = {
      id: Date.now(),
      employee: 'Current User', // In real app, get from auth context
      avatar: 'CU',
      type: typeDisplayNames[data.type],
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      status: 'pending',
      reason: data.reason || 'No reason provided',
      gradientFrom: gradient.from,
      gradientTo: gradient.to,
    }

    // Add to list
    setVacationRequests([newRequest, ...vacationRequests])

    // In a real app, you would call the API:
    // await vacationsService.create({
    //   employeeId: currentUser.employeeId,
    //   type: data.type,
    //   startDate: data.startDate,
    //   endDate: data.endDate,
    //   reason: data.reason,
    // })
  }

  const handleApprove = (id: number) => {
    setVacationRequests(
      vacationRequests.map((r) =>
        r.id === id ? { ...r, status: 'approved' } : r
      )
    )
  }

  const handleReject = (id: number) => {
    setVacationRequests(
      vacationRequests.map((r) =>
        r.id === id ? { ...r, status: 'rejected' } : r
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Request Time Off Modal */}
      <RequestTimeOffModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        onSubmit={handleRequestTimeOff}
      />

      {/* Calendar View Modal */}
      <CalendarView
        open={showCalendarView}
        onClose={() => setShowCalendarView(false)}
        vacations={vacationRequests}
      />

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-display font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Vacations & Time Off
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            Manage vacation requests and time-off approvals
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowRequestModal(true)}
        >
          <Plus className="w-4 h-4" />
          Request Time Off
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button
          onClick={() => setFilter('pending')}
          className="card group cursor-pointer text-left transition-all duration-300"
          style={{
            borderColor: filter === 'pending' ? 'rgba(245, 158, 11, 0.5)' : undefined,
            background: filter === 'pending' ? 'rgba(245, 158, 11, 0.05)' : undefined
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="p-3.5 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{ background: 'rgba(245, 158, 11, 0.1)' }}
            >
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p 
                className="text-4xl font-display font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {stats.pending}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Pending Requests
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('approved')}
          className="card group cursor-pointer text-left transition-all duration-300"
          style={{
            borderColor: filter === 'approved' ? 'rgba(16, 185, 129, 0.5)' : undefined,
            background: filter === 'approved' ? 'rgba(16, 185, 129, 0.05)' : undefined
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="p-3.5 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p 
                className="text-4xl font-display font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {stats.approved}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Approved
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className="card group cursor-pointer text-left transition-all duration-300"
          style={{
            borderColor: filter === 'rejected' ? 'rgba(239, 68, 68, 0.5)' : undefined,
            background: filter === 'rejected' ? 'rgba(239, 68, 68, 0.05)' : undefined
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="p-3.5 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{ background: 'rgba(239, 68, 68, 0.1)' }}
            >
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p 
                className="text-4xl font-display font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {stats.rejected}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Rejected
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300"
              style={{
                background: filter === status 
                  ? 'linear-gradient(90deg, var(--color-accent), var(--color-inorain-blue))'
                  : 'var(--color-bg-hover)',
                color: filter === status ? 'white' : 'var(--color-text-secondary)',
                boxShadow: filter === status ? '0 4px 15px color-mix(in srgb, var(--color-accent) 25%, transparent)' : 'none'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button 
          className="btn-secondary"
          onClick={() => setShowCalendarView(true)}
        >
          <CalendarDays className="w-4 h-4" />
          Calendar View
        </button>
      </div>

      {/* Requests table */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{ 
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)'
        }}
      >
        <table className="w-full">
          <thead style={{ background: 'var(--color-bg-primary)' }}>
            <tr>
              <th 
                className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Employee
              </th>
              <th 
                className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Type
              </th>
              <th 
                className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Dates
              </th>
              <th 
                className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Days
              </th>
              <th 
                className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Status
              </th>
              <th 
                className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => {
              const status = statusConfig[request.status as keyof typeof statusConfig]
              const type = typeConfig[request.type as keyof typeof typeConfig] || typeConfig.Vacation
              const StatusIcon = status.icon
              
              return (
                <tr 
                  key={request.id} 
                  className="group transition-colors"
                  style={{ 
                    borderTop: index > 0 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-105 transition-transform"
                        style={{ background: `linear-gradient(135deg, ${request.gradientFrom}, ${request.gradientTo})` }}
                      >
                        {request.avatar}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          {request.employee}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {request.reason}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg"
                      style={{ 
                        background: type.bg,
                        color: type.color,
                        border: `1px solid color-mix(in srgb, ${type.color} 30%, transparent)`
                      }}
                    >
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                      {new Date(request.startDate).toLocaleDateString()} -{' '}
                      {new Date(request.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{request.days}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}> days</span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg"
                      style={{ 
                        background: status.bg,
                        color: status.color,
                        border: `1px solid ${status.borderColor}`
                      }}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {request.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-300"
                          onClick={() => handleApprove(request.id)}
                          title="Approve"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                          onClick={() => handleReject(request.id)}
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <button 
                        className="p-2 rounded-lg transition-all duration-300"
                        style={{ color: 'var(--color-text-muted)' }}
                        title="View details"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <div 
            className="py-12 text-center"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No vacation requests found for the selected filter.
          </div>
        )}
      </div>
    </div>
  )
}
