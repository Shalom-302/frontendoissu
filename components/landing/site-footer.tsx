import Link from 'next/link'

import { Logo } from '@/components/brand/logo'

export function SiteFooter() {
  return (
    <footer className="bg-navy-900 text-white/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-sm">
            <Logo tone="light" size="md" showTagline className="text-white" />
            <p className="mt-4 text-sm leading-relaxed">
              Outil numérique de suivi et de traçabilité des performances des athlètes du sport
              scolaire et universitaire.
            </p>
          </div>

          <nav aria-label="Liens de pied de page" className="text-sm">
            <h2 className="mb-3 font-semibold text-white">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <a href="#fonctionnalites" className="hover:text-white">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#disciplines" className="hover:text-white">
                  Disciplines
                </a>
              </li>
              <li>
                <a href="#fonctionnement" className="hover:text-white">
                  Fonctionnement
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Se connecter
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed">
          <p>
            <strong className="font-semibold text-white/90">Version de démonstration.</strong> Les
            athlètes, établissements, compétitions et résultats présentés sont fictifs et ne
            représentent pas des données réelles de l&apos;OISSU.
          </p>
          <p className="mt-2">Photographies : Unsplash. © {new Date().getFullYear()} OISSU CONNECT.</p>
        </div>
      </div>
    </footer>
  )
}
