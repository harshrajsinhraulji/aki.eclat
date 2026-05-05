'use client'

/**
 * components/layout/VisitorCounter.tsx
 * Fixed bottom-right. Live visitor count via Firebase Realtime Database.
 *
 * Falls back gracefully to showing "1" when:
 *   - Firebase not configured (no databaseURL)
 *   - Network error
 *   - Any exception
 *
 * Uses Firebase onDisconnect() so presence auto-cleans when tab closes.
 */

import { useState, useEffect } from 'react'

export function VisitorCounter() {
  const [count, setCount] = useState<number>(1)

  useEffect(() => {
    let mounted = true
    let unsubPresence: (() => void) | null = null
    let unsubConnected: (() => void) | null = null

    const init = async () => {
      try {
        const { database } = await import('@/lib/firebase')

        // Guard — gracefully skip if database not configured
        if (!database) {
          return
        }

        const { ref, onValue, onDisconnect, set } = await import('firebase/database')

        const userId = `user_${Math.random().toString(36).slice(2, 10)}`
        const userStatusRef = ref(database, `/presence/${userId}`)
        const connectedRef = ref(database, '.info/connected')

        // Presence: set on connect, remove on disconnect
        const unsubC = onValue(connectedRef, (snap) => {
          if (!mounted) return
          if (snap.val() === true) {
            onDisconnect(userStatusRef)
              .remove()
              .then(() => {
                if (mounted) set(userStatusRef, { ts: Date.now() })
              })
              .catch(() => {
                // Silence — fallback already showing 1
              })
          }
        })
        unsubConnected = () => unsubC()

        // Count watchers
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

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '36px',
        padding: '0 14px',
        borderRadius: '100px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 20, 147, 0.14)',
        boxShadow: '0 4px 16px rgba(255, 20, 147, 0.1)',
        fontFamily: 'var(--font-figtree)',
        fontWeight: 300,
        fontSize: '11px',
        color: '#6B2D4A',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {/* Heartbeat SVG */}
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="#C2185B"
        style={{ animation: 'heartbeat 1.1s ease-in-out infinite', flexShrink: 0 }}
        aria-hidden
      >
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
      </svg>

      <span>
        <span style={{ fontWeight: 600, color: '#1A0A12' }}>{count}</span>
        {' '}{count === 1 ? 'person' : 'people'}{' '}in Aki&apos;s world
      </span>
    </div>
  )
}
