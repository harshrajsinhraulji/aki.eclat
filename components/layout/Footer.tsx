'use client'

/**
 * components/layout/Footer.tsx
 * Minimal, warm. Stays in character — not corporate.
 */

import { BowSvg } from '@/components/ui/BowSvg'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: '#FFF0F5',
        borderTop: '1px solid rgba(255, 20, 147, 0.08)',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
      role="contentinfo"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontVariationSettings: '"wght" 400, "opsz" 48',
            fontSize: '1.4rem',
            color: '#FF1493',
            letterSpacing: '-0.02em',
          }}
        >
          Aki
        </span>
        <BowSvg size={18} color="#C2185B" />
      </div>

      <p
        style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: '14px',
          color: '#C2185B',
          textAlign: 'center',
        }}
      >
        aneh, I&apos;m just a girl 🎀
      </p>

      <p
        style={{
          fontFamily: 'var(--font-figtree)',
          fontWeight: 300,
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#A8627A',
          textAlign: 'center',
        }}
      >
        &copy; {year}{' '}Aki&apos;s World &middot; Sri Lanka &times; London
      </p>
    </footer>
  )
}
