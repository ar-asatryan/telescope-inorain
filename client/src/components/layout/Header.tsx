import { Search, Bell, ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="h-16 bg-[#12121a]/80 backdrop-blur-lg border-b border-zinc-800/50 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search employees, projects..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-500">
          ⌘K
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* User menu */}
        <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-zinc-800/50 rounded-lg transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AR</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-zinc-500">admin@inorain.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
    </header>
  )
}
