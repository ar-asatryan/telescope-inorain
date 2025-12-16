import {
  Users,
  CalendarCheck,
  FolderKanban,
  TrendingUp,
  Clock,
  UserPlus,
} from 'lucide-react'

const stats = [
  { name: 'Total Employees', value: '156', change: '+12%', icon: Users, color: 'indigo' },
  { name: 'On Vacation', value: '8', change: '5.1%', icon: CalendarCheck, color: 'emerald' },
  { name: 'Active Projects', value: '23', change: '+3', icon: FolderKanban, color: 'purple' },
  { name: 'Avg. Tenure', value: '2.4y', change: '+0.3y', icon: TrendingUp, color: 'amber' },
]

const recentActivity = [
  { id: 1, type: 'vacation', user: 'Anna Hovhannisyan', action: 'requested vacation', time: '2 hours ago' },
  { id: 2, type: 'new', user: 'Tigran Sargsyan', action: 'joined the team', time: '5 hours ago' },
  { id: 3, type: 'project', user: 'Maria Petrosyan', action: 'assigned to Project Atlas', time: '1 day ago' },
  { id: 4, type: 'skill', user: 'David Grigoryan', action: 'updated skills', time: '2 days ago' },
]

const upcomingVacations = [
  { id: 1, name: 'Armen Vardanyan', dates: 'Dec 20 - Dec 31', days: 8, avatar: 'AV' },
  { id: 2, name: 'Lusine Hakobyan', dates: 'Dec 23 - Dec 27', days: 5, avatar: 'LH' },
  { id: 3, name: 'Gor Manukyan', dates: 'Jan 2 - Jan 10', days: 7, avatar: 'GM' },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-white">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Welcome back! Here's what's happening at inoRain.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="card group hover:border-zinc-700 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">{stat.name}</p>
                <p className="text-3xl font-display font-semibold text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-emerald-400 mt-2">{stat.change}</p>
              </div>
              <div
                className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-500" />
              Recent Activity
            </h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-zinc-400">{activity.action}</span>
                  </p>
                  <p className="text-xs text-zinc-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Vacations */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-zinc-500" />
              Upcoming Vacations
            </h2>
          </div>
          <div className="space-y-3">
            {upcomingVacations.map((vacation) => (
              <div
                key={vacation.id}
                className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-medium text-xs">
                    {vacation.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{vacation.name}</p>
                    <p className="text-xs text-zinc-500">{vacation.dates}</p>
                  </div>
                  <span className="ml-auto px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded">
                    {vacation.days} days
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 border border-dashed border-zinc-700 rounded-lg text-sm text-zinc-500 hover:text-white hover:border-zinc-600 transition-all duration-200 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Vacation
          </button>
        </div>
      </div>
    </div>
  )
}

