'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api-client'
import type { AthleteDetail } from '@/types'

/**
 * The narrow slice of the profile an athlete may edit themselves.
 *
 * Identity, licence, discipline and category are reference data the
 * championships are built on, so they stay under ADMIN control — the backend
 * enforces that, this form simply does not offer them.
 */
export function SelfUpdateForm({ athlete }: { athlete: AthleteDetail }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(null)
    setPending(true)

    const form = new FormData(event.currentTarget)

    try {
      await api('/api/v1/athletes/me', {
        method: 'PATCH',
        body: {
          nationality: String(form.get('nationality') ?? '') || null,
          date_of_birth: String(form.get('date_of_birth') ?? '') || null,
          photo_url: String(form.get('photo_url') ?? '') || null,
        },
      })
      setStatus({ tone: 'success', message: 'Profil mis à jour.' })
      router.refresh()
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Mise à jour impossible.',
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {status ? <Alert tone={status.tone}>{status.message}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nationality">Nationalité</Label>
          <Input id="nationality" name="nationality" defaultValue={athlete.nationality ?? ''} />
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

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="photo_url">Photo (URL)</Label>
          <Input
            id="photo_url"
            name="photo_url"
            type="url"
            placeholder="https://…"
            defaultValue={athlete.photo_url ?? ''}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? 'Enregistrement…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
