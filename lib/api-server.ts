/**
 * Server-side API client.
 *
 * Used by server components and route handlers. It talks to the FastAPI backend
 * over the internal network (`API_INTERNAL_URL`), so no CORS is involved and the
 * access token stays on the server.
 */

import 'server-only'

import { redirect } from 'next/navigation'

import { getToken } from '@/lib/auth'
import type { ApiResponse } from '@/types'

/**
 * Inside Docker the two containers reach each other by service name; on bare
 * metal both URLs are just localhost. `NEXT_PUBLIC_API_URL` is the browser-facing
 * one and is only used as a fallback here.
 */
export const API_BASE_URL = (
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:8000'
).replace(/\/$/, '')

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /** Send the stored bearer token. Off for the login call. */
  auth?: boolean
}

/** Call the API and unwrap its `{code, msg, data}` envelope. */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options

  const requestHeaders = new Headers(headers)
  requestHeaders.set('Accept', 'application/json')
  requestHeaders.set('locale', 'fr')
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json')

  if (auth) {
    const token = await getToken()
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    // Dashboards must reflect what an admin just changed, so nothing is cached
    // by default. Opt back in per call with `next: { revalidate }`.
    cache: rest.cache ?? 'no-store',
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok) {
    throw new ApiError(payload?.msg ?? `Erreur ${response.status}`, response.status)
  }
  return payload?.data as T
}

/**
 * Turn a failed `apiFetch` into something to show the visitor.
 *
 * A 401 means the session is gone — expired, or revoked because the account
 * signed in somewhere else. There is nothing useful to render in that case, so
 * this hands over to /api/auth/expired, which clears the dead cookies before
 * sending the visitor to the login screen. Redirecting straight to /login would
 * leave those cookies in place and the middleware would bounce them back.
 *
 * Call it from a `catch` block: `redirect()` throws, and that throw must reach
 * Next.js, which it does as long as the catch does not wrap it in another
 * `try`.
 */
export function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) redirect('/api/auth/expired')
    return error.message
  }
  return 'Le service est momentanément injoignable. Réessayez dans un instant.'
}
