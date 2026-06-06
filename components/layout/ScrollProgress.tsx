'use client'

/**
 * components/layout/ScrollProgress.tsx
 * Fixed right edge. Full viewport height.
 * 2px wide line. Fill grows from 0% to 100% as page scrolls.
 * At 100%: tiny SVG bow appears with bounce-in spring.
 * Hidden on mobile (< 768px).
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BowSvg } from '@/components/ui/BowSvg'

function StarburstSvg({ size = 14, color = '#C9A465' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ filter: 'drop-shadow(0 0 3px rgba(201,164,101,0.5))' }} aria-hidden>
      <polygon points="12,3 17,14 7,14" />
      <polygon points="12,19 17,8 7,8" />
    </svg>
  )
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [showBow, setShowBow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0
      setProgress(pct)
      setShowBow(pct >= 0.99)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="scroll-progress-bar"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '2px',
        zIndex: 50,
        pointerEvents: 'none',
        background: 'rgba(255, 20, 147, 0.08)',
      }}
      aria-hidden
    >
      {/* Fill line */}
      <div
        className="progress-fill"
        style={{
          width: '100%',
          height: `${progress * 100}%`,
          transition: 'height 0.1s linear',
        }}
      />

      {/* Bow at the bottom when complete */}
      <AnimatePresence>
        {showBow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 14 }}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '-8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <StarburstSvg size={14} color="#C9A465" />
            </motion.div>
            <BowSvg size={16} color="#C2185B" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
