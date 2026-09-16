import type { Metadata, Viewport } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'OISSU CONNECT',
    template: '%s · OISSU CONNECT',
  },
  description:
    'Suivi et traçabilité des performances des athlètes du sport scolaire et universitaire.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
