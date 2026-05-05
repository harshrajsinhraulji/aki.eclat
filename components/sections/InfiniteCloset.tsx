'use client'

/**
 * components/sections/InfiniteCloset.tsx
 * Section 03 — Horizontal scroll gallery of Aki's aesthetic.
 * 300vh sticky — as you scroll down, the gallery slides left.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const items = [
  {
    id: 1,
    title: 'Oversized Bows',
    desc: 'A necessity, not an accessory. The bigger, the better.',
    emoji: '🎀',
    color: '#FFF0F5',
  },
  {
    id: 2,
    title: 'Vintage Corsets',
    desc: 'Structured chaos. Historically accurate, intentionally dramatic.',
    emoji: '🪡',
    color: '#FCE4EC',
  },
  {
    id: 3,
    title: 'Silk Slips',
    desc: 'For lounging, looking ethereal, and quietly dominating.',
    emoji: '🕊',
    color: '#F8BBD0',
  },
  {
    id: 4,
    title: 'Chunky Boots',
    desc: 'Combat with coquette. The contradiction that makes sense.',
    emoji: '🥾',
    color: '#F3E5F5',
  },
  {
    id: 5,
    title: 'Pearl Chokers',
    desc: 'Classic with a bite. Demure at first glance, feral underneath.',
    emoji: '🦢',
    color: '#E8EAF6',
  },
]

export function InfiniteCloset() {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })

  // Translate from 0% to -60% (leaves the last card centred)
  const x = useTransform(scrollYProgress, [0, 1], ['4vw', '-64vw'])

  return (
    <section
      id="closet"
      ref={targetRef}
      style={{ position: 'relative', height: '300vh', background: '#FFF0F5' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Section label */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(80px, 10vh, 120px)',
            left: 'clamp(24px, 6vw, 80px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#C9A465',
            }}
          />
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
            03 — The Infinite Closet
          </span>
        </div>

        {/* Horizontal scroll track */}
        <motion.div
          style={{
            x,
            display: 'flex',
            gap: 'clamp(16px, 2vw, 28px)',
            willChange: 'transform',
          }}
        >
          {items.map((item, i) => (
            <ClosetCard key={item.id} item={item} index={i} />
          ))}
          {/* Right padding spacer */}
          <div style={{ width: '10vw', flexShrink: 0 }} />
        </motion.div>

        {/* Drag hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(168,98,122,0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          scroll to browse
        </motion.p>
      </div>
    </section>
  )
}

function ClosetCard({ item, index }: { item: (typeof items)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -8, rotate: index % 2 === 0 ? 1.2 : -1.2 }}
      style={{
        flexShrink: 0,
        width: 'clamp(280px, 28vw, 400px)',
        height: 'clamp(380px, 55vh, 520px)',
        background: item.color,
        borderRadius: '24px',
        padding: 'clamp(28px, 4vw, 44px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 24px rgba(255,20,147,0.07)',
        border: '1px solid rgba(255,20,147,0.09)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Card number watermark */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          fontFamily: 'var(--font-bodoni-moda)',
          fontStyle: 'italic',
          fontSize: '72px',
          color: 'rgba(255,20,147,0.06)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {String(item.id).padStart(2, '0')}
      </div>

      <div>
        {/* Emoji */}
        <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', marginBottom: '20px', lineHeight: 1 }}>
          {item.emoji}
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            color: '#C2185B',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {item.title}
        </h3>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-figtree)',
          fontWeight: 300,
          fontSize: 'clamp(15px, 1.5vw, 19px)',
          lineHeight: 1.65,
          color: '#6B2D4A',
        }}
      >
        {item.desc}
      </p>
    </motion.div>
  )
}
