import { redirect } from 'next/navigation'

/**
 * `/admin` is not a page of its own — the admin space starts at its dashboard.
 * Sending visitors there beats a 404 for anyone who trims the URL by hand.
 */
export default function AdminIndex() {
  redirect('/admin/dashboard')
}
