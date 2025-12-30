import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({ open: false, onOpenChange: () => {} })

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ 
  children, 
  asChild 
}: { 
  children: React.ReactNode
  asChild?: boolean 
}) {
  const { onOpenChange } = React.useContext(DialogContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props?.onClick?.(e)
        onOpenChange(true)
      },
    })
  }

  return (
    <button onClick={() => onOpenChange(true)}>
      {children}
    </button>
  )
}

export function DialogContent({ children, className }: DialogContentProps) {
  const { open, onOpenChange } = React.useContext(DialogContext)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in',
          'bg-[--color-bg-card] border border-[--color-border]',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-[--color-text-muted] hover:text-[--color-text-primary] hover:bg-[--color-bg-hover] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 
      className={cn(
        'text-xl font-display font-semibold',
        className
      )}
      style={{ color: 'var(--color-text-primary)' }}
    >
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p 
      className={cn('text-sm mt-1', className)}
      style={{ color: 'var(--color-text-secondary)' }}
    >
      {children}
    </p>
  )
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('flex justify-end gap-3 mt-6', className)}>
      {children}
    </div>
  )
}

export function DialogClose({ 
  children, 
  asChild 
}: { 
  children: React.ReactNode
  asChild?: boolean 
}) {
  const { onOpenChange } = React.useContext(DialogContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props?.onClick?.(e)
        onOpenChange(false)
      },
    })
  }

  return (
    <button onClick={() => onOpenChange(false)}>
      {children}
    </button>
  )
}

