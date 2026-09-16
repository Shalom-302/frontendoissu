import { Activity, Building2, CalendarDays, Layers, Trophy, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { BestResults } from '@/components/athlete/best-results'
import { PerformanceTable } from '@/components/athlete/performance-table'
import { DisciplineChart } from '@/components/dashboard/discipline-chart'
import { MedalSummary } from '@/components/dashboard/medal-summary'
import { PeriodChart } from '@/components/dashboard/period-chart'
import { SeasonTable } from '@/components/dashboard/season-table'
import { StatCard } from '@/components/dashboard/stat-card'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiError, apiFetch } from '@/lib/api-server'
import type { AdminDashboard } from '@/types'

export const metadata: Metadata = { title: 'Pilotage' }

/** Global steering dashboard (doc §14). */
export default async function AdminDashboardPage() {
  let dashboard: AdminDashboard

  try {
    dashboard = await apiFetch<AdminDashboard>('/api/v1/admin/dashboard')
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : 'Le service est momentanément injoignable. Réessayez dans un instant.'
    return (
      <Alert tone="error">
        <p className="font-medium">Tableau de bord indisponible</p>
        <p>{message}</p>
      </Alert>
    )
  }

  const inactive = dashboard.total_athletes - dashboard.active_athletes

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Pilotage</h1>
          <p className="text-sm text-muted">
            Vue d&apos;ensemble des athlètes, des compétitions et des performances.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/athletes/register">Enregistrer un athlète</Link>
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Athlètes"
          value={dashboard.total_athletes}
          hint={`${dashboard.active_athletes} actifs · ${inactive} désactivés`}
          icon={Users}
        />
        <StatCard label="Disciplines" value={dashboard.total_disciplines} icon={Layers} />
        <StatCard label="Compétitions" value={dashboard.total_competitions} icon={CalendarDays} />
        <StatCard label="Performances" value={dashboard.total_performances} icon={Activity} />
        <StatCard
          label="Établissements"
          value={dashboard.total_establishments}
          icon={Building2}
        />
        <StatCard
          label="Distinctions"
          value={dashboard.medals.gold + dashboard.medals.silver + dashboard.medals.bronze}
          icon={Trophy}
        />
      </div>

      <PeriodChart stats={dashboard.by_period} />

      <div className="grid gap-4 lg:grid-cols-2">
        <DisciplineChart stats={dashboard.by_discipline} />
        <div className="grid gap-4">
          <MedalSummary medals={dashboard.medals} title="Médailles et distinctions" />
          <BestResults
            results={dashboard.best_results}
            title="Meilleurs résultats"
            description="Podiums les plus récents"
          />
        </div>
      </div>

      <SeasonTable seasons={dashboard.seasons} showRanking={false} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Dernières performances enregistrées</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/performances">Tout voir</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <PerformanceTable performances={dashboard.latest_performances} showAthlete />
        </CardContent>
      </Card>
    </div>
  )
}
