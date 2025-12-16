import { useState } from 'react'
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react'

const vacationRequests = [
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
  },
]

const statusConfig = {
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock },
  approved: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2 },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
}

const typeColors = {
  Vacation: 'bg-indigo-500/20 text-indigo-400',
  'Sick Leave': 'bg-rose-500/20 text-rose-400',
  'Day Off': 'bg-cyan-500/20 text-cyan-400',
}

export function Vacations() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredRequests = vacationRequests.filter(
    (req) => filter === 'all' || req.status === filter
  )

  const stats = {
    pending: vacationRequests.filter((r) => r.status === 'pending').length,
    approved: vacationRequests.filter((r) => r.status === 'approved').length,
    rejected: vacationRequests.filter((r) => r.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-white">Vacations & Time Off</h1>
          <p className="text-zinc-500 mt-1">Manage vacation requests and time-off approvals</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Request Time Off
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('pending')}
          className={`card cursor-pointer transition-all duration-200 ${
            filter === 'pending' ? 'border-amber-500/50 bg-amber-500/5' : 'hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-3xl font-display font-semibold text-white">{stats.pending}</p>
              <p className="text-sm text-zinc-500">Pending Requests</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilter('approved')}
          className={`card cursor-pointer transition-all duration-200 ${
            filter === 'approved' ? 'border-emerald-500/50 bg-emerald-500/5' : 'hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-display font-semibold text-white">{stats.approved}</p>
              <p className="text-sm text-zinc-500">Approved</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilter('rejected')}
          className={`card cursor-pointer transition-all duration-200 ${
            filter === 'rejected' ? 'border-red-500/50 bg-red-500/5' : 'hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/20">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-3xl font-display font-semibold text-white">{stats.rejected}</p>
              <p className="text-sm text-zinc-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn-secondary">
          <Calendar className="w-4 h-4" />
          Calendar View
        </button>
      </div>

      {/* Requests table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">
                Employee
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">
                Type
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">
                Dates
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">
                Days
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">
                Status
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredRequests.map((request) => {
              const StatusIcon = statusConfig[request.status as keyof typeof statusConfig].icon
              return (
                <tr key={request.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                        {request.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{request.employee}</p>
                        <p className="text-sm text-zinc-500">{request.reason}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                        typeColors[request.type as keyof typeof typeColors]
                      }`}
                    >
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {new Date(request.startDate).toLocaleDateString()} -{' '}
                    {new Date(request.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{request.days}</span>
                    <span className="text-zinc-500"> days</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${
                        statusConfig[request.status as keyof typeof statusConfig].bg
                      } ${statusConfig[request.status as keyof typeof statusConfig].text}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {request.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

