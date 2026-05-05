'use client'

/**
 * components/sections/Hero.tsx
 *
 * The entry point. Full viewport. AKI in Bodoni Moda, pink gradient.
 * Magnetic letters, bow on I, ambient glow, scroll indicator.
 *
 * Architecture fix:
 *   - No `mounted` guard — causes hydration mismatch + blank flash
 *   - MagneticLetter uses suppressHydrationWarning for mouse-driven values
 *   - All scroll listeners passive
 *   - bgX/bgY are stable MotionValues — no re-render on mouse move
 */

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { BowSvg } from '@/components/ui/BowSvg'
import { springs, easings, durations } from '@/lib/motion'

/* ─── Magnetic Letter ─── */
function MagneticLetter({
  char,
  index,
  isBowLetter = false,
}: {
  char: string
  index: number
  isBowLetter?: boolean
}) {
  const letterRef = useRef<HTMLSpanElement | null>(null)
  const [bowNear, setBowNear] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 150, damping: 15 })
  const y = useSpring(rawY, { stiffness: 150, damping: 15 })
  const rotate = useSpring(0, { stiffness: 100, damping: 12 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = letterRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)

      if (isBowLetter) setBowNear(dist < 180)

      if (dist < 120) {
        const s = (120 - dist) / 120
        rawX.set((e.clientX - cx) * s * 0.18)
        rawY.set((e.clientY - cy) * s * 0.18)
        rotate.set((e.clientX - cx) * s * 0.04)
      } else {
        rawX.set(0)
        rawY.set(0)
        rotate.set(0)
        if (isBowLetter) setBowNear(false)
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [rawX, rawY, rotate, isBowLetter])

  const textStyle: React.CSSProperties = {
    display: 'inline-block',
    fontFamily: 'var(--font-bodoni-moda)',
    fontVariationSettings: '"wght" 400, "opsz" 96',
    fontSize: 'clamp(120px, 20vw, 260px)',
    letterSpacing: '-0.03em',
    lineHeight: 0.85,
    background: 'linear-gradient(175deg, #FF1493 0%, #C2185B 55%, #AD1457 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent', // Fallback for SSR
    userSelect: 'none',
    willChange: 'transform',
  }

  return (
    <div style={{ overflow: 'visible', display: 'inline-block', padding: '8px 4px 0' }}>
      <motion.span
        ref={letterRef}
        initial={{ y: '110%', filter: 'blur(10px)', opacity: 0 }}
        animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
        transition={{
          duration: durations.section,
          delay: 0.12 + index * 0.1,
          ease: easings.outExpo,
        }}
        style={{
          display: 'inline-block',
          x,
          y,
          rotate,
          transformOrigin: 'bottom center',
        }}
      >
        {isBowLetter ? (
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={textStyle}>{char}</span>
            {/* Bow positioned above the letter */}
            <motion.div
              initial={{ y: -40, opacity: 0, scale: 0.4, rotate: -15 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              transition={{ ...springs.bowDrop, delay: 0.65 }}
              style={{
                position: 'absolute',
                top: '-10%',
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            >
              <BowSvg size={44} color="#C2185B" swing={bowNear} swingReverse={false} />
            </motion.div>
          </span>
        ) : (
          <span style={textStyle}>{char}</span>
        )}
      </motion.span>
    </div>
  )
}

/* ─── Scroll Indicator ─── */
function ScrollIndicator() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10,
          }}
          aria-hidden
        >
          <div
            style={{
              position: 'relative',
              width: '1px',
              height: '52px',
              background: 'rgba(255,20,147,0.15)',
              overflow: 'hidden',
              borderRadius: '1px',
            }}
          >
            <motion.div
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: '-1px',
                width: '3px',
                height: '16px',
                background:
                  'linear-gradient(180deg, transparent 0%, #FF1493 50%, transparent 100%)',
                borderRadius: '2px',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 400,
              fontSize: '9px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(168,98,122,0.5)',
            }}
          >
            scroll
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Hero ─── */
export function Hero() {
  const bgXRaw = useMotionValue(0)
  const bgYRaw = useMotionValue(0)
  const bgX = useSpring(bgXRaw, { stiffness: 22, damping: 28 })
  const bgY = useSpring(bgYRaw, { stiffness: 22, damping: 28 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      bgXRaw.set((e.clientX / window.innerWidth - 0.5) * 70)
      bgYRaw.set((e.clientY / window.innerHeight - 0.5) * 70)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [bgXRaw, bgYRaw])

  const LETTERS = [
    { char: 'A', isBow: false },
    { char: 'K', isBow: false },
    { char: 'I', isBow: true },
  ]

  const SUB_TAGS = ['interior design', 'psychology', 'diamond 1', 'coconut']

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        background: '#FFF0F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Golden ratio: content at 42% from top (not 50%)
        // Achieved by adding extra bottom padding to shift center up
        paddingTop: '48px',
        paddingBottom: 'clamp(80px, 16vh, 160px)',
      }}
      aria-label="Hero — Aki's World"
    >
      {/* Ambient glow that follows cursor */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '65vw',
          height: '65vw',
          marginLeft: '-32.5vw',
          marginTop: '-32.5vw',
          background:
            'radial-gradient(circle at center, rgba(255,20,147,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
          x: bgX,
          y: bgY,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.018,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: '300px 300px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* AKI letters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
          role="heading"
          aria-level={1}
          aria-label="AKI"
        >
          {LETTERS.map((l, i) => (
            <MagneticLetter
              key={l.char}
              char={l.char}
              index={i}
              isBowLetter={l.isBow}
            />
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.9, duration: durations.component, ease: easings.outExpo }}
          style={{
            marginTop: '24px',
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.4vw, 30px)',
            color: '#C2185B',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'default',
          }}
        >
          aneh, I&apos;m just a girl
          <BowSvg size={26} color="#C2185B" swing={true} swingReverse={true} />
        </motion.p>

        {/* Sub-tags */}
        <div
          style={{
            marginTop: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8em',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {SUB_TAGS.map((tag, idx) => (
            <div
              key={tag}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8em' }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.05 + idx * 0.1,
                  duration: durations.component,
                  ease: easings.outExpo,
                }}
                style={{
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#A8627A',
                }}
              >
                {tag}
              </motion.span>
              {idx < SUB_TAGS.length - 1 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.15 + idx * 0.1 }}
                  style={{ color: '#C9A465', fontSize: '14px' }}
                >
                  ·
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>

      <ScrollIndicator />

      {/* Sentinel — Navbar watches this */}
      <div
        id="hero-sentinel"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          pointerEvents: 'none',
        }}
        aria-hidden
      />
    </section>
  )
}
