'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { api } from '@/lib/api-client'
import { CATEGORIES, DISCIPLINES, EDUCATION_LEVELS, GENDERS } from '@/lib/constants'
import { pruneEmpty } from '@/lib/utils'
import type { AthleteDetail } from '@/types'

/**
 * Administrative actions on one athlete (doc §11.2, §15): edit the fiche,
 * enable/disable the account, or delete the athlete entirely.
 */
export function AthleteAdminPanel({ athlete }: { athlete: AthleteDetail }) {
  const router = useRouter()
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [pending, setPending] = useState<'update' | 'status' | 'delete' | null>(null)

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(null)
    setPending('update')

    const form = new FormData(event.currentTarget)
    const body = pruneEmpty({
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
    })

    try {
      await api(`/api/v1/admin/athletes/${athlete.id}`, { method: 'PATCH', body })
      setStatus({ tone: 'success', message: 'Fiche mise à jour.' })
      router.refresh()
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Mise à jour impossible.',
      })
    } finally {
      setPending(null)
    }
  }

  async function toggleStatus() {
    const next = athlete.is_active === false
    setStatus(null)
    setPending('status')
    try {
      await api(`/api/v1/admin/athletes/${athlete.id}/status`, {
        method: 'PATCH',
        body: { is_active: next },
      })
      setStatus({
        tone: 'success',
        message: next ? 'Athlète réactivé.' : 'Athlète désactivé : la connexion est révoquée.',
      })
      router.refresh()
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Opération impossible.',
      })
    } finally {
      setPending(null)
    }
  }

  async function remove() {
    const confirmation = window.prompt(
      `Cette suppression efface le compte, la fiche et les ${athlete.performance_count} performance(s) de ${athlete.first_name} ${athlete.last_name}. Tapez le numéro de licence pour confirmer.`,
    )
    // Typing the licence is a deliberate speed bump: this deletion cascades and
    // cannot be undone from the interface.
    if (confirmation !== athlete.license_number) {
      if (confirmation !== null) {
        setStatus({ tone: 'error', message: 'Numéro de licence incorrect — rien n’a été supprimé.' })
      }
      return
    }

    setPending('delete')
    try {
      await api(`/api/v1/admin/athletes/${athlete.id}`, { method: 'DELETE' })
      router.push('/admin/athletes')
      router.refresh()
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Suppression impossible.',
      })
      setPending(null)
    }
  }

  return (
    <div className="space-y-4">
      {status ? <Alert tone={status.tone}>{status.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Modifier la fiche</CardTitle>
          <CardDescription>Identité, licence et rattachement sportif.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">Prénom</Label>
                <Input id="first_name" name="first_name" defaultValue={athlete.first_name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Nom</Label>
                <Input id="last_name" name="last_name" defaultValue={athlete.last_name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="license_number">Numéro de licence</Label>
                <Input
                  id="license_number"
                  name="license_number"
                  defaultValue={athlete.license_number}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discipline">Discipline</Label>
                <Select id="discipline" name="discipline" defaultValue={athlete.discipline}>
                  {DISCIPLINES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="speciality">Spécialité / épreuve</Label>
                <Input id="speciality" name="speciality" defaultValue={athlete.speciality ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Catégorie</Label>
                <Select id="category" name="category" defaultValue={athlete.category ?? ''}>
                  <option value="">—</option>
                  {CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="club_or_establishment">Établissement / club</Label>
                <Input
                  id="club_or_establishment"
                  name="club_or_establishment"
                  defaultValue={athlete.club_or_establishment ?? ''}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="education_level">Niveau d&apos;études</Label>
                <Select
                  id="education_level"
                  name="education_level"
                  defaultValue={athlete.education_level ?? ''}
                >
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
                <Input
                  id="nationality"
                  name="nationality"
                  defaultValue={athlete.nationality ?? ''}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender">Sexe</Label>
                <Select id="gender" name="gender" defaultValue={athlete.gender ?? ''}>
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
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  defaultValue={athlete.date_of_birth ?? ''}
                />
              </div>
            </div>

            <Button type="submit" disabled={pending === 'update'}>
              {pending === 'update' ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statut du compte</CardTitle>
          <CardDescription>
            Désactiver révoque la connexion ; la fiche et l&apos;historique sont conservés.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={toggleStatus} disabled={pending === 'status'}>
            {athlete.is_active === false ? 'Réactiver le compte' : 'Désactiver le compte'}
          </Button>
          <Button variant="danger" onClick={remove} disabled={pending === 'delete'}>
            {pending === 'delete' ? 'Suppression…' : "Supprimer l'athlète"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
