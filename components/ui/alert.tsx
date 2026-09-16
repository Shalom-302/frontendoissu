import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const TONES = {
  info: { icon: Info, className: 'border-border bg-surface-muted text-foreground' },
  success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  error: { icon: AlertCircle, className: 'border-red-200 bg-red-50 text-red-900' },
} as const

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: keyof typeof TONES
}

export function Alert({ tone = 'info', className, children, ...props }: AlertProps) {
  const { icon: Icon, className: toneClass } = TONES[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-2 rounded-md border px-3 py-2 text-sm', toneClass, className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}
