'use client'

/**
 * components/layout/VisitorCounter.tsx
 * Fixed bottom-right. Live visitor count via Firebase Realtime Database.
 *
 * Light background update:
 * — Glass pill: rgba(255,255,255,0.85) — matches vinyl player
 * — SVG heart: #C2185B deep rose, organic heartbeat pulse
 * — Text: Plus Jakarta Sans 300, 11px, #8B5A7A
 *
 * Falls back gracefully to showing "1" when:
 *   - Firebase not configured (no databaseURL)
 *   - Network error
 *   - Any exception
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/ThemeContext'

export function VisitorCounter() {
  const [count, setCount] = useState<number>(1)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    let mounted = true
    let unsubPresence: (() => void) | null = null
    let unsubConnected: (() => void) | null = null

    const init = async () => {
      try {
        const { database } = await import('@/lib/firebase')
        if (!database) return

        const { ref, onValue, onDisconnect, set } = await import('firebase/database')
        const userId = `user_${Math.random().toString(36).slice(2, 10)}`
        const userStatusRef = ref(database, `/presence/${userId}`)
        const connectedRef = ref(database, '.info/connected')

        const unsubC = onValue(connectedRef, (snap) => {
          if (!mounted) return
          if (snap.val() === true) {
            onDisconnect(userStatusRef)
              .remove()
              .then(() => {
                if (mounted) set(userStatusRef, { ts: Date.now() })
              })
              .catch(() => {})
          }
        })
        unsubConnected = () => unsubC()

        const presenceRef = ref(database, '/presence')
        const unsubP = onValue(presenceRef, (snap) => {
          if (!mounted) return
          const val = snap.val()
          const n = val ? Object.keys(val).length : 0
          setCount(Math.max(1, n))
        })
        unsubPresence = () => unsubP()
      } catch {
        // Firebase unavailable — already showing fallback "1"
      }
    }

    init()
    return () => {
      mounted = false
      unsubPresence?.()
      unsubConnected?.()
    }
  }, [])

  // Derived styles based on dark/light
  const bgStyle = isDark ? 'rgba(10,3,6,0.85)' : 'rgba(255,255,255,0.85)'
  const borderStyle = isDark ? '1px solid rgba(255,20,147,0.18)' : '1px solid rgba(255,20,147,0.10)'
  const shadowStyle = isDark
    ? '0 4px 16px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)'
    : '0 4px 16px rgba(255,20,147,0.08), 0 2px 4px rgba(0,0,0,0.03)'
  const textColor = isDark ? 'rgba(255,182,217,0.65)' : '#8B5A7A'
  const countColor = isDark ? 'rgba(255,240,245,0.92)' : '#2D1A2E'
  const heartFill = isDark ? '#FF1493' : '#C2185B'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.9, duration: 0.6 }}
      style={{
        position: 'fixed',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        right: '24px',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '36px',
        padding: '0 16px',
        borderRadius: '20px',
        background: bgStyle,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: borderStyle,
        boxShadow: shadowStyle,
        fontFamily: 'var(--font-figtree)',
        fontWeight: 300,
        fontSize: '11px',
        color: textColor,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        transition: 'background 350ms ease, border-color 350ms ease, box-shadow 350ms ease, color 350ms ease',
      }}
    >
      {/* Organic heartbeat SVG heart */}
      <motion.svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={heartFill}
        animate={{
          scale: [1, 1.25, 1, 1.15, 1, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn', 'easeOut'],
          times: [0, 0.14, 0.28, 0.42, 0.56, 1],
          repeatDelay: 0.4,
        }}
        style={{ flexShrink: 0, transition: 'fill 350ms ease' }}
        aria-hidden
      >
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
      </motion.svg>

      <span>
        <span style={{ fontWeight: 500, color: countColor, transition: 'color 350ms ease' }}>{count}</span>
        {' '}{count === 1 ? 'person' : 'people'}{' '}in Aki&apos;s world
      </span>
    </motion.div>
  )
}
