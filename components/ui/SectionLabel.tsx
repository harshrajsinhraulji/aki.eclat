'use client'

/**
 * components/ui/SectionLabel.tsx
 * Small uppercase label that precedes section titles.
 * Figtree 500, 10px, letter-spacing 0.24em, --text-soft.
 * Optional gold accent dot before text.
 */

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function SectionLabel({
  children,
  className = '',
  delay = 0,
}: SectionLabelProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      className={`flex items-center gap-2 ${className}`}
    >
      {/* Gold accent dot */}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold, #C9A465)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-figtree)',
          fontWeight: 500,
          fontSize: '10px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'var(--color-text-soft, #A8627A)',
        }}
      >
        {children}
      </span>
    </motion.div>
  )
}
