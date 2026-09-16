import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MedalCount } from '@/types'

const MEDALS = [
  { key: 'gold', label: 'Or', className: 'bg-amber-100 text-amber-900' },
  { key: 'silver', label: 'Argent', className: 'bg-slate-200 text-slate-700' },
  { key: 'bronze', label: 'Bronze', className: 'bg-orange-100 text-orange-900' },
] as const

export function MedalSummary({ medals, title = 'Distinctions' }: { medals: MedalCount; title?: string }) {
  const total = medals.gold + medals.silver + medals.bronze

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-2xl font-semibold tabular-nums">{total}</p>
        <div className="grid grid-cols-3 gap-2">
          {MEDALS.map(({ key, label, className }) => (
            <div key={key} className={`rounded-md px-3 py-2 text-center ${className}`}>
              <div className="text-lg font-semibold tabular-nums">{medals[key]}</div>
              <div className="text-xs">{label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
