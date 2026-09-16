'use client'

import { useState } from 'react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { api } from '@/lib/api-client'
import { DISCIPLINES, MEDALS, UNITS } from '@/lib/constants'
import { pruneEmpty } from '@/lib/utils'
import type { Performance } from '@/types'

/**
 * Record or correct one result (doc §11.3).
 *
 * The same form serves both: with a `performance` it PATCHes, without it POSTs.
 * A result is a number plus a unit, not free text, so the progression charts can
 * plot it without guessing.
 */
export function PerformanceForm({
  athleteId,
  discipline,
  performance,
  onDone,
  onCancel,
}: {
  athleteId: number
  discipline?: string
  performance?: Performance
  onDone: (performance: Performance) => void
  onCancel?: () => void
}) {
  const editing = Boolean(performance)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const ranking = String(form.get('ranking') ?? '')

    const body = pruneEmpty({
      competition_name: String(form.get('competition_name') ?? ''),
      competition_date: String(form.get('competition_date') ?? ''),
      discipline: String(form.get('discipline') ?? ''),
      event: String(form.get('event') ?? ''),
      result: String(form.get('result') ?? ''),
      unit: String(form.get('unit') ?? ''),
      location: String(form.get('location') ?? ''),
      ranking: ranking ? Number(ranking) : '',
      medal: String(form.get('medal') ?? ''),
      observations: String(form.get('observations') ?? ''),
    })

    try {
      if (editing && performance) {
        await api(`/api/v1/admin/performances/${performance.id}`, { method: 'PATCH', body })
        onDone({ ...performance, ...(body as Partial<Performance>) } as Performance)
      } else {
        const created = await api<Performance>('/api/v1/admin/performances', {
          method: 'POST',
          body: { ...body, athlete_id: athleteId },
        })
        onDone(created)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'enregistrement a échoué.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Alert tone="error">{error}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5 lg:col-span-2">
          <Label htmlFor="competition_name">Compétition *</Label>
          <Input
            id="competition_name"
            name="competition_name"
            required
            defaultValue={performance?.competition_name ?? ''}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="competition_date">Date *</Label>
          <Input
            id="competition_date"
            name="competition_date"
            type="date"
            required
            defaultValue={performance?.competition_date ?? ''}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="discipline">Discipline *</Label>
          <Select
            id="discipline"
            name="discipline"
            required
            defaultValue={performance?.discipline ?? discipline ?? ''}
          >
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
          <Label htmlFor="event">Épreuve *</Label>
          <Input id="event" name="event" required defaultValue={performance?.event ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Lieu</Label>
          <Input id="location" name="location" defaultValue={performance?.location ?? ''} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="result">Résultat *</Label>
          <Input
            id="result"
            name="result"
            type="number"
            step="0.001"
            required
            defaultValue={performance?.result ?? ''}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="unit">Unité *</Label>
          <Select id="unit" name="unit" required defaultValue={performance?.unit ?? ''}>
            <option value="" disabled>
              Choisir…
            </option>
            {UNITS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ranking">Classement</Label>
          <Input
            id="ranking"
            name="ranking"
            type="number"
            min={1}
            defaultValue={performance?.ranking ?? ''}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="medal">Distinction</Label>
          <Select id="medal" name="medal" defaultValue={performance?.medal ?? ''}>
            <option value="">Aucune</option>
            {MEDALS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5 lg:col-span-2">
          <Label htmlFor="observations">Observations</Label>
          <Input
            id="observations"
            name="observations"
            defaultValue={performance?.observations ?? ''}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Ajouter la performance'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
            Annuler
          </Button>
        ) : null}
      </div>
    </form>
  )
}
