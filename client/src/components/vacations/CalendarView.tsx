import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { VacationType, VacationStatus } from '../../types'

interface VacationEvent {
  id: number
  employee: string
  avatar: string
  type: VacationType | string
  startDate: string
  endDate: string
  status: VacationStatus | string
  gradientFrom: string
  gradientTo: string
}

interface CalendarViewProps {
  open: boolean
  onClose: () => void
  vacations: VacationEvent[]
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const typeColors: Record<string, { bg: string; text: string }> = {
  vacation: { bg: 'rgba(0, 195, 255, 0.2)', text: '#00c3ff' },
  Vacation: { bg: 'rgba(0, 195, 255, 0.2)', text: '#00c3ff' },
  sick_leave: { bg: 'rgba(244, 63, 94, 0.2)', text: '#fb7185' },
  'Sick Leave': { bg: 'rgba(244, 63, 94, 0.2)', text: '#fb7185' },
  day_off: { bg: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee' },
  'Day Off': { bg: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee' },
  remote: { bg: 'rgba(168, 85, 247, 0.2)', text: '#a855f7' },
  Remote: { bg: 'rgba(168, 85, 247, 0.2)', text: '#a855f7' },
}

const statusColors: Record<string, string> = {
  pending: '#fbbf24',
  approved: '#34d399',
  rejected: '#f87171',
  cancelled: '#94a3b8',
}

export function CalendarView({ open, onClose, vacations }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const { days, startOffset } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startOffset = firstDay.getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
      day: i + 1,
    }))

    return { days, startOffset }
  }, [currentDate])

  const getVacationsForDate = (date: Date) => {
    return vacations.filter((v) => {
      const start = new Date(v.startDate)
      const end = new Date(v.endDate)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      const checkDate = new Date(date)
      checkDate.setHours(12, 0, 0, 0)
      return checkDate >= start && checkDate <= end
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Calendar Modal */}
      <div
        className="relative z-50 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-fade-in"
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-4">
            <h2 
              className="text-xl font-display font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-[--color-bg-hover] transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  background: 'var(--color-bg-hover)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-[--color-bg-hover] transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ background: statusColors.approved }}
              />
              <span style={{ color: 'var(--color-text-secondary)' }}>Approved</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ background: statusColors.pending }}
              />
              <span style={{ color: 'var(--color-text-secondary)' }}>Pending</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[--color-text-muted] hover:text-[--color-text-primary] hover:bg-[--color-bg-hover] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {/* Day headers */}
          <div 
            className="grid grid-cols-7 gap-1 mb-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            {DAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div 
                key={`empty-${i}`} 
                className="min-h-[100px] p-2 rounded-lg"
                style={{ background: 'var(--color-bg-primary)' }}
              />
            ))}

            {/* Day cells */}
            {days.map(({ date, day }) => {
              const dayVacations = getVacationsForDate(date)
              const today = isToday(date)

              return (
                <div
                  key={day}
                  className="min-h-[100px] p-2 rounded-lg transition-colors hover:bg-[--color-bg-hover]"
                  style={{
                    background: today 
                      ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)'
                      : 'var(--color-bg-primary)',
                    border: today ? '1px solid var(--color-accent)' : '1px solid transparent'
                  }}
                >
                  <span 
                    className="text-sm font-medium"
                    style={{ 
                      color: today ? 'var(--color-accent)' : 'var(--color-text-primary)'
                    }}
                  >
                    {day}
                  </span>
                  
                  <div className="mt-1 space-y-1">
                    {dayVacations.slice(0, 3).map((v) => {
                      const colors = typeColors[v.type] || typeColors.vacation
                      return (
                        <div
                          key={v.id}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1"
                          style={{
                            background: colors.bg,
                            color: colors.text,
                          }}
                          title={`${v.employee} - ${v.type}`}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: statusColors[v.status] || statusColors.pending }}
                          />
                          <span className="truncate">{v.employee.split(' ')[0]}</span>
                        </div>
                      )
                    })}
                    {dayVacations.length > 3 && (
                      <div 
                        className="text-[10px] font-medium px-1.5"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        +{dayVacations.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

