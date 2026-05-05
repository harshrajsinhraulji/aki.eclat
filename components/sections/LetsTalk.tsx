'use client'

/**
 * components/sections/LetsTalk.tsx
 * Final section — the closing act. Contact CTA.
 * Full viewport. Pink-to-crimson gradient. Centre-aligned.
 * Giant headline. Social links. "Email me" CTA.
 */

import { motion } from 'framer-motion'
import { BowSvg } from '@/components/ui/BowSvg'
import { easings, durations } from '@/lib/motion'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', symbol: '◈' },
  { label: 'Twitter', href: '#', symbol: '◇' },
  { label: 'LinkedIn', href: '#', symbol: '◉' },
]

export function LetsTalk() {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        background: 'linear-gradient(160deg, #FFF0F5 0%, #FCE4EC 35%, #F8BBD0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px)',
        overflow: 'hidden',
      }}
    >
      {/* Large decorative background text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(100px, 22vw, 320px)',
          color: 'rgba(255,20,147,0.05)',
          letterSpacing: '-0.06em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic',
          lineHeight: 1,
        }}
      >
        hello
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '860px',
        }}
      >
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easings.outExpo }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}
        >
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C9A465' }} />
          <span
            style={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 500,
              fontSize: '10px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#A8627A',
            }}
          >
            06 — Let&apos;s Talk
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: durations.section, ease: easings.outExpo, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(48px, 9vw, 120px)',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: '#FF1493',
            marginBottom: '24px',
          }}
        >
          You found me.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.component, ease: easings.outExpo, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 2.6vw, 32px)',
            color: '#C2185B',
            lineHeight: 1.4,
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          aneh, now what?
          <BowSvg size={28} color="#C2185B" swing={true} swingReverse={false} />
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="mailto:aki@example.com"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: durations.component, ease: easings.outExpo, delay: 0.4 }}
          whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(255,20,147,0.3)' }}
          whileTap={{ scale: 0.97 }}
          data-hover="link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: 'clamp(14px, 2vh, 20px) clamp(32px, 5vw, 56px)',
            background: '#FF1493',
            color: 'white',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 500,
            fontSize: 'clamp(13px, 1.4vw, 16px)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: '100px',
            boxShadow: '0 8px 28px rgba(255,20,147,0.22)',
            transition: 'background 200ms',
          }}
        >
          Say hello
          <span style={{ fontSize: '1.2em' }}>✦</span>
        </motion.a>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            justifyContent: 'center',
          }}
        >
          {SOCIAL_LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ y: -4, color: '#FF1493' }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              data-hover="link"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 300,
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#A8627A',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 200ms',
              }}
            >
              <span style={{ fontSize: '1.2em', opacity: 0.6 }}>{link.symbol}</span>
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Closing note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 'clamp(48px, 8vh, 80px)',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: 'rgba(168,98,122,0.5)',
            textTransform: 'uppercase',
          }}
        >
          Sri Lankan blood · London soul · Interior Design student
        </motion.p>
      </div>
    </section>
  )
}
