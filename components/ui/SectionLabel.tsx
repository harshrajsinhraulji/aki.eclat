'use client'

/**
 * components/ui/SectionLabel.tsx
 * Small uppercase label that precedes section titles.
 * Figtree 500, 10px, letter-spacing 0.24em, --text-soft.
 * Now features a premium lucide icon accent instead of a plain dot.
 */

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'
import { Sparkle } from 'lucide-react'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
  delay?: number
  icon?: React.ReactNode
}

export function SectionLabel({
  children,
  className = '',
  delay = 0,
  icon = <Sparkle size={10} color="var(--color-gold)" fill="var(--color-gold)" />,
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
      <span aria-hidden style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-figtree)',
          fontWeight: 500,
          fontSize: '10px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'var(--accent-primary)',
        }}
      >
        {children}
      </span>
    </motion.div>
  )
}
