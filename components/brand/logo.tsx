import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const SIZES = { sm: 32, md: 40, lg: 56, xl: 88 } as const

/**
 * The OISSU mark.
 *
 * `tone="light"` wraps it in a white tile. That is not decoration: the runner in
 * the mark is navy, so on a dark background it would melt into it. The tile is
 * how the logo stays legible over the hero and the footer.
 */
export function LogoMark({
  size = 'md',
  tone = 'plain',
  className,
  priority = false,
}: {
  size?: keyof typeof SIZES
  tone?: 'plain' | 'light'
  className?: string
  priority?: boolean
}) {
  const px = SIZES[size]

  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center',
        tone === 'light' && 'rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/5',
        className,
      )}
    >
      <Image
        src="/oissu-logo.png"
        alt="Logo de l'OISSU"
        width={px}
        height={px}
        priority={priority}
        className="h-auto w-full"
        style={{ width: px, height: px }}
      />
    </span>
  )
}

/** Mark + wordmark, optionally linked. */
export function Logo({
  href,
  size = 'md',
  tone = 'plain',
  showTagline = false,
  className,
  priority = false,
}: {
  href?: string
  size?: keyof typeof SIZES
  tone?: 'plain' | 'light'
  showTagline?: boolean
  className?: string
  priority?: boolean
}) {
  const content = (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={size} tone={tone} priority={priority} />
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap text-[0.95rem] font-bold tracking-tight">
          OISSU<span className="text-flame-500"> CONNECT</span>
        </span>
        {showTagline ? (
          <span className="mt-1 whitespace-nowrap text-[0.68rem] font-medium uppercase tracking-[0.14em] opacity-70">
            Sport scolaire et universitaire
          </span>
        ) : null}
      </span>
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  ) : (
    content
  )
}
