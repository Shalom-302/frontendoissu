'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, LineChart, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { CountUp } from '@/components/motion/count-up'
import { Button } from '@/components/ui/button'
import { HERO_IMAGE } from '@/lib/images'

const EASE = [0.22, 1, 0.36, 1] as const

/** Structural facts about the V1 — not invented metrics. */
const FACTS = [
  { value: 6, label: 'disciplines suivies' },
  { value: 4, label: 'catégories d’âge' },
  { value: 2, label: 'espaces, un seul login' },
]

export function Hero({ signedIn, homeHref }: { signedIn: boolean; homeHref: string }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // A slow drift on the photograph while the text scrolls away at full speed.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08])

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy-800 text-white">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 -z-20">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
      </motion.div>

      {/* Navy wash, heaviest on the left where the type sits and clearing to the
          right so the photograph is still a photograph. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/95 via-navy-900/72 to-navy-900/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900/85 via-transparent to-navy-900/55" />

      {/* The two arcs of the mark, blown up as a background motif. */}
      {!reduced ? (
        <>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, rotate: -25, scale: 0.85 }}
            animate={{ opacity: 0.5, rotate: 0, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="pointer-events-none absolute -left-40 top-10 -z-10 size-[34rem] rounded-full border-[14px] border-flame-500/40 border-b-transparent border-l-transparent"
          />
          <motion.div
            aria-hidden
            initial={{ opacity: 0, rotate: 25, scale: 0.85 }}
            animate={{ opacity: 0.45, rotate: 0, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.15, ease: EASE }}
            className="pointer-events-none absolute -right-48 bottom-0 -z-10 size-[38rem] rounded-full border-[14px] border-palm-500/40 border-r-transparent border-t-transparent"
          />
        </>
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-48">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
          className="max-w-3xl"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-flame-500" />
            Sport scolaire et universitaire
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="mt-5 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Chaque performance
            <span className="block text-flame-400">compte, et se retrouve.</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            OISSU CONNECT réunit les fiches des athlètes, l&apos;historique de leurs compétitions et
            les indicateurs de pilotage dans un seul outil. Des minimes aux seniors, de la journée
            de compétition à la saison complète.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="bg-flame-500 text-white hover:bg-flame-600">
              <Link href={signedIn ? homeHref : '/login'}>
                {signedIn ? 'Accéder à mon espace' : 'Se connecter'}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <a href="#fonctionnalites">Découvrir la plateforme</a>
            </Button>
          </motion.div>

          <motion.ul
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/15 pt-7"
          >
            {FACTS.map((fact) => (
              <li key={fact.label}>
                <div className="text-3xl font-bold tabular-nums">
                  <CountUp value={fact.value} />
                </div>
                <div className="mt-0.5 text-xs uppercase tracking-wide text-white/65">
                  {fact.label}
                </div>
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
            }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" aria-hidden />
              Inscription non publique : les comptes sont créés par l&apos;administration
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LineChart className="size-3.5" aria-hidden />
              Évolution par journée de compétition et par saison
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* The three colours of the mark, as the rule closing the hero. */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-oissu-gradient" />
    </section>
  )
}
