'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#disciplines', label: 'Disciplines' },
  { href: '#fonctionnement', label: 'Fonctionnement' },
]

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Public header.
 *
 * Transparent over the hero, then solid once the page scrolls — the mark and
 * the links need a background to stay readable against the photograph.
 *
 * On phones the links live behind a burger. That panel is a real overlay: it
 * dims the page, takes Escape, locks the body so the page cannot drift behind
 * it, and closes as soon as the viewport moves.
 */
export function SiteHeader({ signedIn, homeHref }: { signedIn: boolean; homeHref: string }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
    // An anchor link scrolls the page; leaving the panel open on top of the
    // section the visitor just asked for would hide it.
    setOpen((current) => (current ? false : current))
  })

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const solid = scrolled || open

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid
          ? 'border-b border-border bg-surface/95 text-foreground shadow-sm backdrop-blur-md'
          : 'border-b border-transparent text-white',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
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
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className={cn(
              'grid size-10 place-items-center rounded-md transition-colors md:hidden',
              solid ? 'hover:bg-surface-muted' : 'hover:bg-white/10',
            )}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            {/* Tapping anywhere outside the panel closes it — the expected
                gesture on a phone, and it keeps the dimmed page unreachable. */}
            <motion.button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 top-16 -z-10 h-[calc(100dvh-4rem)] w-full cursor-default bg-navy-900/45 backdrop-blur-sm md:hidden"
            />
            <motion.nav
              id="menu-mobile"
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
              aria-label="Menu"
              className="border-t border-border bg-surface px-4 py-3 text-foreground shadow-lg md:hidden"
            >
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium hover:bg-surface-muted"
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
