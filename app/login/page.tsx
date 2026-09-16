import type { Metadata } from 'next'
import Link from 'next/link'

import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Connexion' }

/**
 * Single sign-in screen for both roles (doc §4.1).
 *
 * The backend decides the role; the form only follows the redirection it is
 * handed. There is no "Créer un compte" link, by design.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-sm text-primary-foreground">
            OC
          </span>
          OISSU CONNECT
        </Link>

        <h1 className="text-xl font-semibold">Connexion</h1>
        <p className="mt-1 text-sm text-muted">
          Accédez à votre espace athlète ou à l&apos;espace d&apos;administration.
        </p>

        <LoginForm className="mt-6" next={next} />

        <p className="mt-6 text-center text-xs text-muted">
          Vous n&apos;avez pas de compte ? Les comptes athlètes sont créés par
          l&apos;administration de l&apos;OISSU.
        </p>
      </div>
    </div>
  )
}
