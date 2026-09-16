'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import type { AthleteFilters } from '@/types'

const ALL = ''

/**
 * Search and filters for the athlete list (doc §15).
 *
 * State lives in the URL rather than in the component, so a filtered view is
 * shareable, survives a refresh and keeps the list a server component.
 */
export function AthleteFiltersBar({ filters }: { filters: AthleteFilters }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  function apply(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    // Any filter change invalidates the current page number.
    params.delete('page')
    router.push(`/admin/athletes?${params.toString()}`)
  }

  const hasFilters = ['q', 'discipline', 'category', 'club_or_establishment', 'is_active'].some(
    (key) => searchParams.get(key),
  )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        apply({ q })
      }}
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
    >
      <div className="space-y-1.5 xl:col-span-2">
        <Label htmlFor="q">Rechercher</Label>
        <div className="flex gap-2">
          <Input
            id="q"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Nom, licence, établissement, e-mail"
          />
          <Button type="submit" variant="outline" size="icon" aria-label="Rechercher">
            <Search aria-hidden />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="discipline">Discipline</Label>
        <Select
          id="discipline"
          defaultValue={searchParams.get('discipline') ?? ALL}
          onChange={(event) => apply({ discipline: event.target.value })}
        >
          <option value={ALL}>Toutes</option>
          {filters.disciplines.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          id="category"
          defaultValue={searchParams.get('category') ?? ALL}
          onChange={(event) => apply({ category: event.target.value })}
        >
          <option value={ALL}>Toutes</option>
          {filters.categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="club_or_establishment">Établissement</Label>
        <Select
          id="club_or_establishment"
          defaultValue={searchParams.get('club_or_establishment') ?? ALL}
          onChange={(event) => apply({ club_or_establishment: event.target.value })}
        >
          <option value={ALL}>Tous</option>
          {filters.establishments.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>

      {hasFilters ? (
        <div className="flex items-end xl:col-span-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ('')
              router.push('/admin/athletes')
            }}
          >
            <X aria-hidden />
            Réinitialiser les filtres
          </Button>
        </div>
      ) : null}
    </form>
  )
}
