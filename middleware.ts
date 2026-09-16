/**
 * Route guard (doc §3, §4.1).
 *
 * The frontend redirects; it does not authorise. Every `/admin/*` API call is
 * checked again on the backend by `DependsAdmin`, so a forged `oissu_role`
 * cookie buys nothing but a page shell with no data.
 */

import { NextRequest, NextResponse } from 'next/server'

import { ROLE_COOKIE, TOKEN_COOKIE } from '@/lib/auth'

/** Signed-in area: everything below these prefixes needs a session. */
const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/performances', '/admin']

/** Reserved to ADMIN accounts. */
const ADMIN_PREFIX = '/admin'

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const role = request.cookies.get(ROLE_COOKIE)?.value

  // Already signed in? The login screen has nothing left to offer — unless we
  // arrived carrying the "your session expired" notice, in which case the token
  // is stale and sending it back to a dashboard would loop.
  if (pathname === '/login' && token && !request.nextUrl.searchParams.has('expired')) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin/dashboard' : '/dashboard', request.url),
    )
  }

  if (!isProtected(pathname)) return NextResponse.next()

  if (!token) {
    const login = new URL('/login', request.url)
    // Come back where the user was headed once they sign in.
    login.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(login)
  }

  if (pathname.startsWith(ADMIN_PREFIX) && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Everything except Next.js internals, the API routes (which do their own
  // auth) and static assets.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
