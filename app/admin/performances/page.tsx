import type { Metadata } from 'next'
import Link from 'next/link'

import { Pagination } from '@/components/admin/pagination'
import { PerformanceTable } from '@/components/athlete/performance-table'
import { Alert } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { apiErrorMessage, apiFetch } from '@/lib/api-server'
import { DISCIPLINES, MEDALS } from '@/lib/constants'
import type { Page, Performance } from '@/types'

export const metadata: Metadata = { title: 'Performances' }

const PAGE_SIZE = 25

const FILTER_KEYS = ['discipline', 'medal', 'competition_name', 'date_from', 'date_to'] as const

/**
 * All recorded results, across athletes (doc §9.3).
 *
 * Filtering here is plain links rather than a client form: a result set is
 * something an administrator will want to bookmark or share.
 */
export default async function AdminPerformancesPage({
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

  let performances: Page<Performance>
  try {
    performances = await apiFetch<Page<Performance>>(
      `/api/v1/admin/performances?${query.toString()}`,
    )
  } catch (error) {
    const message = apiErrorMessage(error)
    return (
      <Alert tone="error">
        <p className="font-medium">Liste indisponible</p>
        <p>{message}</p>
      </Alert>
    )
  }

  function chipHref(key: string, value: string | null) {
    const next = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v && k !== 'page' && k !== key) next.set(k, v)
    }
    if (value) next.set(key, value)
    const serialised = next.toString()
    return serialised ? `/admin/performances?${serialised}` : '/admin/performances'
  }

  function chipClass(active: boolean) {
    return active
      ? 'rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'
      : 'rounded-full border border-border px-3 py-1 text-xs text-muted hover:bg-surface-muted'
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Performances</h1>
        <p className="text-sm text-muted">
          Ensemble des résultats enregistrés. Les ajouts et corrections se font depuis la fiche de
          l&apos;athlète.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Discipline
            </span>
            <Link href={chipHref('discipline', null)} className={chipClass(!params.discipline)}>
              Toutes
            </Link>
            {DISCIPLINES.map((discipline) => (
              <Link
                key={discipline}
                href={chipHref('discipline', discipline)}
                className={chipClass(params.discipline === discipline)}
              >
                {discipline}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Distinction
            </span>
            <Link href={chipHref('medal', null)} className={chipClass(!params.medal)}>
              Toutes
            </Link>
            {MEDALS.map((medal) => (
              <Link
                key={medal}
                href={chipHref('medal', medal)}
                className={chipClass(params.medal === medal)}
              >
                {medal}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0 py-0">
          <div className="px-5 py-4">
            <PerformanceTable
              performances={performances.items}
              showAthlete
              emptyTitle="Aucune performance ne correspond aux filtres"
            />
          </div>
          {performances.items.length > 0 ? (
            <Pagination
              basePath="/admin/performances"
              searchParams={params}
              page={performances.page}
              totalPages={performances.total_pages}
              total={performances.total}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
