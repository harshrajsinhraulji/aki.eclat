'use client'

/**
 * components/ui/AnimatedTitle.tsx
 * Large section title with word-by-word stagger reveal.
 * Uses Bodoni Moda at specified opsz and wght.
 * Each word slides up from overflow:hidden container.
 */

import { motion } from 'framer-motion'
import { stagger, easings, durations } from '@/lib/motion'

interface AnimatedTitleProps {
  children: string
  className?: string
  delay?: number
  opsz?: number
  wght?: number
  gradient?: boolean
}

export function AnimatedTitle({
  children,
  className = '',
  delay = 0,
  opsz = 48,
  wght = 500,
  gradient = false,
}: AnimatedTitleProps) {
  const words = children.split(' ')

  return (
    <div
      className={`flex flex-wrap gap-x-[0.25em] leading-none ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <div key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: durations.section,
              delay: delay + i * stagger.siblings,
              ease: easings.outExpo,
            }}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-bodoni-moda)',
              fontVariationSettings: `"wght" ${wght}, "opsz" ${opsz}`,
              ...(gradient
                ? {
                    background:
                      'linear-gradient(180deg, #FF1493 0%, #C2185B 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                : {}),
            }}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  )
}
