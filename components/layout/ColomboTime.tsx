'use client'

/**
 * components/layout/ColomboTime.tsx
 * Shows Colombo time, hidden by default.
 * Appears above the VinylPlayer on hover (slides up 8px, opacity 0→1).
 * Updates every second. clearInterval on unmount.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ColomboTimeProps {
  visible: boolean
}

export function ColomboTime({ visible }: ColomboTimeProps) {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const colombo = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now)
      setTime(colombo)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="colombo-time"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            height: '32px',
            padding: '0 14px',
            borderRadius: '100px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255, 20, 147, 0.14)',
            boxShadow: '0 4px 16px rgba(255, 20, 147, 0.1)',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: '11px',
            color: '#6B2D4A',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <span>🇱🇰</span>
          <span style={{ fontWeight: 500, color: '#1A0A12', letterSpacing: '0.04em' }}>
            {time}
          </span>
          <span style={{ color: '#A8627A' }}>Colombo</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
