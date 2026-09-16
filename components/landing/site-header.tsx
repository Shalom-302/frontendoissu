'use client'

import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#disciplines', label: 'Disciplines' },
  { href: '#fonctionnement', label: 'Fonctionnement' },
]

/**
 * Public header.
 *
 * Transparent over the hero, then solid once the page scrolls — the mark and the
 * links need a background to stay readable against the photograph.
 */
export function SiteHeader({ signedIn, homeHref }: { signedIn: boolean; homeHref: string }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 24))

  const solid = scrolled || open

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid
          ? 'border-b border-border bg-surface/90 text-foreground backdrop-blur-md'
          : 'border-b border-transparent text-white',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Logo href="/" tone={solid ? 'plain' : 'light'} priority />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections de la page">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                solid ? 'hover:bg-surface-muted' : 'hover:bg-white/10',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className={cn(!solid && 'bg-white text-navy-600 hover:bg-white/90')}
          >
            <Link href={signedIn ? homeHref : '/login'}>
              {signedIn ? 'Mon espace' : 'Se connecter'}
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className={cn(
              'grid size-9 place-items-center rounded-md md:hidden',
              solid ? 'hover:bg-surface-muted' : 'hover:bg-white/10',
            )}
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-surface px-4 py-2 text-foreground md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-surface-muted"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </motion.header>
  )
}
