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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const stats = [
  {
    name: 'Total Employees',
    value: '156',
    change: '+12%',
    icon: Users,
    trend: 'up',
  },
  {
    name: 'On Vacation',
    value: '8',
    change: '5.1%',
    icon: CalendarCheck,
    trend: 'neutral',
  },
  {
    name: 'Active Projects',
    value: '23',
    change: '+3',
    icon: FolderKanban,
    trend: 'up',
  },
  {
    name: 'Skills Tracked',
    value: '45',
    change: '+8',
    icon: Sparkles,
    trend: 'up',
  },
]

const recentActivities = [
  { id: 1, type: 'vacation', user: 'David Wilson', action: 'requested vacation', time: '2 hours ago' },
  { id: 2, type: 'project', user: 'Emma Thompson', action: 'joined Project Phoenix', time: '4 hours ago' },
  { id: 3, type: 'skill', user: 'Michael Brown', action: 'added React to skills', time: '5 hours ago' },
  { id: 4, type: 'hire', user: 'Sarah Miller', action: 'joined the team', time: '1 day ago' },
]

const topPerformers = [
  { name: 'Alex Morgan', role: 'Senior Developer', skills: 12, rating: 4.9 },
  { name: 'Jordan Lee', role: 'Tech Lead', skills: 15, rating: 4.8 },
  { name: 'Casey Kim', role: 'Full Stack Dev', skills: 10, rating: 4.7 },
]

export function Dashboard() {
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
        {stats.map((stat) => (
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
                  {stat.change}
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
        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Recent Activity</CardTitle>
            <Button variant="link" className="text-primary p-0 h-auto">
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-background transition-colors duration-300 hover:bg-muted/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Avatar className="w-10 h-10 rounded-xl">
                  <AvatarFallback className="rounded-xl">
                    <UserCheck className="w-5 h-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-foreground">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Top Performers</CardTitle>
            <Sparkles className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={performer.name}
                className="flex items-center gap-4 p-3 rounded-xl bg-background"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 rounded-xl">
                    <AvatarFallback className="rounded-xl text-sm font-bold">
                      {performer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-background">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-foreground">
                    {performer.name}
                  </p>
                  <p className="text-sm truncate text-muted-foreground">
                    {performer.role}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {performer.skills} skills
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ⭐ {performer.rating}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
