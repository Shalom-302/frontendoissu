import { EmptyState } from '@/components/dashboard/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { SeasonSummary } from '@/types'

/** Season-by-season recap (doc §13: "par saison"). */
export function SeasonTable({
  seasons,
  showRanking = true,
}: {
  seasons: SeasonSummary[]
  showRanking?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Par saison</CardTitle>
        <CardDescription>Saison scolaire, de septembre à août</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {seasons.length === 0 ? (
          <EmptyState title="Aucune saison enregistrée" className="mx-5 mb-5" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Saison</TableHead>
                <TableHead>Compétitions</TableHead>
                <TableHead>Performances</TableHead>
                <TableHead>Médailles</TableHead>
                {showRanking ? <TableHead className="pr-5">Classement moyen</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasons.map((season) => (
                <TableRow key={season.season}>
                  <TableCell className="pl-5 font-medium">{season.season}</TableCell>
                  <TableCell className="tabular-nums">{season.competitions}</TableCell>
                  <TableCell className="tabular-nums">{season.performances}</TableCell>
                  <TableCell className="tabular-nums">{season.medals}</TableCell>
                  {showRanking ? (
                    <TableCell className="pr-5 tabular-nums">
                      {season.average_ranking ?? '—'}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
