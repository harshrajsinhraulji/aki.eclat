'use client'

/**
 * components/layout/ObsessionsTicker.tsx
 * Fixed to top of viewport. Height: 32px.
 * Scrolls left at 30px/second continuously.
 *
 * Content: Aki's current obsessions, updated from admin panel (Firebase).
 * On hover: scroll pauses instantly. Resumes on leave.
 *
 * ♡ = --pink-hot
 * ✦ = --gold
 * Text = --pink-rose
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tickerItems as fallbackItems } from '@/lib/data'
import { database } from '@/lib/firebase'
import { ref, onValue } from 'firebase/database'
import { useTheme } from '@/lib/ThemeContext'

type TickerItem = { type: 'heart' | 'star'; text: string }

export function ObsessionsTicker() {
  const [items, setItems] = useState<TickerItem[]>(fallbackItems as TickerItem[])
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  useEffect(() => {
    if (!database) return

    const tickerRef = ref(database, 'cms/tickerItems')
    const unsubscribe = onValue(tickerRef, (snapshot) => {
      const data = snapshot.val()
      if (data && Array.isArray(data)) {
        setItems(data)
      }
    })

    return () => unsubscribe()
  }, [])

  // Duplicate the items for seamless loop
  const allItems = [...items, ...items, ...items]

  const handleItemClick = (text: string) => {
    setActiveTooltip(text)
  }

  useEffect(() => {
    if (!activeTooltip) return
    const t = setTimeout(() => setActiveTooltip(null), 2000)
    return () => clearTimeout(t)
  }, [activeTooltip])

  const trackBg = isDark ? 'rgba(10, 3, 6, 0.4)' : 'rgba(255, 245, 248, 0.4)'
  const trackBorder = isDark ? 'rgba(255, 20, 147, 0.18)' : 'rgba(173, 20, 87, 0.12)'
  const textColor = isDark ? '#FFB6D9' : '#AD1457'

  return (
    <>
      <div
        className="ticker-track"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '32px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: `1px solid ${trackBorder}`,
          background: trackBg,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'background 350ms ease, border-color 350ms ease',
        }}
      >
        <div
          className="ticker-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            /* ~28px/s: 3× items, generous padding → 44s total feels right */
            animation: 'ticker-scroll 44s linear infinite',
            willChange: 'transform',
          }}
        >
          {allItems.map((item, i) => (
            <span
              key={i}
              onClick={() => handleItemClick(item.text)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 20px',
                fontFamily: 'var(--font-figtree)',
                fontWeight: 300,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: textColor,
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'color 350ms ease, transform 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#FF1493'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = textColor
              }}
            >
              {item.type === 'heart' ? (
                <span style={{ color: '#FF1493', fontSize: '12px' }}>♡</span>
              ) : (
                <span style={{ color: '#C9A465', fontSize: '14px' }}>✦</span>
              )}
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 15 }}
            style={{
              position: 'fixed',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1001,
              background: isDark ? 'rgba(26,10,18,0.92)' : 'rgba(255,245,248,0.92)',
              border: `1px solid ${isDark ? '#FF1493' : '#AD1457'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              padding: '6px 16px',
              borderRadius: '100px',
              fontFamily: 'var(--font-figtree)',
              fontSize: '11px',
              fontWeight: 400,
              color: isDark ? '#FFF5F8' : '#2D1A2E',
              letterSpacing: '0.04em',
              pointerEvents: 'none',
            }}
          >
            Aki is obsessed with: <span style={{ fontWeight: 600, color: '#FF1493' }}>{activeTooltip}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
