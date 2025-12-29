import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'User Management',
  '/activity': 'Activity Log',
  '/settings': 'Settings',
}

export function Header() {
  const location = useLocation()
  const { user } = useAuthStore()

  const title = pageTitles[location.pathname] || 'Admin Panel'

  return (
    <header className="h-16 bg-[#16161c]/80 backdrop-blur-lg border-b border-zinc-800/60 flex items-center justify-between px-6">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-display font-semibold text-white">{title}</h1>
        <p className="text-xs text-zinc-500">Manage your Telescope platform</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-semibold text-sm">
            {user.firstName[0]}{user.lastName[0]}
          </div>
        )}
      </div>
    </header>
  )
}


