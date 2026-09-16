'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { EmptyState } from '@/components/dashboard/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DisciplineStat } from '@/types'

/** Athletes and recorded results, discipline by discipline (doc §14). */
export function DisciplineChart({ stats }: { stats: DisciplineStat[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques par discipline</CardTitle>
        <CardDescription>Athlètes inscrits et performances enregistrées</CardDescription>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <EmptyState title="Aucune discipline renseignée" />
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="discipline"
                  tick={{ fontSize: 11, fill: 'var(--muted)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={54}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--muted)' }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--surface-muted)' }}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="athletes" name="Athlètes" fill="var(--color-brand-400)" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="performances"
                  name="Performances"
                  fill="var(--color-accent-500)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
