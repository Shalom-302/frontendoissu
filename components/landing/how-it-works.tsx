import Image from 'next/image'

import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { SCHOOL_SPORT_IMAGE } from '@/lib/images'

const STEPS = [
  {
    title: "L'administration enregistre l'athlète",
    body: "Un seul formulaire crée le compte de connexion et la fiche athlète, dans une même opération. Il n'y a pas d'inscription publique.",
  },
  {
    title: 'Les performances sont consignées',
    body: 'Compétition, épreuve, résultat, classement et distinction. Le résultat est un nombre avec son unité, donc directement exploitable en graphique.',
  },
  {
    title: 'Chacun lit ce qui le concerne',
    body: "L'athlète suit sa progression et ses meilleurs résultats ; l'administration pilote l'ensemble par discipline, par établissement et par période.",
  },
]

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="scroll-mt-20 bg-surface">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:py-24 lg:grid-cols-2">
        <Reveal from="right" className="order-2 lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-royal-600">
            Fonctionnement
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Trois étapes, aucune saisie en double
          </h2>

          <RevealGroup className="mt-9 space-y-7" delay={0.1}>
            {STEPS.map((step, index) => (
              <RevealItem key={step.title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        <Reveal from="left" className="order-1 lg:order-2">
          <div className="relative">
            {/* Offset frame in the brand colours, echoing the arcs of the mark. */}
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-3xl bg-oissu-gradient opacity-20 blur-lg"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={SCHOOL_SPORT_IMAGE.src}
                alt={SCHOOL_SPORT_IMAGE.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
