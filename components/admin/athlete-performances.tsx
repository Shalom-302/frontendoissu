'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { PerformanceForm } from '@/components/admin/performance-form'
import { MedalBadge } from '@/components/athlete/medal-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api-client'
import { formatDate, formatRanking, formatResult } from '@/lib/utils'
import type { Performance } from '@/types'

/**
 * Performance history of one athlete, with its CRUD (doc §15).
 *
 * The list is held in local state and updated from the API responses, so adding
 * or correcting a result shows immediately; `router.refresh()` then re-renders
 * the server parts (dashboards, counters) that the change also affects.
 */
export function AthletePerformances({
  athleteId,
  discipline,
  initialPerformances,
}: {
  athleteId: number
  discipline: string
  initialPerformances: Performance[]
}) {
  const router = useRouter()
  const [performances, setPerformances] = useState(initialPerformances)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Performance | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function sorted(list: Performance[]): Performance[] {
    return [...list].sort((a, b) => b.competition_date.localeCompare(a.competition_date))
  }

  function afterCreate(performance: Performance) {
    setPerformances((current) => sorted([...current, performance]))
    setCreating(false)
    router.refresh()
  }

  function afterUpdate(performance: Performance) {
    setPerformances((current) =>
      sorted(current.map((item) => (item.id === performance.id ? performance : item))),
    )
    setEditing(null)
    router.refresh()
  }

  async function remove(performance: Performance) {
    if (!window.confirm(`Supprimer la performance « ${performance.competition_name} » ?`)) return

    setError(null)
    setDeletingId(performance.id)
    try {
      await api(`/api/v1/admin/performances/${performance.id}`, { method: 'DELETE' })
      setPerformances((current) => current.filter((item) => item.id !== performance.id))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La suppression a échoué.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>
            Performances
            <span className="ml-2 text-sm font-normal text-muted">({performances.length})</span>
          </CardTitle>
          {!creating && !editing ? (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus aria-hidden />
              Ajouter une performance
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pb-5">
        {error ? <Alert tone="error">{error}</Alert> : null}

        {creating ? (
          <div className="rounded-lg border border-border bg-surface-muted p-4">
            <h3 className="mb-3 font-medium">Nouvelle performance</h3>
            <PerformanceForm
              athleteId={athleteId}
              discipline={discipline}
              onDone={afterCreate}
              onCancel={() => setCreating(false)}
            />
          </div>
        ) : null}

        {editing ? (
          <div className="rounded-lg border border-border bg-surface-muted p-4">
            <h3 className="mb-3 font-medium">Modifier la performance</h3>
            <PerformanceForm
              athleteId={athleteId}
              discipline={discipline}
              performance={editing}
              onDone={afterUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        ) : null}

        {performances.length === 0 ? (
          <EmptyState
            title="Aucune performance enregistrée"
            description="Ajoutez une première performance pour démarrer l'historique."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Compétition</TableHead>
                <TableHead>Épreuve</TableHead>
                <TableHead>Résultat</TableHead>
                <TableHead>Classement</TableHead>
                <TableHead>Distinction</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performances.map((performance) => (
                <TableRow key={performance.id}>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {formatDate(performance.competition_date)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{performance.competition_name}</div>
                    {performance.location ? (
                      <div className="text-xs text-muted">{performance.location}</div>
                    ) : null}
                  </TableCell>
                  <TableCell>{performance.event}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">
                    {formatResult(performance.result, performance.unit)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatRanking(performance.ranking)}
                  </TableCell>
                  <TableCell>
                    <MedalBadge medal={performance.medal} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Modifier"
                        onClick={() => {
                          setCreating(false)
                          setEditing(performance)
                        }}
                      >
                        <Pencil aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Supprimer"
                        disabled={deletingId === performance.id}
                        onClick={() => remove(performance)}
                      >
                        <Trash2 aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
