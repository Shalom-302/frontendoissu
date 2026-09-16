import { EmptyState } from '@/components/dashboard/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatResult } from '@/lib/utils'
import type { BestResult } from '@/types'

/** Personal (or overall) bests, one line per event. */
export function BestResults({
  results,
  title = 'Meilleurs résultats',
  description,
}: {
  results: BestResult[]
  title?: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <EmptyState title="Aucun résultat à afficher" />
        ) : (
          <ul className="divide-y divide-border">
            {results.map((result) => (
              <li
                key={`${result.discipline}-${result.event}-${result.competition_date}`}
                className="flex flex-wrap items-baseline justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="font-medium">{result.event}</div>
                  <div className="truncate text-xs text-muted">
                    {result.athlete_name ? `${result.athlete_name} · ` : ''}
                    {result.competition_name} · {formatDate(result.competition_date)}
                  </div>
                </div>
                <div className="whitespace-nowrap font-semibold tabular-nums">
                  {formatResult(result.result, result.unit)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
