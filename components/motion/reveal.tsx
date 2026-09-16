'use client'

import { type HTMLMotionProps, motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * Entrance animations for the landing page.
 *
 * Everything here reads `useReducedMotion()` and collapses to a plain fade — or
 * to nothing at all — when the visitor has asked their system for less motion.
 * Animation is decoration: the page has to read the same without it.
 */

const EASE = [0.22, 1, 0.36, 1] as const

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
}

export interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  /** Where the element travels from. */
  from?: Direction
  delay?: number
  duration?: number
  /** Replay every time the element scrolls back into view. */
  repeat?: boolean
}

export function Reveal({
  children,
  from = 'up',
  delay = 0,
  duration = 0.55,
  repeat = false,
  className,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion()
  const offset = reduced ? {} : OFFSETS[from]

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount: 0.25 }}
      transition={{ duration: reduced ? 0.2 : duration, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Reveals its children one after another.
 *
 * Direct children must be `<RevealItem>` — the stagger is driven by variants,
 * which only reach elements that declare the matching ones.
 */
export function RevealGroup({
  children,
  delay = 0,
  gap = 0.09,
  className,
  ...props
}: Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: React.ReactNode
  delay?: number
  gap?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  from = 'up',
  className,
  ...props
}: Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: React.ReactNode
  from?: Direction
}) {
  const reduced = useReducedMotion()
  const offset = reduced ? {} : OFFSETS[from]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/** Lifts a card on hover, and does nothing at all under reduced motion. */
export function HoverLift({
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<'div'>, 'children'> & { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn('h-full', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
