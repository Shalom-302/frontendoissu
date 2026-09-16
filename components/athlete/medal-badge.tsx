import { Badge } from '@/components/ui/badge'

const VARIANTS = {
  Or: 'gold',
  Argent: 'silver',
  Bronze: 'bronze',
} as const

/** A distinction, or nothing at all when the result earned none. */
export function MedalBadge({ medal }: { medal: string | null }) {
  if (!medal) return <span className="text-muted">—</span>
  const variant = VARIANTS[medal as keyof typeof VARIANTS] ?? 'outline'
  return <Badge variant={variant}>{medal}</Badge>
}
