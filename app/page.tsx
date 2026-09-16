import { CtaBand } from '@/components/landing/cta-band'
import { DisciplineMosaic } from '@/components/landing/discipline-mosaic'
import { FeatureGrid } from '@/components/landing/feature-grid'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { HOME_BY_ROLE, getSession } from '@/lib/auth'

/**
 * Public home page (doc §2, §3).
 *
 * Deliberately has no sign-up call to action anywhere: athlete accounts are
 * created by an administrator, so the only door is "Se connecter". A visitor who
 * is already signed in is offered their own space instead.
 */
export default async function HomePage() {
  const session = await getSession()
  const signedIn = Boolean(session)
  const homeHref = session ? HOME_BY_ROLE[session.role] : '/login'

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader signedIn={signedIn} homeHref={homeHref} />

      <main className="flex-1">
        <Hero signedIn={signedIn} homeHref={homeHref} />
        <FeatureGrid />
        <DisciplineMosaic />
        <HowItWorks />
        <CtaBand signedIn={signedIn} homeHref={homeHref} />
      </main>

      <SiteFooter />
    </div>
  )
}
