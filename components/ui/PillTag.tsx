'use client'

/**
 * components/ui/PillTag.tsx
 * Small pill-shaped label.
 * Border-radius: 100px. Used for tags, labels, categories.
 */

import { motion } from 'framer-motion'

interface PillTagProps {
  children: React.ReactNode
  variant?: 'pink' | 'gold' | 'soft' | 'outline'
  className?: string
}

const variantStyles = {
  pink: {
    background: 'rgba(255, 20, 147, 0.1)',
    color: '#C2185B',
    border: '1px solid rgba(255, 20, 147, 0.2)',
  },
  gold: {
    background: 'rgba(201, 164, 101, 0.1)',
    color: '#C9A465',
    border: '1px solid rgba(201, 164, 101, 0.2)',
  },
  soft: {
    background: 'rgba(168, 98, 122, 0.08)',
    color: '#A8627A',
    border: '1px solid rgba(168, 98, 122, 0.15)',
  },
  outline: {
    background: 'transparent',
    color: '#AD1457',
    border: '1px solid rgba(173, 20, 87, 0.3)',
  },
}

export function PillTag({
  children,
  variant = 'soft',
  className = '',
}: PillTagProps) {
  const styles = variantStyles[variant]

  return (
    <motion.span
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '100px',
        fontFamily: 'var(--font-figtree)',
        fontWeight: 500,
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...styles,
      }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
