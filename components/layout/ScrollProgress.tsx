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
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '2px',
        zIndex: 50,
        pointerEvents: 'none',
        background: 'rgba(255, 20, 147, 0.08)',
        // Hide on mobile via JS — safer than Tailwind classes
        display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'block',
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '1px',
              transform: 'translateX(50%)',
            }}
          >
            <BowSvg size={16} color="#C2185B" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
