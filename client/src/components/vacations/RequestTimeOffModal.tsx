import { useState } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import type { VacationType } from '../../types'

interface RequestTimeOffModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    type: VacationType
    startDate: string
    endDate: string
    reason: string
  }) => Promise<void>
}

const vacationTypes: { value: VacationType; label: string; description: string }[] = [
  { value: 'vacation', label: 'Vacation', description: 'Annual leave or personal vacation' },
  { value: 'sick_leave', label: 'Sick Leave', description: 'Medical or health-related absence' },
  { value: 'day_off', label: 'Day Off', description: 'Single day off for personal matters' },
  { value: 'remote', label: 'Remote Work', description: 'Work from home request' },
]

export function RequestTimeOffModal({ open, onOpenChange, onSubmit }: RequestTimeOffModalProps) {
  const [type, setType] = useState<VacationType>('vacation')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ type, startDate, endDate, reason })
      // Reset form
      setType('vacation')
      setStartDate('')
      setEndDate('')
      setReason('')
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) return 0
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const days = calculateDays()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Request Time Off</DialogTitle>
          <DialogDescription>
            Submit a new time off request. Your manager will review and approve it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error message */}
          {error && (
            <div 
              className="p-3 rounded-lg text-sm text-center"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171'
              }}
            >
              {error}
            </div>
          )}

          {/* Type selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Type of Leave
            </label>
            <div className="grid grid-cols-2 gap-3">
              {vacationTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className="p-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: type === t.value 
                      ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)'
                      : 'var(--color-bg-hover)',
                    border: type === t.value 
                      ? '2px solid var(--color-accent)'
                      : '2px solid var(--color-border)',
                  }}
                >
                  <p 
                    className="font-medium text-sm"
                    style={{ 
                      color: type === t.value ? 'var(--color-accent)' : 'var(--color-text-primary)' 
                    }}
                  >
                    {t.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Date selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Start Date
              </label>
              <div className="relative">
                <CalendarDays 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input pl-10"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                End Date
              </label>
              <div className="relative">
                <CalendarDays 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input pl-10"
                  min={startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </div>

          {/* Days count */}
          {days > 0 && (
            <div 
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)'
              }}
            >
              <Clock className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>{days}</span>{' '}
                {days === 1 ? 'day' : 'days'} requested
              </span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the reason for your time off..."
              rows={3}
              className="input resize-none"
              style={{ minHeight: '80px' }}
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !startDate || !endDate}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

