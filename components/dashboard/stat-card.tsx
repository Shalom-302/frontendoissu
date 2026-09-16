import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string
  value: string | number
  hint?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Card className={className}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          {hint ? <p className="mt-1 truncate text-xs text-muted">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className={cn('grid size-9 shrink-0 place-items-center rounded-md bg-surface-muted')}>
            <Icon className="size-4 text-primary" aria-hidden />
          </span>
        ) : null}
      </CardContent>
    </Card>
  )
}
