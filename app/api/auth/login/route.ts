/**
 * Login endpoint of the frontend.
 *
 * Exchanges the credentials with the API and turns the returned access token
 * into httpOnly cookies. The browser never sees the token, and the response
 * carries only what the login page needs to redirect: the role.
 */

import { NextResponse } from 'next/server'

import { API_BASE_URL } from '@/lib/api-server'
import { HOME_BY_ROLE, ROLE_COOKIE, TOKEN_COOKIE, USER_COOKIE, roleOf } from '@/lib/auth'
import type { ApiResponse, LoginResponse } from '@/types'

const ONE_DAY_SECONDS = 60 * 60 * 24

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null

  if (!body?.email || !body?.password) {
    return NextResponse.json({ msg: 'Email et mot de passe requis.' }, { status: 400 })
  }

  let payload: ApiResponse<LoginResponse> | null = null
  let upstreamStatus = 502

  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', locale: 'fr' },
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: 'no-store',
    })
    upstreamStatus = upstream.status
    payload = (await upstream.json().catch(() => null)) as ApiResponse<LoginResponse> | null
    if (!upstream.ok) {
      return NextResponse.json(
        { msg: payload?.msg ?? 'Identifiants incorrects.' },
        { status: upstream.status },
      )
    }
  } catch {
    return NextResponse.json(
      { msg: "Le service d'authentification est injoignable." },
      { status: upstreamStatus },
    )
  }

  const data = payload?.data
  if (!data?.access_token) {
    return NextResponse.json({ msg: 'Réponse inattendue du service.' }, { status: 502 })
  }

  const role = roleOf(data.user)
  const session = {
    id: data.user.id,
    email: data.user.email,
    firstname: data.user.firstname,
    lastname: data.user.lastname,
    role,
  }

  const response = NextResponse.json({ role, redirectTo: HOME_BY_ROLE[role] })

  // Secure in every environment but local http, where the browser would drop
  // the cookie outright.
  const secure = process.env.NODE_ENV === 'production'
  const common = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/', maxAge: ONE_DAY_SECONDS }

  response.cookies.set(TOKEN_COOKIE, data.access_token, common)
  response.cookies.set(ROLE_COOKIE, role, common)
  response.cookies.set(USER_COOKIE, JSON.stringify(session), common)

  return response
}
