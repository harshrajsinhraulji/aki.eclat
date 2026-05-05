'use client'

/**
 * components/sections/PlushieGang.tsx
 * Section 05 — Aki's plushie collection.
 * A premium editorial display. Each plushie is a floating card with emoji,
 * name, and lore. Hover: card tilts and lore slides up.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { plushies } from '@/lib/data'

function PlushieCard({ plushie, index }: { plushie: (typeof plushies)[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  const rotations = [-3, 2, -1.5, 3, -2, 1]
  const rotation = rotations[index % rotations.length]

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 48, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{ rotate: 0, y: -10, scale: 1.04 }}
      transition={{
        default: { duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] },
        rotate: { type: 'spring', stiffness: 300, damping: 22 },
        y: { type: 'spring', stiffness: 300, damping: 22 },
        scale: { type: 'spring', stiffness: 300, damping: 22 },
      }}
      viewport={{ once: true, margin: '-40px' }}
      style={{
        position: 'relative',
        width: 'clamp(140px, 18vw, 220px)',
        aspectRatio: '3/4',
        background: plushie.isSpecial
          ? 'linear-gradient(145deg, #FFF0F5 0%, #FCE4EC 100%)'
          : 'rgba(255,255,255,0.85)',
        borderRadius: '28px',
        border: plushie.isSpecial
          ? '1px solid rgba(255,20,147,0.3)'
          : '1px solid rgba(168,98,122,0.14)',
        boxShadow: plushie.isSpecial
          ? '0 8px 32px rgba(255,20,147,0.16)'
          : '0 4px 20px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        cursor: 'default',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Special tag */}
      {plushie.isSpecial && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontFamily: 'var(--font-figtree)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#FF1493',
            fontWeight: 600,
          }}
        >
          ✦
        </div>
      )}

      {/* Emoji */}
      <div
        style={{
          fontSize: 'clamp(44px, 7vw, 72px)',
          lineHeight: 1,
          marginBottom: '16px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))',
        }}
      >
        {plushie.emoji}
      </div>

      {/* Name */}
      <span
        style={{
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(14px, 1.8vw, 20px)',
          color: '#1A0A12',
          textAlign: 'center',
          letterSpacing: '-0.01em',
        }}
      >
        {plushie.name}
      </span>

      {/* Lore — slides up on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(255,240,245,0.96)',
              backdropFilter: 'blur(8px)',
              padding: '16px 16px 20px',
              borderTop: '1px solid rgba(255,20,147,0.12)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(12px, 1.4vw, 15px)',
                color: '#6B2D4A',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {plushie.lore}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function PlushieGang() {
  return (
    <section
      id="plushies"
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px)',
        background: '#FFF0F5',
        overflow: 'hidden',
      }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 'clamp(40px, 7vh, 72px)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
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
            05 — The Plushie Gang
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(36px, 6vw, 80px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: '#FF1493',
          }}
        >
          They&apos;re family,
          <br />
          <span
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              color: '#C2185B',
            }}
          >
            not decorations.
          </span>
        </h2>
      </motion.div>

      {/* Plushie grid — wrapped flex for responsive */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(16px, 2.5vw, 28px)',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        }}
      >
        {plushies.map((plushie, i) => (
          <PlushieCard key={plushie.id} plushie={plushie} index={i} />
        ))}
      </div>

      {/* Footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          marginTop: 'clamp(40px, 6vh, 60px)',
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(16px, 1.8vw, 22px)',
          color: '#A8627A',
        }}
      >
        Hover over them. They have things to say.
      </motion.p>
    </section>
  )
}
