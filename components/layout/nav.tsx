'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export interface NavItem {
  href: string
  label: string
}

/**
 * Sidebar navigation.
 *
 * A link is active on its own page and on anything below it, so
 * `/admin/athletes/12` still highlights "Athlètes" — except for the dashboard
 * roots, which would otherwise match every page in their section.
 */
export function Nav({ items, exact = [] }: { items: NavItem[]; exact?: string[] }) {
  const pathname = usePathname()

  return (
    <nav
      className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0"
      aria-label="Navigation principale"
    >
      {items.map((item) => {
        const isExact = exact.includes(item.href)
        const active = isExact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted hover:bg-surface-muted hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
