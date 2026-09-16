import { BarChart3, ClipboardList, ShieldCheck, Trophy, Users } from 'lucide-react'

import { HoverLift, Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Card, CardContent } from '@/components/ui/card'

const FEATURES = [
  {
    icon: Users,
    title: 'Fiches athlètes',
    body: "Identité, licence, discipline, spécialité, catégorie, établissement et niveau d'études réunis sur une seule fiche.",
    accent: 'text-royal-600 bg-royal-50',
  },
  {
    icon: Trophy,
    title: 'Performances',
    body: 'Compétition, date, lieu, épreuve, résultat, classement et distinction consignés au fil de la saison.',
    accent: 'text-flame-600 bg-flame-50',
  },
  {
    icon: BarChart3,
    title: 'Évolution et statistiques',
    body: 'Progression par journée de compétition et par saison, statistiques par discipline et par période.',
    accent: 'text-palm-600 bg-palm-50',
  },
  {
    icon: ClipboardList,
    title: 'Pilotage global',
    body: 'Athlètes actifs, compétitions, médailles et établissements engagés, en un coup d’œil.',
    accent: 'text-navy-600 bg-navy-50',
  },
  {
    icon: ShieldCheck,
    title: 'Accès maîtrisé',
    body: 'Deux espaces, un seul écran de connexion. Les droits sont vérifiés côté serveur, pas seulement à l’affichage.',
    accent: 'text-royal-600 bg-royal-50',
  },
]

export function FeatureGrid() {
  return (
    <section id="fonctionnalites" className="scroll-mt-20 bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-500">
            La plateforme
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Tout ce qu&apos;il faut pour suivre une saison
          </h2>
          <p className="mt-4 text-muted">
            De l&apos;enregistrement d&apos;un athlète à la lecture de sa progression, chaque étape
            du suivi tient dans le même outil.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, accent }) => (
            <RevealItem key={title}>
              <HoverLift>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="space-y-3 py-6">
                    <span className={`grid size-11 place-items-center rounded-xl ${accent}`}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{body}</p>
                  </CardContent>
                </Card>
              </HoverLift>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
