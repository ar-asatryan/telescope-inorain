import { Search, Bell, ChevronDown, Command, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export function Header() {
  return (
    <header className="h-16 backdrop-blur-xl flex items-center justify-between px-6 bg-card/80 border-b border-border">
      {/* Search */}
      <div className="relative w-[420px]">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search employees, projects, skills..."
          className="w-full pl-11 pr-24 py-2.5 rounded-xl text-sm bg-background/80"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-muted">
          <Command className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">K</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* AI Assistant hint */}
        <Button 
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-[#8b5cf6]/10 border-primary/20 hover:border-primary/40"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Insights</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        {/* Divider */}
        <Separator orientation="vertical" className="h-8" />

        {/* User menu */}
        <Button variant="ghost" className="flex items-center gap-3 p-1.5 pr-3 rounded-xl">
          <div className="relative">
            <Avatar className="w-9 h-9 rounded-xl">
              <AvatarFallback className="rounded-xl text-sm">AR</AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-background" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@inorain.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
