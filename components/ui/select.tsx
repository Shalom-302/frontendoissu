import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * A native `<select>`, deliberately.
 *
 * The filters and forms here are plain single-choice pickers; the native
 * control brings keyboard support, mobile pickers and form semantics for free.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'
