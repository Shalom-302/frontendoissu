import { MedalBadge } from '@/components/athlete/medal-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatRanking, formatResult } from '@/lib/utils'
import type { Performance } from '@/types'

/**
 * Performance history.
 *
 * `showAthlete` turns the same table into the ADMIN view, where results come
 * from every athlete at once.
 */
export function PerformanceTable({
  performances,
  showAthlete = false,
  emptyTitle = 'Aucune performance enregistrée',
}: {
  performances: Performance[]
  showAthlete?: boolean
  emptyTitle?: string
}) {
  if (performances.length === 0) {
    return <EmptyState title={emptyTitle} />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Compétition</TableHead>
          {showAthlete ? <TableHead>Athlète</TableHead> : null}
          <TableHead>Épreuve</TableHead>
          <TableHead>Résultat</TableHead>
          <TableHead>Classement</TableHead>
          <TableHead>Distinction</TableHead>
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
            {showAthlete ? (
              <TableCell>
                <div className="font-medium">{performance.athlete_name ?? '—'}</div>
                <div className="text-xs text-muted">{performance.athlete_license_number}</div>
              </TableCell>
            ) : null}
            <TableCell>
              <div>{performance.event}</div>
              <div className="text-xs text-muted">{performance.discipline}</div>
            </TableCell>
            <TableCell className="whitespace-nowrap font-medium tabular-nums">
              {formatResult(performance.result, performance.unit)}
            </TableCell>
            <TableCell className="tabular-nums">{formatRanking(performance.ranking)}</TableCell>
            <TableCell>
              <MedalBadge medal={performance.medal} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
