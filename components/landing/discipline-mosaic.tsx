'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { Reveal } from '@/components/motion/reveal'
import { DISCIPLINE_TILES } from '@/lib/images'

const EASE = [0.22, 1, 0.36, 1] as const

export function DisciplineMosaic() {
  const reduced = useReducedMotion()

  return (
    <section id="disciplines" className="scroll-mt-20 bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-500">
            Disciplines
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Six disciplines, une même fiche de suivi
          </h2>
          <p className="mt-4 text-muted">
            Sports individuels ou collectifs, chaque résultat est enregistré avec son unité — un
            temps, une distance ou des points — pour rester comparable d&apos;une saison à
            l&apos;autre.
          </p>
        </Reveal>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {DISCIPLINE_TILES.map((tile) => (
            <motion.li
              key={tile.name}
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
              }}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl"
            >
              {tile.src ? (
                <>
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/25 to-transparent" />
                </>
              ) : (
                // No dependable free photo of handball existed, and labelling a
                // photo of another sport "Handball" would be worse than none.
                // The tile carries the brand arcs instead.
                <div className="absolute inset-0 bg-gradient-to-br from-flame-500 via-royal-600 to-palm-500">
                  <div className="absolute -right-10 -top-10 size-40 rounded-full border-[10px] border-white/25 border-b-transparent border-l-transparent" />
                  <div className="absolute -bottom-12 -left-8 size-40 rounded-full border-[10px] border-white/20 border-r-transparent border-t-transparent" />
                </div>
              )}

              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-white drop-shadow">
                {tile.name}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
