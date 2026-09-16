import { NextRequest, NextResponse } from 'next/server'

import { ROLE_COOKIE, TOKEN_COOKIE, USER_COOKIE } from '@/lib/auth'

/**
 * Landing point for a session the API has rejected.
 *
 * A server component cannot clear cookies while rendering, so it redirects
 * here instead: this drops the dead session and then sends the visitor to the
 * login screen. Without the clearing step the cookies would still look valid to
 * `middleware.ts`, which would bounce /login straight back to the dashboard —
 * a redirect loop.
 */
export async function GET(request: NextRequest) {
  const login = new URL('/login', request.url)
  login.searchParams.set('expired', '1')

  const next = request.nextUrl.searchParams.get('next')
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    login.searchParams.set('next', next)
  }

  const response = NextResponse.redirect(login)
  for (const name of [TOKEN_COOKIE, ROLE_COOKIE, USER_COOKIE]) {
    response.cookies.set(name, '', { httpOnly: true, path: '/', maxAge: 0 })
  }
  return response
}
