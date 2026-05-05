'use client'

/**
 * components/sections/Universe.tsx
 * Section 02 — The Universe.
 *
 * Elegantly fits within 100vh. Uses a horizontal accordion layout on desktop
 * and vertical accordion on mobile. Hovering (or tapping) a card expands it
 * while gracefully shrinking the others.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { easings } from '@/lib/motion'

const CARDS = [
  {
    id: 1,
    title: 'Design',
    description:
      'Minimalism with warmth. Brutalism with softness. Spaces that make me feel something before I understand why.',
    bg: '#FFF0F5',
    tag: 'Interior Design',
    accent: '#FF1493',
  },
  {
    id: 2,
    title: 'Gaming',
    description:
      "Diamond 1. I'm not just playing — I'm mastering. Perfect CS, macro calls, outplaying the jungler at 3am.",
    bg: '#FCE4EC',
    tag: 'League of Legends',
    accent: '#C2185B',
  },
  {
    id: 3,
    title: 'Mind',
    description:
      "Psychology practitioner. I'm fascinated by cognitive biases, decision theory, and why humans are beautifully irrational.",
    bg: '#F8BBD0',
    tag: 'Psychology · 7cups',
    accent: '#AD1457',
  },
]

export function Universe() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section
      id="universe"
      className="w-full relative overflow-hidden flex flex-col justify-center"
      style={{
        minHeight: '100svh',
        background: 'linear-gradient(135deg, #2A0815 0%, #15000A 100%)',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px)',
      }}
    >
      {/* Seamless gradient edge — blends from Coconut's pink into dark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, #FFF0F5, #2A0815)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easings.outExpo }}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: 'clamp(32px, 6vh, 64px)',
        }}
      >
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(255,20,147,0.6)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 500,
            fontSize: '10px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255,20,147,0.6)',
          }}
        >
          02 — The Universe
        </span>
      </motion.div>

      {/* Interactive Accordion Layout */}
      <div
        className="flex flex-col md:flex-row relative z-10 mx-auto w-full max-w-[1400px]"
        style={{
          gap: 'clamp(16px, 2vw, 24px)',
          height: 'clamp(400px, 60vh, 600px)',
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {CARDS.map((card, index) => {
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null

          return (
            <motion.div
              key={card.id}
              layout
              onMouseEnter={() => setHoveredIndex(index)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                layout: { type: 'spring', stiffness: 200, damping: 25 },
                opacity: { duration: 0.6, delay: 0.1 * index },
                y: { duration: 0.6, delay: 0.1 * index, ease: easings.outExpo },
              }}
              style={{
                position: 'relative',
                flex: isHovered ? 2.5 : isAnyHovered ? 0.7 : 1,
                background: card.bg,
                borderRadius: '24px',
                padding: 'clamp(24px, 4vw, 40px)',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isHovered 
                  ? '0 24px 60px rgba(255,20,147,0.2)' 
                  : '0 8px 40px rgba(255,20,147,0.05)',
                border: '1px solid rgba(255,255,255,0.4)',
                transformOrigin: 'center',
                transition: 'box-shadow 0.4s ease',
              }}
            >
              <motion.div
                layout="position"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 600,
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.24em',
                    color: card.accent,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.tag}
                </span>
                
                <h3
                  style={{
                    fontFamily: 'var(--font-bodoni-moda)',
                    fontSize: 'clamp(36px, 4vw, 64px)',
                    lineHeight: 1,
                    color: '#1A0A12',
                    letterSpacing: '-0.025em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.title}
                </h3>
              </motion.div>

              <AnimatePresence mode="wait">
                {(!isAnyHovered || isHovered) && (
                  <motion.p
                    key="desc"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      fontFamily: 'var(--font-figtree)',
                      fontWeight: 300,
                      fontSize: 'clamp(15px, 1.6vw, 18px)',
                      lineHeight: 1.65,
                      color: '#6B2D4A',
                      maxWidth: '40ch',
                      marginTop: '20px',
                      overflow: 'hidden',
                    }}
                  >
                    {card.description}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Watermark number */}
              <motion.div
                layout="position"
                aria-hidden
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '24px',
                  fontFamily: 'var(--font-bodoni-moda)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(48px, 6vw, 72px)',
                  color: `${card.accent}12`,
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {String(card.id).padStart(2, '0')}
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
