'use client'

/**
 * components/ui/MagneticCard.tsx
 * Wrapper that applies magnetic tilt physics to any card.
 * Used globally — every card in the site goes through this.
 *
 * Shadow moves opposite to tilt — card appears to lift.
 * On leave: springs back with slight overshoot (stiffness:200, damping:20).
 */

import { motion } from 'framer-motion'
import { useMagneticTilt } from '@/hooks/useMagneticTilt'

interface MagneticCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-hover'?: string
}

export function MagneticCard({
  children,
  className = '',
  style = {},
  ...props
}: MagneticCardProps) {
  const { cardRef, rotateX, rotateY, scale, onMouseMove, onMouseEnter, onMouseLeave } =
    useMagneticTilt()

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-hover="card"
      {...props}
    >
      {children}
    </motion.div>
  )
}
