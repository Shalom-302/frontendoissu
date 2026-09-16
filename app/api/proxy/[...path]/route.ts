/**
 * Authenticated pass-through to the OISSU CONNECT API.
 *
 * Browser code calls `/api/proxy/<api path>`; this handler attaches the
 * httpOnly access token and forwards the request. Same-origin from the
 * browser's point of view, so there is no CORS pre-flight and no token in
 * JavaScript reach.
 */

import { NextRequest, NextResponse } from 'next/server'

import { API_BASE_URL } from '@/lib/api-server'
import { ROLE_COOKIE, TOKEN_COOKIE, USER_COOKIE, getToken } from '@/lib/auth'

const FORWARDED_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] as const

async function forward(request: NextRequest, path: string[]) {
  const token = await getToken()
  if (!token) {
    return NextResponse.json({ msg: 'Session expirée. Reconnectez-vous.' }, { status: 401 })
  }

  const target = `${API_BASE_URL}/${path.join('/')}${request.nextUrl.search}`
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    locale: 'fr',
  })

  const hasBody = request.method !== 'GET' && request.method !== 'DELETE'
  const body = hasBody ? await request.text() : undefined
  if (body) headers.set('Content-Type', 'application/json')

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: body || undefined,
    cache: 'no-store',
  })

  const payload = await upstream.text()
  const response = new NextResponse(payload, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
  })

  // An expired or revoked token must not leave a half-signed-in shell behind:
  // drop the session so the next navigation lands on /login.
  if (upstream.status === 401) {
    for (const name of [TOKEN_COOKIE, ROLE_COOKIE, USER_COOKIE]) {
      response.cookies.set(name, '', { httpOnly: true, path: '/', maxAge: 0 })
    }
  }

  return response
}

type Context = { params: Promise<{ path: string[] }> }

async function handler(request: NextRequest, context: Context) {
  if (!FORWARDED_METHODS.includes(request.method as (typeof FORWARDED_METHODS)[number])) {
    return NextResponse.json({ msg: 'Méthode non autorisée.' }, { status: 405 })
  }
  const { path } = await context.params
  return forward(request, path)
}

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE }
