import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** `2025-04-13` -> `13 avr. 2025`. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : DATE_FORMAT.format(date)
}

/**
 * Render a result with its unit.
 *
 * Times are shown as `12.45 s`, distances as `6.82 m`, scores as `18 pts`.
 * The API sends decimals as strings so no precision is lost in JSON.
 */
export function formatResult(result: string | number, unit: string): string {
  const value = typeof result === 'string' ? Number(result) : result
  if (Number.isNaN(value)) return `${result} ${unit}`
  const decimals = unit === 'pts' ? 0 : 2
  return `${value.toFixed(decimals)} ${unit}`
}

/** French ordinal for a ranking: 1 -> `1er`, 4 -> `4e`. */
export function formatRanking(ranking: number | null | undefined): string {
  if (!ranking) return '—'
  return ranking === 1 ? '1er' : `${ranking}e`
}

/** The school season a date belongs to — mirrors `season_of()` on the API. */
export function seasonOf(value: string): string {
  const date = new Date(value)
  const year = date.getFullYear()
  return date.getMonth() + 1 >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`
}

/** `2025-04` -> `avr. 2025`, for the period axis of the ADMIN charts. */
export function formatPeriod(period: string): string {
  const [year, month] = period.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(date)
}

/** Drop empty strings so a partial form submit does not blank out fields. */
export function pruneEmpty<T extends Record<string, unknown>>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  ) as Partial<T>
}
