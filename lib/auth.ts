/**
 * Session handling.
 *
 * The access token never reaches client-side JavaScript: the login route
 * handler stores it in an httpOnly cookie, `middleware.ts` reads it to guard
 * routes, and every browser request goes through `/api/proxy/*`, which attaches
 * the token server-side. An XSS on the frontend therefore cannot exfiltrate a
 * usable credential.
 */

import { cookies } from 'next/headers'

import type { Role, User } from '@/types'

export const TOKEN_COOKIE = 'oissu_token'
export const ROLE_COOKIE = 'oissu_role'
export const USER_COOKIE = 'oissu_user'

/** Where each role lands after login (doc §4.1). */
export const HOME_BY_ROLE: Record<Role, string> = {
  user: '/dashboard',
  admin: '/admin/dashboard',
}

/** Highest-privilege role held by an account. */
export function roleOf(user: Pick<User, 'roles'>): Role {
  return user.roles?.some((role) => role.name?.toLowerCase() === 'admin') ? 'admin' : 'user'
}

export interface SessionUser {
  id: number
  email: string
  firstname: string | null
  lastname: string | null
  role: Role
}

/** The signed-in user, or `null`. Server-side only. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  const raw = store.get(USER_COOKIE)?.value
  if (!raw || !store.get(TOKEN_COOKIE)?.value) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    // A cookie we cannot parse is a cookie we cannot trust.
    return null
  }
}

/** The bearer token to forward to the API. Server-side only. */
export async function getToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(TOKEN_COOKIE)?.value ?? null
}

/** Display name, falling back to the email local part. */
export function displayName(user: SessionUser): string {
  const full = [user.firstname, user.lastname].filter(Boolean).join(' ').trim()
  return full || user.email.split('@')[0]
}
