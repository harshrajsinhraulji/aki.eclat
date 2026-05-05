'use client'

/**
 * components/layout/ObsessionsTicker.tsx
 * Fixed to top of viewport. Height: 32px.
 * Scrolls left at 30px/second continuously.
 *
 * Content: Aki's current obsessions, updated from admin panel.
 * On hover: scroll pauses instantly. Resumes on leave.
 *
 * ♡ = --pink-hot
 * ✦ = --gold
 * Text = --pink-rose
 */

import { tickerItems } from '@/lib/data'

export function ObsessionsTicker() {
  // Duplicate the items for seamless loop
  const allItems = [...tickerItems, ...tickerItems]

  return (
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
        borderBottom: '1px solid rgba(255, 20, 147, 0.1)',
        background: 'rgba(255, 240, 245, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="ticker-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          animation: 'ticker-scroll 40s linear infinite',
          willChange: 'transform',
        }}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 20px',
              fontFamily: 'var(--font-figtree)',
              fontWeight: 300,
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: '#AD1457',
            }}
          >
            {item.type === 'heart' ? (
              <span style={{ color: '#FF1493', fontSize: '12px' }}>♡</span>
            ) : (
              <span style={{ color: '#C9A465', fontSize: '10px' }}>✦</span>
            )}
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
