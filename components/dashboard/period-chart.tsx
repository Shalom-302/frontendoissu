'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { EmptyState } from '@/components/dashboard/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPeriod } from '@/lib/utils'
import type { PeriodStat } from '@/types'

/** Overall activity over time, month by month (doc §14). */
export function PeriodChart({ stats }: { stats: PeriodStat[] }) {
  const data = stats.map((stat) => ({ ...stat, label: formatPeriod(stat.period) }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution générale</CardTitle>
        <CardDescription>Performances enregistrées par période</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="Aucune période à afficher" />
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="periodFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--muted)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  minTickGap={16}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--muted)' }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="performances"
                  name="Performances"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#periodFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
