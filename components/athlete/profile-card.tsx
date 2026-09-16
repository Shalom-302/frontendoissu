import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { Athlete } from '@/types'

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm">{value || '—'}</dd>
    </div>
  )
}

/** The "fiche athlète" of doc §7.2, read-only. */
export function ProfileCard({ athlete, title = 'Fiche athlète' }: { athlete: Athlete; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          {athlete.is_active === false ? (
            <Badge variant="danger">Compte désactivé</Badge>
          ) : (
            <Badge variant="success">Compte actif</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Nom" value={`${athlete.first_name} ${athlete.last_name}`} />
          <Field label="Numéro de licence" value={athlete.license_number} />
          <Field label="Adresse e-mail" value={athlete.email} />
          <Field label="Discipline" value={athlete.discipline} />
          <Field label="Spécialité / épreuve" value={athlete.speciality} />
          <Field label="Catégorie" value={athlete.category} />
          <Field label="Établissement / club" value={athlete.club_or_establishment} />
          <Field label="Niveau d'études" value={athlete.education_level} />
          <Field label="Nationalité" value={athlete.nationality} />
          <Field label="Sexe" value={athlete.gender === 'F' ? 'Féminin' : athlete.gender === 'M' ? 'Masculin' : null} />
          <Field label="Date de naissance" value={formatDate(athlete.date_of_birth)} />
        </dl>
      </CardContent>
    </Card>
  )
}
