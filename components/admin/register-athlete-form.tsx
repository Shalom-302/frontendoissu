'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { api } from '@/lib/api-client'
import { CATEGORIES, DISCIPLINES, EDUCATION_LEVELS, GENDERS } from '@/lib/constants'
import { pruneEmpty } from '@/lib/utils'
import type { AthleteDetail, RegisterAthletePayload } from '@/types'

/**
 * "Register an athlete" (doc §4.2, §15).
 *
 * One submit creates two things on the backend — the login account and the
 * athlete profile — inside a single transaction. The form therefore asks for
 * the credentials and the profile together; there is no two-step flow that
 * could leave an account without a fiche.
 */
export function RegisterAthleteForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const payload = pruneEmpty({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      first_name: String(form.get('first_name') ?? ''),
      last_name: String(form.get('last_name') ?? ''),
      license_number: String(form.get('license_number') ?? ''),
      discipline: String(form.get('discipline') ?? ''),
      speciality: String(form.get('speciality') ?? ''),
      category: String(form.get('category') ?? ''),
      club_or_establishment: String(form.get('club_or_establishment') ?? ''),
      education_level: String(form.get('education_level') ?? ''),
      nationality: String(form.get('nationality') ?? ''),
      gender: String(form.get('gender') ?? ''),
      date_of_birth: String(form.get('date_of_birth') ?? ''),
    }) as unknown as RegisterAthletePayload

    try {
      const athlete = await api<AthleteDetail>('/api/v1/admin/athletes', {
        method: 'POST',
        body: payload,
      })
      router.push(`/admin/athletes/${athlete.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'enregistrement a échoué.")
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error ? <Alert tone="error">{error}</Alert> : null}

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Compte de connexion</h2>
          <p className="text-sm text-muted">
            L&apos;athlète se connectera avec cette adresse et ce mot de passe initial.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse e-mail *</Label>
            <Input id="email" name="email" type="email" required autoComplete="off" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mot de passe initial *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted">8 caractères minimum.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Fiche athlète</h2>
          <p className="text-sm text-muted">Identité, licence et rattachement sportif.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="first_name">Prénom *</Label>
            <Input id="first_name" name="first_name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last_name">Nom *</Label>
            <Input id="last_name" name="last_name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="license_number">Numéro de licence *</Label>
            <Input id="license_number" name="license_number" required placeholder="OISSU-0001" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="discipline">Discipline *</Label>
            <Select id="discipline" name="discipline" required defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              {DISCIPLINES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="speciality">Spécialité / épreuve</Label>
            <Input id="speciality" name="speciality" placeholder="100 m" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Catégorie</Label>
            <Select id="category" name="category" defaultValue="">
              <option value="">—</option>
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="club_or_establishment">Établissement / club / fédération</Label>
            <Input id="club_or_establishment" name="club_or_establishment" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="education_level">Niveau d&apos;études</Label>
            <Select id="education_level" name="education_level" defaultValue="">
              <option value="">—</option>
              {EDUCATION_LEVELS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nationality">Nationalité</Label>
            <Input id="nationality" name="nationality" defaultValue="Ivoirienne" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gender">Sexe</Label>
            <Select id="gender" name="gender" defaultValue="">
              <option value="">—</option>
              {GENDERS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date_of_birth">Date de naissance</Label>
            <Input id="date_of_birth" name="date_of_birth" type="date" />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Enregistrement…' : "Enregistrer l'athlète"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={pending}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
