import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Logo } from '@/components/brand/logo'
import { LogoutButton } from '@/components/layout/logout-button'
import { Nav, type NavItem } from '@/components/layout/nav'
import { Badge } from '@/components/ui/badge'
import { displayName, getSession } from '@/lib/auth'

/** Left-hand navigation, per space (doc §3). */
const NAV: Record<'user' | 'admin', NavItem[]> = {
  user: [
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/performances', label: 'Mes performances' },
    { href: '/profile', label: 'Mon profil' },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Tableau de bord' },
    { href: '/admin/athletes', label: 'Athlètes' },
    { href: '/admin/performances', label: 'Performances' },
  ],
}

const DASHBOARD_ROOTS = ['/dashboard', '/admin/dashboard']

/**
 * Signed-in application frame.
 *
 * `middleware.ts` already redirects anonymous visitors; the session check here
 * is what makes that a guarantee rather than a convention, and it gives the
 * shell the user it needs to render.
 */
export async function AppShell({
  space,
  children,
}: {
  space: 'user' | 'admin'
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (space === 'admin' && session.role !== 'admin') redirect('/dashboard')

  const home = session.role === 'admin' ? '/admin/dashboard' : '/dashboard'

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div className="h-0.5 bg-oissu-gradient" />
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4">
          <Logo href={home} size="sm" />

          {/* The identity block is the first thing to go on a phone: the name
              and the email wrapped into the logo before this. */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="hidden min-w-0 text-right text-sm leading-tight sm:block">
              <div className="truncate font-medium">{displayName(session)}</div>
              <div className="truncate text-xs text-muted">{session.email}</div>
            </div>
            <Badge
              variant={session.role === 'admin' ? 'default' : 'outline'}
              className="whitespace-nowrap"
            >
              {session.role === 'admin' ? (
                <>
                  <span className="sm:hidden">Admin</span>
                  <span className="hidden sm:inline">Administrateur</span>
                </>
              ) : (
                'Athlète'
              )}
            </Badge>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="-mx-4 px-4 lg:mx-0 lg:w-56 lg:shrink-0 lg:px-0">
          <Nav items={NAV[space]} exact={DASHBOARD_ROOTS} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 text-xs text-muted">
          Données de démonstration fictives — elles ne représentent pas des données réelles de
          l&apos;OISSU.
        </div>
      </footer>
    </div>
  )
}
