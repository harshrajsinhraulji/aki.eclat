'use client'

/**
 * components/sections/ArtWords.tsx
 * Section 04 — Aki's writing. Editorial marquee poetry section.
 * Two horizontal marquee rows (opposite directions) behind a centered statement.
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const POEMS = [
  'مردہ دل',
  'I wrote this at 2am',
  'feels like fiction',
  'the sea knows',
  'I don\'t sleep, I disappear',
  'brown girl becoming',
  'aneh, I\'m just a girl',
  'pressure into diamonds',
]

const POEMS_2 = [
  'interior of my mind',
  'gold underneath',
  'too loud to be quiet',
  'soft and feral',
  'everything and nothing',
  'a girl with theories',
  'design is language',
  'loves too hard',
]

function Marquee({
  items,
  speed = 60,
  reverse = false,
}: {
  items: string[]
  speed?: number
  reverse?: boolean
}) {
  const allItems = [...items, ...items, ...items]
  const duration = allItems.length * (speed / items.length)

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <motion.div
        animate={{ x: reverse ? ['0%', '33.33%'] : ['0%', '-33.33%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 4vw, 52px)',
              color: '#E8A0B8',
              padding: '0 clamp(16px, 3vw, 32px)',
              flexShrink: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {item}
            <span
              style={{
                marginLeft: 'clamp(16px, 3vw, 32px)',
                color: '#C9A465',
                fontSize: '0.6em',
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function ArtWords() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.94, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section
      id="art"
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(80px, 14vh, 140px) 0',
        background: '#FFF0F5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(16px, 3vh, 28px)',
      }}
    >
      {/* Background watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(120px, 25vw, 380px)',
          color: 'rgba(255,20,147,0.03)',
          letterSpacing: '-0.06em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic',
        }}
      >
        words
      </div>

      {/* Top marquee row */}
      <Marquee items={POEMS} speed={55} />

      {/* Central statement */}
      <motion.div
        style={{ scale, opacity, zIndex: 2, padding: 'clamp(24px, 5vh, 56px) clamp(24px, 6vw, 80px)', textAlign: 'center' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
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
            04 — Art & Words
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(36px, 6vw, 82px)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: '#FF1493',
            marginBottom: '16px',
          }}
        >
          I write at 2am.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            color: '#C2185B',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          In Urdu, in English, in the language between sleep and awareness.
          Sometimes the only honest version of myself.
        </p>

        {/* Coming soon pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '28px',
            padding: '8px 18px',
            borderRadius: '100px',
            border: '1px solid rgba(255,20,147,0.2)',
            background: 'rgba(255,20,147,0.05)',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FF1493',
              animation: 'heartbeat 1.5s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-figtree)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#A8627A',
            }}
          >
            Writings dropping soon
          </span>
        </div>
      </motion.div>

      {/* Bottom marquee row — reversed */}
      <Marquee items={POEMS_2} speed={45} reverse />
    </section>
  )
}
