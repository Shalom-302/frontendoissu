import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AthleteAdminPanel } from '@/components/admin/athlete-admin-panel'
import { AthletePerformances } from '@/components/admin/athlete-performances'
import { ProfileCard } from '@/components/athlete/profile-card'
import { Button } from '@/components/ui/button'
import { ApiError, apiFetch } from '@/lib/api-server'
import type { AthleteDetail } from '@/types'

export const metadata: Metadata = { title: 'Fiche athlète' }

/** One athlete: fiche, historique et actions d'administration (doc §15). */
export default async function AdminAthletePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let athlete: AthleteDetail
  try {
    athlete = await apiFetch<AthleteDetail>(`/api/v1/admin/athletes/${id}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/admin/athletes">
            <ArrowLeft aria-hidden />
            Retour à la liste
          </Link>
        </Button>
      </div>

      <header>
        <h1 className="text-xl font-semibold">
          {athlete.first_name} {athlete.last_name}
        </h1>
        <p className="text-sm text-muted">
          Licence {athlete.license_number} · {athlete.discipline}
          {athlete.speciality ? ` · ${athlete.speciality}` : ''}
        </p>
      </header>

      <ProfileCard athlete={athlete} />

      <AthletePerformances
        athleteId={athlete.id}
        discipline={athlete.discipline}
        initialPerformances={athlete.performances}
      />

      <AthleteAdminPanel athlete={athlete} />
    </div>
  )
}
