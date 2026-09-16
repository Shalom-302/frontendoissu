import { cn } from '@/lib/utils'

/** Shown wherever the demo data (or a filter) leaves a section with nothing. */
export function EmptyState({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-border px-4 py-10 text-center',
        className,
      )}
    >
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
    </div>
  )
}
