'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { EmptyState } from '@/components/dashboard/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { formatDate, formatResult } from '@/lib/utils'
import type { EvolutionPoint } from '@/types'

const ALL_SEASONS = 'all'

/**
 * Progression of an athlete, competition day by competition day (doc §13).
 *
 * One chart per event: a 100 m time and a long-jump distance share no scale, so
 * plotting them together would be meaningless. The selector picks the event,
 * and a second one narrows to a season.
 */
export function EvolutionChart({ points }: { points: EvolutionPoint[] }) {
  const events = useMemo(
    () => Array.from(new Set(points.map((point) => point.event))).sort(),
    [points],
  )
  const seasons = useMemo(
    () => Array.from(new Set(points.map((point) => point.season))).sort(),
    [points],
  )

  const [event, setEvent] = useState(() => events[0] ?? '')
  const [season, setSeason] = useState(ALL_SEASONS)

  const series = useMemo(
    () =>
      points
        .filter((point) => point.event === event)
        .filter((point) => season === ALL_SEASONS || point.season === season)
        .map((point) => ({
          date: point.competition_date,
          label: formatDate(point.competition_date),
          value: Number(point.result),
          unit: point.unit,
          competition: point.competition_name,
          ranking: point.ranking,
        })),
    [points, event, season],
  )

  const unit = series[0]?.unit ?? ''

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Évolution des performances</CardTitle>
            <CardDescription>Par journée de compétition</CardDescription>
          </div>
          {events.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Select
                aria-label="Épreuve"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="h-9 w-auto"
              >
                {events.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="Saison"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="h-9 w-auto"
              >
                <option value={ALL_SEASONS}>Toutes les saisons</option>
                {seasons.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        {series.length === 0 ? (
          <EmptyState
            title="Aucune performance à afficher"
            description="Les performances enregistrées alimenteront ce graphique."
          />
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: 'var(--muted)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--muted)' }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => [formatResult(Number(value), unit), 'Résultat']}
                  labelFormatter={(label, payload) =>
                    (payload?.[0]?.payload as { competition?: string } | undefined)?.competition ??
                    String(label)
                  }
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--primary)' }}
                  activeDot={{ r: 5 }}
                  name="Résultat"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
