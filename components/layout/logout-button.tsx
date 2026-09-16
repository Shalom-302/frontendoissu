'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function signOut() {
    setPending(true)
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    // refresh() drops the cached server render of the signed-in shell, so the
    // next page never flashes stale user data.
    router.replace('/login')
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={signOut} disabled={pending}>
      <LogOut aria-hidden />
      <span className="hidden sm:inline">{pending ? 'Déconnexion…' : 'Se déconnecter'}</span>
    </Button>
  )
}
