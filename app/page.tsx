import { BarChart3, ShieldCheck, Trophy, Users } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getSession } from '@/lib/auth'
import { HOME_BY_ROLE } from '@/lib/auth'

/**
 * Public home page (doc §2, §3).
 *
 * Deliberately has no sign-up call to action: athlete accounts are created by
 * an administrator, so the only door here is "Se connecter".
 */

const FEATURES = [
  {
    icon: Users,
    title: 'Fiches athlètes',
    body: 'Identité, licence, discipline, catégorie et établissement réunis sur une seule fiche.',
  },
  {
    icon: Trophy,
    title: 'Performances',
    body: 'Compétitions, résultats, classements et distinctions consignés au fil de la saison.',
  },
  {
    icon: BarChart3,
    title: 'Évolution et statistiques',
    body: "Progression par journée de compétition et par saison, par discipline et par période.",
  },
  {
    icon: ShieldCheck,
    title: 'Accès maîtrisé',
    body: 'Deux espaces, un seul écran de connexion : athlète et administration.',
  },
]

export default async function HomePage() {
  const session = await getSession()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-primary-foreground">
              OC
            </span>
            OISSU CONNECT
          </div>
          <Button asChild size="sm">
            <Link href={session ? HOME_BY_ROLE[session.role] : '/login'}>
              {session ? 'Accéder à mon espace' : 'Se connecter'}
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Sport scolaire et universitaire
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            Suivi et traçabilité des performances des athlètes
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
            OISSU CONNECT rassemble les profils des athlètes, l&apos;historique de leurs
            compétitions et les indicateurs de pilotage dans un outil numérique unique.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={session ? HOME_BY_ROLE[session.role] : '/login'}>
                {session ? 'Accéder à mon espace' : 'Se connecter'}
              </Link>
            </Button>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            L&apos;inscription n&apos;est pas publique : les comptes athlètes sont créés par
            l&apos;administration de l&apos;OISSU.
          </p>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <CardContent className="space-y-2">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm text-muted">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted">
          Version de démonstration — les données présentées sont fictives et ne représentent pas
          des données réelles de l&apos;OISSU.
        </div>
      </footer>
    </div>
  )
}
