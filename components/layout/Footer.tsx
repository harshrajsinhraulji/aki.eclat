'use client'

/**
 * components/layout/Footer.tsx
 * The closing statement. Peak-End Rule: the last thing they see
 * is what they carry away. This must be unforgettable.
 *
 * ANIMATION SYSTEM:
 * — "Aki" logotype: letters enter individually, 120ms stagger (heavier than hero 80ms)
 *   Scale 0.85→1.0 with anticipation spring. The heaviness signals finality.
 * — "aneh, I'm just a girl 🎀": fades up 500ms after logotype
 * — Year + origin: 300ms after tagline, barely visible — not the point
 * — "aneh." final whisper: 400ms after year. Arrives last. IS the point.
 *
 * EASTER EGG:
 * — Clicking the "aneh." logotype triggers the BowSvg to spin (css animation, 400ms)
 *   and fires a soft tick sound via Web Audio API (50ms, no file dependency)
 */

import { motion } from 'framer-motion'
import { BowSvg } from '@/components/ui/BowSvg'
import { easings } from '@/lib/motion'
import { useState, useCallback, useEffect } from 'react'

const LOGOTYPE = 'aki.'

function playTick() {
  try {
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.12)
  } catch {
    /* AudioContext blocked — no-op */
  }
}

export function Footer() {
  const [year, setYear] = useState('')
  const [bowSpin, setBowSpin] = useState(false)

  /* Hydration-safe year — never causes mismatch */
  useEffect(() => setYear(String(new Date().getFullYear())), [])

  const handleAnehClick = useCallback(() => {
    playTick()
    setBowSpin(true)
    setTimeout(() => setBowSpin(false), 600)
  }, [])

  const handleAnehDoubleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <footer
      role="contentinfo"
      style={{
        /* Blush — the last thing. Matches the first thing. Peak-End Rule. */
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        borderTop: '1px solid rgba(255, 20, 147, 0.08)',
        padding: 'clamp(72px, 12vh, 120px) 24px clamp(40px, 6vh, 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(16px, 2.5vh, 24px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.018,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: '300px 300px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* ── LOGOTYPE — staggered character entrance ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'default',
          position: 'relative',
          zIndex: 1,
        }}
        onClick={handleAnehClick}
        onDoubleClick={handleAnehDoubleClick}
        whileHover={{ scale: 1.02 }}
        title="double-click to return to top"
      >
        {LOGOTYPE.split('').map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.85 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 180,
                  damping: 15,
                  /* 120ms stagger per letter — heavier than hero 80ms. Signals finality. */
                },
              },
            }}
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontVariationSettings: '"wght" 400, "opsz" 48',
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: '#FF1493',
              letterSpacing: '-0.02em',
              display: 'inline-block',
              willChange: 'transform',
            }}
          >
            {char}
          </motion.span>
        ))}

        {/* Bow — spins 360° on click (easter egg) */}
        <motion.span
          animate={{
            rotate: bowSpin ? 360 : 0,
            scale: bowSpin ? 1.4 : 1,
          }}
          transition={{
            rotate: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
            scale: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
          }}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <BowSvg size={22} color="#C2185B" />
        </motion.span>
      </motion.div>

      {/* ── TAGLINE — fades up 300ms after logotype stagger complete ── */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: 0.72, duration: 0.6, ease: easings.outExpoAlt }} /* 6 letters × 120ms = 720ms stagger total */
        style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(14px, 1.5vw, 18px)',
          color: '#C2185B',
          textAlign: 'center',
          letterSpacing: '0.005em',
        }}
      >
        aneh, I&apos;m just a girl 🎀
      </motion.p>

      {/* ── YEAR + ORIGIN ── */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.02, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-figtree)',
          fontWeight: 300,
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-soft)',
          transition: 'color 400ms ease',
          textAlign: 'center',
        }}
      >
        &copy; {year || '2026'}{' '}Aki&apos;s World &middot; 🇱🇰 &times; 🇬🇧
      </motion.p>

      {/* ── FINAL WHISPER: "aneh." — arrives last. IS the point. Heartbeats every 5s. ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontStyle: 'italic',
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'lowercase',
            color: 'rgba(194,24,91,0.3)',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, delay: 3, ease: 'easeInOut' }}
            style={{ display: 'inline-block' }}
          >
            aneh.
          </motion.span>
        </motion.p>
      </div>
    </footer>
  )
}
