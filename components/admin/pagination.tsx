import Link from 'next/link'

import { Button } from '@/components/ui/button'

/**
 * Page navigation for a list.
 *
 * Plain links, so paging works without JavaScript and each page has its own URL.
 */
export function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
  total,
}: {
  basePath: string
  searchParams: Record<string, string | undefined>
  page: number
  totalPages: number
  total: number
}) {
  function hrefFor(target: number): string {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') params.set(key, value)
    }
    params.set('page', String(target))
    return `${basePath}?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-sm">
      <p className="text-muted">
        {total} résultat{total > 1 ? 's' : ''} · page {page} sur {Math.max(totalPages, 1)}
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" disabled={page <= 1}>
          <Link href={hrefFor(page - 1)} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : 0}>
            Précédent
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
          <Link
            href={hrefFor(page + 1)}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : 0}
          >
            Suivant
          </Link>
        </Button>
      </div>
    </div>
  )
}
