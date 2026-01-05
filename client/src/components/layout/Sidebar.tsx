import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Sparkles,
  Users2,
  FolderKanban,
  Settings,
  LogOut,
  Telescope,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '../../store/themeStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Vacations', href: '/vacations', icon: CalendarDays },
  { name: 'Skills', href: '/skills', icon: Sparkles },
  { name: 'Teams', href: '/teams', icon: Users2 },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
]

export function Sidebar() {
  const { compactSidebar } = useThemeStore()

  return (
    <aside 
      className={cn(
        "bg-sidebar backdrop-blur-xl flex flex-col border-r border-sidebar-border transition-all duration-300",
        compactSidebar ? "w-20" : "w-64"
      )}
    >
      {/* Logo - inoRain branded */}
      <div className="h-20 flex items-center px-5 border-b border-sidebar-border">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          {/* Logo icon with animated glow */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00c3ff] via-[#4f8fff] to-[#8b5cf6] blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500" />
            {/* Logo container */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#00c3ff] via-[#4f8fff] to-[#8b5cf6] flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
              <Telescope className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>
          {/* Brand text */}
          {!compactSidebar && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-sidebar-foreground transition-colors duration-300 group-hover:text-primary">
                Telescope
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                  by inoRain
                </span>
                <Zap className="w-3 h-3 text-primary" />
              </div>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5">
        {!compactSidebar && (
          <div className="px-3 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Main Menu
            </span>
          </div>
        )}
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden hover:bg-sidebar-accent',
                compactSidebar ? 'px-3 justify-center' : 'px-4',
                isActive && 'bg-sidebar-accent'
              )
            }
            title={compactSidebar ? item.name : undefined}
          >
            {({ isActive }) => (
              <>
                {/* Active background gradient */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                )}
                {/* Active left border */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-primary to-[#4f8fff]" />
                )}
                <item.icon 
                  className={cn(
                    "w-5 h-5 relative z-10 transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {!compactSidebar && (
                  <span 
                    className={cn(
                      "relative z-10",
                      isActive ? "text-sidebar-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 space-y-1 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 py-3 rounded-xl text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            compactSidebar ? "px-3 justify-center" : "px-4"
          )}
          title={compactSidebar ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5" />
          {!compactSidebar && 'Settings'}
        </NavLink>
        <Button 
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            compactSidebar ? "px-3 justify-center" : "px-4"
          )}
          title={compactSidebar ? 'Log out' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!compactSidebar && 'Log out'}
        </Button>
      </div>

      {/* Pro badge / Version */}
      {!compactSidebar && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>v1.0.0</span>
            <Badge variant="info" className="text-[10px]">
              Enterprise
            </Badge>
          </div>
        </div>
      )}
    </aside>
  )
}
