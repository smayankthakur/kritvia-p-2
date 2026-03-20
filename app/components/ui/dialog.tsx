"use client"

import * as React from "react"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange?.(false)} />
      )}
      {children}
    </>
  )
}

const DialogTrigger = Dialog

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg focus:outline-none">
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`mb-4 ${className || ''}`}>{children}</div>
}

const DialogFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`mt-6 flex justify-end gap-2 ${className || ''}`}>{children}</div>
}

const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`text-lg font-semibold ${className || ''}`}>{children}</h2>
}

const DialogDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={`text-sm text-gray-500 ${className || ''}`}>{children}</p>
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
