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

type PlushieCardProps = {
  plushie: (typeof plushies)[0]
  index: number
  isHovered: boolean
  isAnyHovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  siblingOffset: { x: number; y: number }
}

function PlushieCard({ plushie, index, isHovered, isAnyHovered, onHoverStart, onHoverEnd, siblingOffset }: PlushieCardProps) {
  const rotations = [-3, 2, -1.5, 3, -2, 1]
  const rotation = rotations[index % rotations.length]
  const [bouncing, setBouncing] = useState(false)

  return (
    <motion.div
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={() => { setBouncing(true); setTimeout(() => setBouncing(false), 600) }}
      initial={{ opacity: 0, y: 48, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{
        rotate: 0,
        y: -14,
        scale: 1.06,
        boxShadow: plushie.isSpecial
          ? '0 28px 72px rgba(255,20,147,0.35), 0 0 0 1px rgba(255,20,147,0.3)'
          : '0 24px 60px rgba(255,20,147,0.2), 0 0 0 1px rgba(255,20,147,0.2)',
        borderColor: 'rgba(255,20,147,0.4)',
      }}
      animate={{
        opacity: isAnyHovered && !isHovered ? 0.35 : 1,
        x: !isHovered && isAnyHovered ? siblingOffset.x : 0,
        y: bouncing ? -24 : (!isHovered && isAnyHovered ? siblingOffset.y : 0),
      }}
      transition={{
        default: { duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] },
        rotate: { type: 'spring', stiffness: 300, damping: 22 },
        y: bouncing ? { type: 'spring', stiffness: 400, damping: 12 } : { type: 'spring', stiffness: 200, damping: 18 },
        scale: { type: 'spring', stiffness: 300, damping: 22 },
        x: { type: 'spring', stiffness: 200, damping: 18 },
        opacity: { duration: 0.3 },
      }}
      viewport={{ once: true, margin: '-40px' }}
      style={{
        position: 'relative',
        /* clamp: 140px mobile floor → 15vw fluid → 196px ceiling.
           At 1440px with 6 cards: 6×196 + 5×20 = 1276px — fits in .plushie-grid. */
        width: 'clamp(140px, 15vw, 196px)', /* mathematically proven safe for 320px screens */
        aspectRatio: '3/4',
        background: plushie.isSpecial
          ? 'linear-gradient(145deg, #3D0A28 0%, #2D0A1E 100%)' /* Von Restorff: more vibrant so visible in both modes */
          : 'var(--card-bg)', /* white glass on blush / dark plum on near-black */
        borderRadius: '28px',
        border: plushie.isSpecial
          ? '1px solid rgba(255,20,147,0.3)'
          : '1px solid var(--card-border)',
        boxShadow: plushie.isSpecial
          ? '0 8px 32px rgba(255,20,147,0.16)'
          : '0 4px 20px var(--shadow-sm)',
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
          /* Non-special: deep plum. Special (dark card): white. */
          color: plushie.isSpecial ? '#FFFFFF' : 'var(--text-primary)',
          transition: 'color 300ms ease',
          textAlign: 'center',
          letterSpacing: '-0.01em',
        }}
      >
        {plushie.name}
      </span>

      {/* Lore — slides up on hover */}
      <AnimatePresence>
        {isHovered && (
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
              /* On blush background: use blush overlay with plum text for non-special;
                 dark overlay for the special dark card */
              background: plushie.isSpecial
                ? 'rgba(10,3,6,0.96)'
                : 'var(--bg-primary)',
              backdropFilter: 'blur(8px)',
              padding: '16px 16px 20px',
              borderTop: '1px solid rgba(255,20,147,0.15)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(12px, 1.4vw, 15px)',
                /* Plum text on blush overlay / white on dark overlay */
                color: plushie.isSpecial ? 'rgba(255,255,255,0.7)' : 'var(--text-mid)',
                transition: 'color 300ms ease',
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

const CONFETTI_PARTICLES = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * 15) * (Math.PI / 180)
  const distance = 80 + Math.random() * 120
  const targetX = Math.cos(angle) * distance
  const targetY = Math.sin(angle) * distance
  const colors = ['#FF1493', '#C2185B', '#C9A465', '#AD1457', '#00897B']
  const color = colors[i % colors.length]
  const size = 5 + Math.random() * 5
  return {
    id: i,
    x: targetX,
    y: targetY,
    color,
    size,
    delay: Math.random() * 0.15,
  }
})

export function PlushieGang() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <motion.section
      id="plushies"
      onViewportEnter={() => {
        if (!showConfetti) setShowConfetti(true)
      }}
      viewport={{ once: true, margin: '-100px' }}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 6vw, 80px)',
        /* Blush — Mere Exposure continuity */
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Confetti particles */}
      {showConfetti && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: '55%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {CONFETTI_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: 0,
                opacity: 0,
                rotate: 360 + Math.random() * 360,
              }}
              transition={{
                delay: p.delay,
                duration: 0.8 + Math.random() * 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: 'absolute',
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                borderRadius: p.id % 2 === 0 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 'clamp(40px, 7vh, 72px)', position: 'relative', zIndex: 2 }}
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
              color: '#FF1493',
            }}
          >
            05 — The Plushie Gang
          </span>
          {/* Gang count badge */}
          <span
            style={{
              fontFamily: 'var(--font-figtree)',
              fontSize: '9px',
              color: 'rgba(194,24,91,0.4)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            {plushies.length} members
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(36px, 6vw, 80px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            /* Deep plum on blush */
            color: 'var(--text-primary)',
            transition: 'color 400ms ease',
          }}
        >
          They&apos;re family,
          <br />
          <span
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              color: '#FF1493',
            }}
          >
            not decorations.
          </span>
        </h2>
      </motion.div>

      {/* Plushie grid — .plushie-grid from globals.css controls layout:
          mobile: flex-wrap center | iPad: 3 per row | desktop: 6-card single row */}
      <div
        className="plushie-grid"
        style={{ alignItems: 'flex-end', position: 'relative', zIndex: 2 }}
      >
        {plushies.map((plushie, i) => {
            /* Sibling scatter: non-hovered cards drift away from hovered card */
            const side = i % 2 === 0 ? 1 : -1
            const siblingOffset = { x: side * 8, y: 4 }
            return (
              <PlushieCard
                key={plushie.id}
                plushie={plushie}
                index={i}
                isHovered={hoveredIndex === i}
                isAnyHovered={hoveredIndex !== null}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                siblingOffset={siblingOffset}
              />
            )
          })}
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
          /* Muted mauve on blush */
          color: 'var(--text-soft)',
          transition: 'color 400ms ease',
          position: 'relative',
          zIndex: 2,
        }}
      >
        Hover over them. They have things to say.
      </motion.p>
    </motion.section>
  )
}
