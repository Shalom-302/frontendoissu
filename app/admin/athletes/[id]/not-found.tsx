import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/dashboard/empty-state'

export default function AthleteNotFound() {
  return (
    <div className="space-y-4">
      <EmptyState
        title="Athlète introuvable"
        description="Cette fiche n'existe pas ou a été supprimée."
      />
      <Button asChild variant="outline" size="sm">
        <Link href="/admin/athletes">Retour à la liste</Link>
      </Button>
    </div>
  )
}
