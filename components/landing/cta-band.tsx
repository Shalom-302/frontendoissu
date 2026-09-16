import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { CTA_IMAGE } from '@/lib/images'

export function CtaBand({ signedIn, homeHref }: { signedIn: boolean; homeHref: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-800 text-white">
      <Image
        src={CTA_IMAGE.src}
        alt={CTA_IMAGE.alt}
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {/* Dark enough on the left for white type, clear on the right so the
          photograph still reads as a photograph. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/94 via-navy-900/72 to-navy-900/35" />

      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Prêt à retrouver chaque résultat de la saison ?
          </h2>
          <p className="mt-4 text-white/80">
            Connectez-vous à votre espace athlète ou à l&apos;espace d&apos;administration. Un seul
            écran de connexion, le reste suit votre rôle.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-flame-500 text-white hover:bg-flame-600">
              <Link href={signedIn ? homeHref : '/login'}>
                {signedIn ? 'Accéder à mon espace' : 'Se connecter'}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 top-0 h-1 bg-oissu-gradient" />
    </section>
  )
}
