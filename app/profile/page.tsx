import type { Metadata } from 'next'

import { ProfileCard } from '@/components/athlete/profile-card'
import { SelfUpdateForm } from '@/components/athlete/self-update-form'
import { Alert } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiErrorMessage, apiFetch } from '@/lib/api-server'
import type { AthleteDetail } from '@/types'

export const metadata: Metadata = { title: 'Mon profil' }

/** Athlete self-service profile (doc §9.2). */
export default async function ProfilePage() {
  let athlete: AthleteDetail

  try {
    athlete = await apiFetch<AthleteDetail>('/api/v1/athletes/me')
  } catch (error) {
    const message = apiErrorMessage(error)
    return (
      <Alert tone="error">
        <p className="font-medium">Profil indisponible</p>
        <p>{message}</p>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Mon profil</h1>
        <p className="text-sm text-muted">
          Vos informations de licence sont gérées par l&apos;administration de l&apos;OISSU.
        </p>
      </header>

      <ProfileCard athlete={athlete} />

      <Card>
        <CardHeader>
          <CardTitle>Modifier mes informations</CardTitle>
          <CardDescription>
            Pour toute correction d&apos;identité, de licence ou de discipline, contactez
            l&apos;administration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SelfUpdateForm athlete={athlete} />
        </CardContent>
      </Card>
    </div>
  )
}
