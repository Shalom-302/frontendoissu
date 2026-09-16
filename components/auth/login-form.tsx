'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Credentials form.
 *
 * It posts to `/api/auth/login` (the frontend route handler), which is what
 * holds the token: the browser only ever learns where to go next.
 */
export function LoginForm({ className, next }: { className?: string; next?: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const form = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          password: String(form.get('password') ?? ''),
        }),
      })
      const payload = (await response.json().catch(() => null)) as
        | { msg?: string; redirectTo?: string }
        | null

      if (!response.ok) {
        setError(payload?.msg ?? 'Connexion impossible.')
        return
      }

      // `next` comes from the middleware redirect. Only accept an in-app path,
      // so a crafted ?next=https://evil.example cannot turn login into an open
      // redirect.
      const target =
        next && next.startsWith('/') && !next.startsWith('//')
          ? next
          : (payload?.redirectTo ?? '/dashboard')

      router.replace(target)
      router.refresh()
    } catch {
      setError('Le service est momentanément injoignable.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      {error ? <Alert tone="error">{error}</Alert> : null}

      <div className="space-y-1.5">
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="vous@exemple.ci"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </Button>
    </form>
  )
}
