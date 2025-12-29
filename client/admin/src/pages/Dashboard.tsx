import { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react'
import { usersService } from '../services/users'

interface Stats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  recentUsers: number
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    recentUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await usersService.getUsers({ limit: 100 })
        if (response.success) {
          const users = response.data.users
          setStats({
            totalUsers: response.data.total,
            activeUsers: users.filter((u) => u.isActive).length,
            inactiveUsers: users.filter((u) => !u.isActive).length,
            recentUsers: users.filter((u) => {
              const created = new Date(u.createdAt || '')
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return created > weekAgo
            }).length,
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-red-600 to-red-700',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
    },
    {
      name: 'Inactive Users',
      value: stats.inactiveUsers,
      icon: UserX,
      color: 'from-zinc-500 to-zinc-600',
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-400',
    },
    {
      name: 'New This Week',
      value: stats.recentUsers,
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="card bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-semibold text-white">
              Welcome to Admin Dashboard
            </h2>
            <p className="text-zinc-400 mt-1">
              Manage users, monitor activity, and configure system settings.
            </p>
          </div>
          <div className="hidden sm:block p-4 rounded-xl bg-red-600/10">
            <TrendingUp className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.name}
            className="card group hover:border-zinc-700/80 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">{stat.name}</p>
                <p className="text-3xl font-display font-bold text-white mt-2">
                  {isLoading ? '—' : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions & Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-zinc-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/users"
              className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-200 group"
            >
              <Users className="w-6 h-6 text-zinc-400 group-hover:text-red-400 mb-2 transition-colors" />
              <p className="text-sm font-medium text-white">Manage Users</p>
              <p className="text-xs text-zinc-500 mt-1">View and edit users</p>
            </a>
            <a
              href="/users"
              className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-200 group"
            >
              <UserPlus className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 mb-2 transition-colors" />
              <p className="text-sm font-medium text-white">Add New User</p>
              <p className="text-xs text-zinc-500 mt-1">Create user account</p>
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-500" />
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-zinc-300">API Server</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-zinc-300">Database</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-zinc-300">Authentication</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


