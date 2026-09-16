import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-100 text-brand-800',
        outline: 'border-border text-muted',
        success: 'border-transparent bg-emerald-100 text-emerald-800',
        warning: 'border-transparent bg-amber-100 text-amber-900',
        danger: 'border-transparent bg-red-100 text-red-800',
        gold: 'border-transparent bg-amber-100 text-amber-900',
        silver: 'border-transparent bg-slate-200 text-slate-700',
        bronze: 'border-transparent bg-orange-100 text-orange-900',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
