import { Activity, CalendarDays, Medal, Trophy } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { BestResults } from '@/components/athlete/best-results'
import { PerformanceTable } from '@/components/athlete/performance-table'
import { EvolutionChart } from '@/components/dashboard/evolution-chart'
import { MedalSummary } from '@/components/dashboard/medal-summary'
import { SeasonTable } from '@/components/dashboard/season-table'
import { StatCard } from '@/components/dashboard/stat-card'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiErrorMessage, apiFetch } from '@/lib/api-server'
import { formatRanking } from '@/lib/utils'
import type { UserDashboard } from '@/types'

export const metadata: Metadata = { title: 'Tableau de bord' }

/** Personal dashboard of the signed-in athlete (doc §13). */
export default async function DashboardPage() {
  let dashboard: UserDashboard

  try {
    dashboard = await apiFetch<UserDashboard>('/api/v1/dashboard')
  } catch (error) {
    const message = apiErrorMessage(error)
    return (
      <Alert tone="error">
        <p className="font-medium">Tableau de bord indisponible</p>
        <p>{message}</p>
      </Alert>
    )
  }

  const { athlete } = dashboard

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            Bonjour {athlete.first_name} {athlete.last_name}
          </h1>
          <p className="text-sm text-muted">
            {athlete.discipline}
            {athlete.speciality ? ` · ${athlete.speciality}` : ''} · Licence{' '}
            {athlete.license_number}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/performances">Voir toutes mes performances</Link>
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Performances" value={dashboard.total_performances} icon={Activity} />
        <StatCard label="Compétitions" value={dashboard.total_competitions} icon={CalendarDays} />
        <StatCard
          label="Meilleur classement"
          value={formatRanking(dashboard.best_ranking)}
          icon={Trophy}
        />
        <StatCard
          label="Distinctions"
          value={dashboard.medals.gold + dashboard.medals.silver + dashboard.medals.bronze}
          hint={`${dashboard.medals.gold} or · ${dashboard.medals.silver} argent · ${dashboard.medals.bronze} bronze`}
          icon={Medal}
        />
      </div>

      <EvolutionChart points={dashboard.evolution} />

      <div className="grid gap-4 lg:grid-cols-2">
        <BestResults results={dashboard.best_results} description="Par épreuve" />
        <MedalSummary medals={dashboard.medals} />
      </div>

      <SeasonTable seasons={dashboard.seasons} />

      <Card>
        <CardHeader>
          <CardTitle>Dernières performances</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="px-5 pb-5">
            <PerformanceTable performances={dashboard.latest_performances} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
