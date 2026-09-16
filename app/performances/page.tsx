import type { Metadata } from 'next'

import { PerformanceTable } from '@/components/athlete/performance-table'
import { Alert } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiError, apiFetch } from '@/lib/api-server'
import type { Performance } from '@/types'

export const metadata: Metadata = { title: 'Mes performances' }

/** Full history of the signed-in athlete (doc §9.2). */
export default async function PerformancesPage() {
  let performances: Performance[]

  try {
    performances = await apiFetch<Performance[]>('/api/v1/athletes/me/performances')
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : 'Le service est momentanément injoignable. Réessayez dans un instant.'
    return (
      <Alert tone="error">
        <p className="font-medium">Historique indisponible</p>
        <p>{message}</p>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Mes performances</h1>
        <p className="text-sm text-muted">
          Historique complet, de la compétition la plus récente à la plus ancienne.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>
            {performances.length} performance{performances.length > 1 ? 's' : ''} enregistrée
            {performances.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <PerformanceTable performances={performances} />
        </CardContent>
      </Card>
    </div>
  )
}
