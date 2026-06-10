'use client'

/**
 * components/sections/ArtWords.tsx
 * Section 04 — Art & Words.
 *
 * ELEVATION:
 * — Background: #FFF5F8 pale blush — clean editorial canvas for typography
 * — Text colors: updated for light background
 * — Tab switcher: layoutId for active pill slide (not opacity toggle)
 * — Poem lines: each line enters individually (opacity 0→1, y:12→0, stagger 100ms)
 *   — "reading by candlelight" experience — one line at a time
 * — Essay cards: featured full-width first, then staggered grid (scale 0.98→1)
 * — Poem dividers: 1px rose line extends scaleX(0→1) on enter
 */

import { motion, AnimatePresence, useMotionValue, useTransform, useScroll, useMotionTemplate, MotionValue } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { easings } from '@/lib/motion'
import { SectionLabel } from '@/components/ui/SectionLabel'

/* ── DATA ── */
const POEMS = [
  {
    id: 'apartment',
    title: 'Apartment',
    date: '29.01.26',
    lines: [
      'At night the apartment feels alive.',
      'I hear footsteps overhead \u2014',
      "someone's routine becoming",
      'part of mine.',
      '',
      "I didn't ask for the intimacy",
      'of shared walls.',
      'It arrived anyway,',
      'the way most things do.',
    ],
  },
  {
    id: 'rain',
    title: 'Rain',
    date: '23.12.25',
    lines: [
      'I saw the rain pouring down the window,',
      'blurring the city lights into streaks',
      'of something almost beautiful.',
      '',
      'Almost.',
      '',
      "That's the word for most things",
      "I can't hold onto.",
    ],
  },
  {
    id: 'canvas',
    title: 'Canvas',
    date: '14.01.26',
    lines: [
      'The painting was finished at 2am.',
      'I called it done',
      "because I couldn't see it anymore.",
      '',
      'That is the problem with making things:',
      'you spend so long inside them',
      'you forget what outside looks like.',
    ],
  },
]

export function ArtWords() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })

  return (
    <section
      id="artwords"
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        minHeight: '100svh',
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 6vw, 80px)',
      }}
    >

      {/* Watermark — deep plum at 2%, barely there */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '15%',
          left: '-5%',
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(180px, 28vw, 400px)',
          color: 'color-mix(in srgb, var(--text-primary) 2%, transparent)',
          letterSpacing: '-0.06em',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 0.8,
        }}
      >
        thoughts
        <br />
        <span style={{ fontStyle: 'italic', marginLeft: '20vw', color: 'color-mix(in srgb, var(--text-primary) 1.5%, transparent)' }}>
          &amp; words
        </span>
      </div>

      {/* ── READING PACE INDICATOR ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--accent-primary)',
          transformOrigin: '0%',
          scaleX: scrollYProgress,
          zIndex: 100,
        }}
      />

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easings.outExpoAlt }}
        style={{ position: 'relative', zIndex: 10, marginBottom: 'clamp(40px, 6vh, 64px)' }}
      >
        <div style={{ marginBottom: '32px' }}>
          <SectionLabel>Art &amp; Words</SectionLabel>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontWeight: 'var(--dynamic-weight, 400)',
            fontSize: 'clamp(48px, 6vw, 84px)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            transition: 'color 400ms ease, font-weight 200ms ease-out',
            marginBottom: '24px',
          }}
        >
          I write at
          <br />
          <span
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              color: 'var(--accent-hot)',
            }}
          >
            2am.
          </span>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            color: 'var(--text-mid)',
            lineHeight: 1.65,
            transition: 'color 400ms ease',
            maxWidth: '48ch',
          }}
        >
          In English, in silence, in the language between sleep and awareness.
          Sometimes the only honest version of myself.
        </p>
      </motion.div>

      {/* ── POEMS ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <PoemsView />
      </div>
    </section>
  )
}

/* ── Poem Focus Overlay ── */
function PoemFocusOverlay({
  poem,
  onClose,
}: {
  poem: (typeof POEMS)[0]
  onClose: () => void
}) {
  // Dismiss on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  return (
    <motion.div
      key="poem-focus"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      className="poem-focus-overlay"
      aria-modal="true"
      role="dialog"
      aria-label={`Reading: ${poem.title}`}
      onMouseMove={(e) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }}
      onMouseLeave={() => {
        mouseX.set(-1000)
        mouseY.set(-1000)
      }}
    >
      {/* Physical Candlelight Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, var(--badge-primary-bg), transparent 80%)`,
        }}
      />

      <motion.div
        initial={{ scale: 0.92, y: 32, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '560px',
          width: '90vw',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '24px',
          padding: 'clamp(32px, 5vw, 56px)',
          boxShadow: '0 32px 80px var(--shadow-sm), 0 0 0 1px var(--card-border-hover)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <motion.h3
              animate={{
                letterSpacing: ['-0.01em', '0.04em', '-0.01em'],
                textShadow: [
                  '0px 0px 8px var(--card-border-hover)',
                  '0px 0px 16px var(--badge-primary-border)',
                  '0px 0px 8px var(--card-border-hover)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{
                fontFamily: 'var(--font-bodoni-moda)',
                fontStyle: 'italic',
                fontSize: 'clamp(24px, 3vw, 36px)',
                color: 'var(--accent-primary)',
                margin: 0,
              }}
            >
              {poem.title}
            </motion.h3>
            <p style={{
              fontFamily: 'var(--font-figtree)',
              fontSize: '10px',
              color: 'var(--text-soft)',
              letterSpacing: '0.14em',
              margin: '4px 0 0',
            }}>
              {poem.date}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--badge-primary-bg)',
              border: '1px solid var(--badge-primary-border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              fontSize: '16px',
              transition: 'all 200ms ease',
            }}
            aria-label="Close poem"
          >
            ×
          </button>
        </div>

        {/* Poem lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} onMouseLeave={() => mouseY.set(-1000)}>
          {poem.lines.map((line, i) =>
            line === '' ? (
              <div key={`br-${i}`} style={{ height: '20px' }} />
            ) : (
              <FocusLine key={`focus-${poem.id}-${i}`} line={line} i={i} mouseY={mouseY} />
            )
          )}
        </div>

        {/* Dismiss hint */}
        <p style={{
          marginTop: '32px',
          fontFamily: 'var(--font-figtree)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-soft)',
          textAlign: 'center',
        }}>
          press Esc or click outside to close
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ── FocusLine — dynamic blur based on mouse proximity ── */
function FocusLine({ line, i, mouseY }: { line: string; i: number; mouseY: MotionValue<number> }) {
  const lineRef = useRef<HTMLParagraphElement>(null)
  const yCenter = useMotionValue(0)

  useEffect(() => {
    if (!lineRef.current) return
    const rect = lineRef.current.getBoundingClientRect()
    yCenter.set(rect.top + rect.height / 2)
  }, [yCenter])

  const filter = useTransform(mouseY, (y: number) => {
    if (y < 0) return 'blur(0px)'
    const dist = Math.abs(y - yCenter.get())
    const b = dist < 40 ? 0 : Math.min((dist - 40) * 0.04, 3)
    return `blur(${b}px)`
  })

  const opacity = useTransform(mouseY, (y: number) => {
    if (y < 0) return 1
    const dist = Math.abs(y - yCenter.get())
    const o = dist < 40 ? 1 : Math.max(1 - (dist - 40) * 0.005, 0.25)
    return o
  })

  return (
    <motion.p
      ref={lineRef}
      initial={{ opacity: 0, x: -12, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        fontFamily: 'var(--font-instrument-serif)',
        fontSize: 'clamp(18px, 2vw, 24px)',
        color: 'var(--text-primary)',
        lineHeight: 1.65,
        margin: 0,
        filter,
        opacity,
        willChange: 'filter, opacity',
      }}
    >
      <motion.span
        initial={{ filter: 'blur(8px)' }}
        animate={{ filter: 'blur(0px)' }}
        transition={{ delay: 0.1 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
        style={{ display: 'inline-block' }}
      >
        {line}
      </motion.span>
    </motion.p>
  )
}

/* ── Poems View — reading by candlelight ── */
function PoemsView() {
  const [focusPoem, setFocusPoem] = useState<(typeof POEMS)[0] | null>(null)

  return (
    <>
      <AnimatePresence>
        {focusPoem && <PoemFocusOverlay poem={focusPoem} onClose={() => setFocusPoem(null)} />}
      </AnimatePresence>

      <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {POEMS.map((poem, poemIndex) => (
          <div key={poem.id}>
            {/* Poem entry */}
            <div style={{ padding: 'clamp(32px, 5vh, 48px) 0' }}>
              {/* Poem metadata */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, ease: easings.outExpoAlt }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  cursor: 'pointer',
                }}
                onClick={() => setFocusPoem(poem)}
                role="button"
                aria-label={`Read ${poem.title} in focus mode`}
                data-hover="link"
                title="Click to read in focus mode"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-bodoni-moda)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(20px, 2.5vw, 28px)',
                    color: 'var(--accent-primary)',
                    letterSpacing: '-0.01em',
                    textDecoration: 'underline',
                    textDecorationStyle: 'dotted',
                    textDecorationColor: 'var(--badge-primary-border)',
                    textUnderlineOffset: '4px',
                  }}
                >
                  {poem.title}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-figtree)',
                    fontSize: '10px',
                    color: 'var(--text-soft)',
                    transition: 'color 400ms ease',
                    letterSpacing: '0.14em',
                  }}
                >
                  {poem.date}
                </span>
                <span style={{
                  fontFamily: 'var(--font-figtree)',
                  fontSize: '8px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--badge-primary-text)',
                }}>
                  ▶ focus
                </span>
              </motion.div>

              {/* Poem lines — each enters individually. Never hidden once revealed. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {poem.lines.map((line, lineIndex) =>
                  line === '' ? (
                    // Empty line = stanza break
                    <div key={`br-${lineIndex}`} style={{ height: '16px' }} />
                  ) : (
                    <motion.p
                      key={`${poem.id}-${lineIndex}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-8px' }}
                      transition={{
                        delay: lineIndex * 0.08,
                        duration: 0.5,
                        ease: [0.25, 1, 0.5, 1], // power2.out
                      }}
                      style={{
                        fontFamily: 'var(--font-instrument-serif)',
                        fontSize: 'clamp(17px, 1.8vw, 22px)',
                        color: 'var(--text-primary)',
                        transition: 'color 400ms ease',
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {line}
                    </motion.p>
                  )
                )}
              </div>
            </div>

            {/* Divider: thin rose line extends left-to-right on entry */}
            {poemIndex < POEMS.length - 1 && (
              <div style={{ position: 'relative', width: '100%', height: '17px', display: 'flex', alignItems: 'center', margin: '12px 0' }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: easings.outExpoAlt }}
                  style={{
                    height: '1px',
                    background: 'var(--card-border)',
                    transformOrigin: 'left',
                    width: '100%',
                  }}
                />
                <motion.span
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.4, type: 'spring' }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'var(--badge-secondary-text)',
                    fontSize: '11px',
                    lineHeight: 1,
                    background: 'var(--bg-primary)',
                    padding: '0 8px',
                    userSelect: 'none',
                  }}
                >
                  ✦
                </motion.span>
              </div>
            )}
          </div>
        ))}

      {/* Link to full archive */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ paddingTop: '32px' }}
      >
        <Link
          href="/writings"
          style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            textDecoration: 'none',
          }}
          data-hover="link"
        >
          read the full archive →
        </Link>
      </motion.div>
    </div>
    </>
  )
}
