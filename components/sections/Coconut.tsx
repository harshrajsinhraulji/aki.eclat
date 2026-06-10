'use client'

/**
 * components/sections/Coconut.tsx
 * Section 01 — About.
 *
 * ELEVATION: Pale blush background #FFF5F8 — Mere Exposure Effect.
 * This section is the visitor's first deep contact with Aki's world
 * after the hero. Same canvas. Same warmth. Immediate trust.
 *
 * ANIMATIONS (per design psychology brief):
 * — Photo: enters from x:-40px, parallax on scroll. Hover: inner image 1→1.04 scale.
 * — Text: enters from x:+40px, 120ms delay after photo.
 * — Pull quote: Von Restorff — enters straight (rotate:0), then settles to -1.5°
 *   over 600ms with anticipation easing. The visitor WATCHES the quote tilt.
 *   The rotation is a live event, not a static style. It is noticed.
 * — Tag pills: spring stagger 70ms per pill, scale 0.85→1.0 (hand-placed feeling).
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { easings } from '@/lib/motion'
import { Gamepad2, BookOpen, Waves } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'

const TAGS = [
  { label: 'Interior Design', type: 'secondary' },
  { label: 'League of Legends', type: 'primary' },
  { label: 'Psychology', type: 'secondary' },
  { label: 'Sri Lankan', type: 'primary' },
  { label: '7cups Listener', type: 'secondary' },
]

const FUN_FACTS = [
  { text: '100+ hrs in LoL', icon: <Gamepad2 size={14} /> },
  { text: '40+ books read', icon: <BookOpen size={14} /> },
  { text: 'Freediver at heart', icon: <Waves size={14} /> },
]

const QUOTES = [
  "I design spaces that make people feel something before they understand why.",
  "Diamond 1 because I study opponents like I study floor plans.",
  "Sri Lankan blood, London education, coconut at heart.",
]

export function Coconut() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const [photoHovered, setPhotoHovered] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  /* Subtle parallax on image: 8% shift total. Small enough to feel physical. */
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <section
      id="coconut"
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        padding: 'clamp(40px, 8vh, 120px) clamp(24px, 5vw, 80px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient radial glow — blush-toned, not dark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '20%',
          left: '8%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,182,217,0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="coconut-grid"
        style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}
      >
        {/* ── IMAGE — parallax wrapper ── */}
        <motion.div
          className="coconut-image"
          style={{ y: imageY }}
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true, margin: '-10px' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Polaroid style container with Brownian Motion */}
          <motion.div
            onMouseEnter={() => setPhotoHovered(true)}
            onMouseLeave={() => setPhotoHovered(false)}
            onClick={() => setLightboxOpen(true)}
            animate={photoHovered ? { y: 0, x: 0, rotate: 0 } : {
              y: [0, -8, 4, 0],
              x: [0, 3, -3, 0],
              rotate: [0, 1, -1, 0]
            }}
            transition={{
              y: photoHovered ? { duration: 0.4 } : { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              x: photoHovered ? { duration: 0.4 } : { duration: 7.2, repeat: Infinity, ease: 'easeInOut' },
              rotate: photoHovered ? { duration: 0.4 } : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '2 / 3',
              maxHeight: '72vh',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--card-bg)',
              border: '8px solid var(--card-bg)',
              /* On light bg: deeper, more polaroid-style shadow */
              boxShadow: photoHovered
                ? '0 40px 100px rgba(255,20,147,0.22), 0 8px 24px rgba(0,0,0,0.08)'
                : '0 24px 60px rgba(255,20,147,0.14), 0 4px 12px rgba(0,0,0,0.05)',
              transition: 'box-shadow 500ms cubic-bezier(0.22,1,0.36,1)',
              cursor: 'zoom-in',
            }}
          >
            {/* Inner image scales on hover — Level 5 hover */}
            <motion.div
              animate={{ scale: photoHovered ? 1.04 : 1 }}
              transition={{ duration: 0.5, ease: easings.outExpoAlt }}
              style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}
            >
              <Image
                src="/aki1.png"
                alt="Aki — portrait"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 42vw, 36vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
                priority
              />
            </motion.div>

            {/* Gradient vignette — lightened for blush bg context */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(255,245,248,0.1) 100%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── TEXT COLUMN ── */}
        <motion.div
          className="coconut-text"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10px' }}
          transition={{ duration: 0.85, delay: 0.12, ease: easings.outExpoAlt }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(24px, 3.5vh, 36px)',
          }}
        >
          {/* Section label */}
          <SectionLabel>About</SectionLabel>

          {/* Headline ── deep warm plum on blush */}
          <h2
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(36px, 4.5vw, 64px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: 'var(--text-primary)',
              transition: 'color 400ms ease',
            }}
          >
            Sri Lankan blood.
            <br />
            <span
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                color: 'var(--accent-hot)',
              }}
            >
              London soul.
            </span>
          </h2>

          {/* Body copy ── muted mauve on blush */}
          <p
            style={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 300,
              fontSize: 'clamp(15px, 1.3vw, 17px)',
              lineHeight: 1.72,
              color: 'var(--text-mid)',
              transition: 'color 400ms ease',
              maxWidth: '56ch',
            }}
          >
            Interior design student by day. Diamond 1 by 3am.
            7cups counselor somewhere in between. I study how spaces make
            people feel — and I&apos;ve been doing it since before I had the vocabulary for it.
          </p>

          {/* Tag pills ── spring stagger */}
          <motion.div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {TAGS.map((tag) => (
              <motion.span
                key={tag.label}
                variants={{
                  hidden: { opacity: 0, scale: 0.85, y: 8 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } },
                }}
                style={{
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 400,
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: `var(--badge-${tag.type}-text)`,
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: `1px solid var(--badge-${tag.type}-border)`,
                  background: `var(--badge-${tag.type}-bg)`,
                  cursor: 'default',
                  display: 'inline-block',
                }}
              >
                {tag.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Fun facts strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
          >
            {FUN_FACTS.map((fact) => (
              <span
                key={fact.text}
                style={{
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 300,
                  fontSize: '11px',
                  color: 'var(--text-soft)',
                  transition: 'color 400ms ease',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: 'var(--badge-secondary-text)', opacity: 0.8 }}>{fact.icon}</span>
                {fact.text}
              </span>
            ))}
          </motion.div>

          {/* Pull quote carousel */}
          <PullQuote />
        </motion.div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(10,3,6,0.92)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{
                position: 'relative',
                width: 'min(90vw, 420px)',
                aspectRatio: '2 / 3',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '8px solid var(--card-bg)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              }}
            >
              <Image
                src="/aki1.png"
                alt="Aki — lightbox portrait"
                fill
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ── Pull quote with 3-quote carousel (Von Restorff + Zeigarnik) ── */
function PullQuote() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '80px' }}>
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ rotate: -1.5, opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.8vw, 21px)',
            color: 'var(--text-mid)',
            transition: 'color 400ms ease',
            lineHeight: 1.55,
            boxShadow: 'inset 2px 0 0 var(--glass-border)',
            paddingLeft: '24px',
            maxWidth: '44ch',
            transformOrigin: 'top left',
            margin: 0,
          }}
        >
          &ldquo;{QUOTES[idx]}&rdquo;
        </motion.blockquote>
      </AnimatePresence>
    </div>
  )
}
