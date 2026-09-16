'use client'

/**
 * Browser-side API client.
 *
 * It never calls the backend directly: requests go to `/api/proxy/*` on the
 * Next.js server, which attaches the httpOnly access token and forwards them.
 * Two consequences, both wanted: the token is unreachable from JavaScript, and
 * the browser makes same-origin requests, so no CORS pre-flight in any
 * environment.
 */

import type { ApiResponse } from '@/types'

export class ClientApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ClientApiError'
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

/** Call the API through the proxy and unwrap its envelope. */
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options

  const response = await fetch(`/api/proxy${path}`, {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok) {
    throw new ClientApiError(payload?.msg ?? `Erreur ${response.status}`, response.status)
  }
  return payload?.data as T
}

/** Build a query string, skipping empty values. */
export function query(params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === '' || value === null || value === undefined) continue
    search.set(key, String(value))
  }
  const serialised = search.toString()
  return serialised ? `?${serialised}` : ''
}
