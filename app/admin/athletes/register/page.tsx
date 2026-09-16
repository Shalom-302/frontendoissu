import type { Metadata } from 'next'

import { RegisterAthleteForm } from '@/components/admin/register-athlete-form'
import { Alert } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Enregistrer un athlète' }

/** ADMIN-only athlete creation (doc §4.2). */
export default function RegisterAthletePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Enregistrer un athlète</h1>
        <p className="text-sm text-muted">
          Ce formulaire crée à la fois le compte de connexion et la fiche athlète.
        </p>
      </header>

      <Alert>
        Le compte et le profil sont créés dans une même transaction : si une partie échoue, rien
        n&apos;est enregistré.
      </Alert>

      <Card>
        <CardContent className="py-6">
          <RegisterAthleteForm />
        </CardContent>
      </Card>
    </div>
  )
}
