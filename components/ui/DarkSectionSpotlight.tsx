'use client'

/**
 * components/ui/DarkSectionSpotlight.tsx
 * A cursor-following radial glow that appears over dark sections.
 * Adds depth and atmosphere on Universe, Confessions, and Contact.
 * GPU-only: uses transform (x/y) via Framer Motion spring values.
 */

import { useMotionValue, useSpring, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useTheme } from '@/lib/ThemeContext'

export function DarkSectionSpotlight() {
  const { theme } = useTheme()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 28 })
  const y = useSpring(rawY, { stiffness: 60, damping: 28 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  if (theme !== 'midnight' && theme !== 'dusk') return null

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1,
        width: '700px',
        height: '700px',
        marginLeft: '-350px',
        marginTop: '-350px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255,20,147,0.04) 0%, transparent 65%)',
        x,
        y,
      }}
    />
  )
}
