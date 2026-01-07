import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  CalendarCheck,
  Sparkles,
  FolderKanban,
  TrendingUp,
  ArrowUpRight,
  Clock,
  UserCheck,
  Zap,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { dashboardService, DashboardStats, RecentEmployee } from '@/services/dashboard'

interface StatConfig {
  name: string
  value: number
  icon: typeof Users
  trend: 'up' | 'neutral' | 'down'
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentEmployees, setRecentEmployees] = useState<RecentEmployee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      try {
        const [statsData, employeesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentEmployees(5),
        ])
        setStats(statsData)
        setRecentEmployees(employeesData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards: StatConfig[] = stats
    ? [
        {
          name: 'Total Employees',
          value: stats.totalEmployees,
          icon: Users,
          trend: 'up',
        },
        {
          name: 'On Vacation',
          value: stats.onVacation,
          icon: CalendarCheck,
          trend: 'neutral',
        },
        {
          name: 'Active Projects',
          value: stats.activeProjects,
          icon: FolderKanban,
          trend: 'up',
        },
        {
          name: 'Skills Tracked',
          value: stats.skillsTracked,
          icon: Sparkles,
          trend: 'up',
        },
      ]
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 stagger-children">
      {/* Welcome Banner - inoRain styled */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-card to-[#8b5cf6]/10 border-primary/20">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-20 blur-3xl bg-primary" />
        <div className="absolute bottom-0 left-1/2 w-60 h-60 opacity-10 blur-3xl bg-[#8b5cf6]" />
        
        <CardContent className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Dashboard Overview
                </span>
              </div>
              <h1 className="text-3xl font-display font-bold mb-2 text-foreground">
                Welcome back, <span className="gradient-text-cyan">Admin</span>
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening at inoRain today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/90 border border-border">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <Button>
                <TrendingUp className="w-4 h-4" />
                View Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <Card
            key={stat.name}
            className="group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/15 to-[#4f8fff]/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <Badge variant={stat.trend === 'up' ? 'success' : 'info'} className="flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Live
                </Badge>
              </div>
              <p className="text-3xl font-display font-bold mb-1 text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {stat.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Employees */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Recent Employees</CardTitle>
            <Link to="/employees">
              <Button variant="link" className="text-primary p-0 h-auto">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEmployees.length > 0 ? (
              recentEmployees.map((employee, index) => (
                <Link
                  key={employee.id}
                  to={`/employees/${employee.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-background transition-colors duration-300 hover:bg-muted/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Avatar className="w-10 h-10 rounded-xl">
                    <AvatarFallback className="rounded-xl">
                      {getInitials(employee.firstName, employee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-foreground">
                      <span className="font-semibold">{employee.firstName} {employee.lastName}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employee.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={employee.status === 'active' ? 'success' : employee.status === 'vacation' ? 'warning' : 'default'}
                    >
                      {employee.status}
                    </Badge>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No employees found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Quick Stats</CardTitle>
            <Sparkles className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-background">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <UserCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Active Rate</p>
                <p className="text-sm text-muted-foreground">
                  {stats && stats.totalEmployees > 0
                    ? `${Math.round(((stats.totalEmployees - stats.onVacation) / stats.totalEmployees) * 100)}%`
                    : '0%'
                  } employees working
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-xl bg-background">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <CalendarCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">On Vacation</p>
                <p className="text-sm text-muted-foreground">
                  {stats?.onVacation || 0} employees
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-background">
              <div className="p-2 rounded-lg bg-primary/20">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Projects</p>
                <p className="text-sm text-muted-foreground">
                  {stats?.activeProjects || 0} active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-background">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Skills Database</p>
                <p className="text-sm text-muted-foreground">
                  {stats?.skillsTracked || 0} skills tracked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
