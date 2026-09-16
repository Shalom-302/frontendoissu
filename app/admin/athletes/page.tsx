import type { Metadata } from 'next'
import Link from 'next/link'

import { AthleteFiltersBar } from '@/components/admin/athlete-filters'
import { Pagination } from '@/components/admin/pagination'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApiError, apiFetch } from '@/lib/api-server'
import type { Athlete, AthleteFilters, Page } from '@/types'

export const metadata: Metadata = { title: 'Athlètes' }

const PAGE_SIZE = 20

const FILTER_KEYS = ['q', 'discipline', 'category', 'club_or_establishment', 'is_active'] as const

/** Athlete list, search and filters (doc §15). */
export default async function AdminAthletesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const page = Number(params.page ?? '1') || 1

  const query = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) })
  for (const key of FILTER_KEYS) {
    const value = params[key]
    if (value) query.set(key, value)
  }

  let athletes: Page<Athlete>
  let filters: AthleteFilters

  try {
    ;[athletes, filters] = await Promise.all([
      apiFetch<Page<Athlete>>(`/api/v1/admin/athletes?${query.toString()}`),
      apiFetch<AthleteFilters>('/api/v1/admin/athletes/filters'),
    ])
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : 'Le service est momentanément injoignable. Réessayez dans un instant.'
    return (
      <Alert tone="error">
        <p className="font-medium">Liste indisponible</p>
        <p>{message}</p>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Athlètes</h1>
          <p className="text-sm text-muted">
            Consultation, recherche et gestion des fiches athlètes.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/athletes/register">Enregistrer un athlète</Link>
        </Button>
      </header>

      <Card>
        <CardContent>
          <AthleteFiltersBar filters={filters} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0 py-0">
          {athletes.items.length === 0 ? (
            <EmptyState
              title="Aucun athlète ne correspond"
              description="Ajustez la recherche ou les filtres."
              className="m-5"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Athlète</TableHead>
                    <TableHead>Licence</TableHead>
                    <TableHead>Discipline</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="pr-5 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {athletes.items.map((athlete) => (
                    <TableRow key={athlete.id}>
                      <TableCell className="pl-5">
                        <div className="font-medium">
                          {athlete.first_name} {athlete.last_name}
                        </div>
                        <div className="text-xs text-muted">{athlete.email}</div>
                      </TableCell>
                      <TableCell className="tabular-nums">{athlete.license_number}</TableCell>
                      <TableCell>
                        <div>{athlete.discipline}</div>
                        {athlete.speciality ? (
                          <div className="text-xs text-muted">{athlete.speciality}</div>
                        ) : null}
                      </TableCell>
                      <TableCell>{athlete.category ?? '—'}</TableCell>
                      <TableCell className="max-w-56 truncate">
                        {athlete.club_or_establishment ?? '—'}
                      </TableCell>
                      <TableCell>
                        {athlete.is_active === false ? (
                          <Badge variant="danger">Désactivé</Badge>
                        ) : (
                          <Badge variant="success">Actif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/athletes/${athlete.id}`}>Détail</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                basePath="/admin/athletes"
                searchParams={params}
                page={athletes.page}
                totalPages={athletes.total_pages}
                total={athletes.total}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
