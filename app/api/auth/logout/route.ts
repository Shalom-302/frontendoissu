/** Logout: tell the API to revoke the token, then clear the session cookies. */

import { NextResponse } from 'next/server'

import { API_BASE_URL } from '@/lib/api-server'
import { ROLE_COOKIE, TOKEN_COOKIE, USER_COOKIE, getToken } from '@/lib/auth'

export async function POST() {
  const token = await getToken()

  if (token) {
    // Best effort: the session cookies are cleared below whatever happens, so a
    // backend hiccup can never leave the user stuck in a signed-in shell.
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, locale: 'fr' },
      cache: 'no-store',
    }).catch(() => null)
  }

  const response = NextResponse.json({ ok: true })
  for (const name of [TOKEN_COOKIE, ROLE_COOKIE, USER_COOKIE]) {
    response.cookies.set(name, '', { httpOnly: true, path: '/', maxAge: 0 })
  }
  return response
}
