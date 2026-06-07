'use client'

/**
 * components/sections/Hero.tsx
 *
 * FINAL HERO — Aki's World
 * ─────────────────────────
 * Background: #FFF5F8 pale blush + breathing gradient mesh + grain
 * Layout: AKI at 42% golden ratio vertical placement
 * Letters: Magnetic with spring physics (max 12px drift)
 * Bow: Custom SVG on "I" with entrance bounce + pendulum on hover
 * Tagline: "aneh, I'm just a girl" — ONCE ONLY, centred below AKI
 * Sub-tags: "interior design · psychology · diamond 1 · coconut" centred
 * Scroll indicator: 1px vertical line, breathing pulse, fades on scroll
 * Entrance: Choreographed GSAP-grade stagger via Framer Motion
 * Mobile: touch ripple on AKI tap, no magnetic drift
 *
 * BUGS FIXED:
 * - Removed floating right-edge rotated tagline (was appearing as ghost)
 * - Removed SUB_TAGS floating top-right cluster (was "DIAMOND 1", "COCONUT")
 * - SPILL pill removed from hero — it lives only as a nav link
 */

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { BowSvg } from '@/components/ui/BowSvg'
import { springs, easings, durations } from '@/lib/motion'
import { eradicateOrphans } from '@/utils/text'

/* ─── Text Scramble Hook ─── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'

function useScramble(finalChar: string, delay: number) {
  const [display, setDisplay] = useState(finalChar)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const start = Date.now() + delay
    const duration = 480
    let frame: number

    const tick = () => {
      const now = Date.now()
      if (now < start) { frame = requestAnimationFrame(tick); return }
      const elapsed = now - start
      const progress = elapsed / duration
      if (progress >= 1) {
        setDisplay(finalChar)
        setDone(true)
        return
      }
      // Show random char until 80% done, then snap to final
      if (progress > 0.8) {
        setDisplay(finalChar)
      } else {
        setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)])
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [finalChar, delay, done])

  return display
}

/* ─── Gradient Mesh Background ─── */
function GradientMesh() {
  const { scrollY } = useScroll()

  // Compress y (scaleY) from 1 down to 0.82 as scroll goes from 0 to 800px
  const scaleYVal = useTransform(scrollY, [0, 800], [1, 0.82])
  const scaleYSpring = useSpring(scaleYVal, { stiffness: 60, damping: 20 })

  // Parallax offsets (pull/push blobs slightly as we scroll)
  const yParallax1 = useTransform(scrollY, [0, 800], [0, 110])
  const yParallax2 = useTransform(scrollY, [0, 800], [0, -90])
  const yParallax3 = useTransform(scrollY, [0, 800], [0, 60])
  // #4 Fourth blob at ultra-slow parallax for depth
  const yParallax4 = useTransform(scrollY, [0, 800], [0, 30])

  const ySpring1 = useSpring(yParallax1, { stiffness: 60, damping: 20 })
  const ySpring2 = useSpring(yParallax2, { stiffness: 60, damping: 20 })
  const ySpring3 = useSpring(yParallax3, { stiffness: 60, damping: 20 })
  const ySpring4 = useSpring(yParallax4, { stiffness: 20, damping: 30 })

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Blob 1 — large, left-centre, soft pink */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '20%',
          width: '800px',
          height: '600px',
          transformOrigin: 'center center',
          pointerEvents: 'none',
          scaleY: scaleYSpring,
          y: ySpring1,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(ellipse 800px 600px at center, var(--blob-color-1) 0%, transparent 70%)',
            animation: 'hero-float1 20s ease-in-out infinite',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* Blob 2 — medium, right-top, hot pink whisper */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '500px',
          height: '400px',
          transformOrigin: 'center center',
          pointerEvents: 'none',
          scaleY: scaleYSpring,
          y: ySpring2,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(ellipse 500px 400px at center, var(--blob-color-2) 0%, transparent 65%)',
            animation: 'hero-float2 18s ease-in-out infinite alternate',
            borderRadius: '50%',
            filter: 'blur(32px)',
          }}
        />
      </motion.div>

      {/* Blob 3 — small, bottom-centre, champagne gold */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '55%',
          width: '300px',
          height: '250px',
          transformOrigin: 'center center',
          pointerEvents: 'none',
          scaleY: scaleYSpring,
          y: ySpring3,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(ellipse 300px 250px at center, var(--blob-color-3) 0%, transparent 60%)',
            animation: 'hero-float3 22s ease-in-out infinite',
            borderRadius: '50%',
            filter: 'blur(24px)',
          }}
        />
      </motion.div>

      {/* Blob 4 — #4 Deep background depth layer, very slow parallax */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '1000px',
          height: '800px',
          transformOrigin: 'center center',
          pointerEvents: 'none',
          y: ySpring4,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(ellipse 1000px 800px at center, rgba(255, 182, 217, 0.06) 0%, transparent 60%)',
            animation: 'hero-float1 32s ease-in-out infinite reverse',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Bokeh circles — scattered, blurred, barely visible */}
      {([
        { top: '25%', left: '70%', size: 60,  color: 'rgba(255,20,147,0.06)',  blur: 20, dur: 9 },
        { top: '65%', left: '15%', size: 40,  color: 'rgba(201,164,101,0.08)', blur: 16, dur: 11 },
        { top: '80%', left: '80%', size: 80,  color: 'rgba(255,182,217,0.06)', blur: 24, dur: 13 },
        { top: '40%', left: '85%', size: 50,  color: 'rgba(194,24,91,0.05)',   blur: 18, dur: 8  },
        { top: '10%', left: '40%', size: 35,  color: 'rgba(255,20,147,0.04)',  blur: 14, dur: 10 },
        { top: '55%', left: '50%', size: 25,  color: 'rgba(201,164,101,0.05)', blur: 12, dur: 7  },
      ] as const).map((b, i) => (
        <motion.div
          key={i}
          aria-hidden
          animate={{ y: [0, -14, 0], x: [0, 7, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.1 }}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: '50%',
            background: b.color,
            filter: `blur(${b.blur}px)`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}

function MagneticLetter({
  char,
  index,
  isBowLetter = false,
  onBowNear,
}: {
  char: string
  index: number
  isBowLetter?: boolean
  onBowNear?: (near: boolean) => void
}) {
  const letterRef = useRef<HTMLSpanElement | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  // #2 Text scramble
  const scrambledChar = useScramble(char, 200 + index * 100)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 150, damping: 12 })
  const y = useSpring(rawY, { stiffness: 150, damping: 12 })
  const rotate = useSpring(0, { stiffness: 100, damping: 12 })

  useEffect(() => {
    // Disable magnetic on touch devices — use tap ripple instead
    setIsTouchDevice('ontouchstart' in window)
  }, [])

  useEffect(() => {
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      const el = letterRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)

      if (isBowLetter && onBowNear) {
        onBowNear(dist < 200)
      }

      if (dist < 120) {
        // Max drift: 12px per spec
        const s = (120 - dist) / 120
        rawX.set((e.clientX - cx) * s * 0.10)
        rawY.set((e.clientY - cy) * s * 0.10)
        rotate.set((e.clientX - cx) * s * 0.03)
      } else {
        rawX.set(0)
        rawY.set(0)
        rotate.set(0)
        if (isBowLetter && onBowNear) onBowNear(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [rawX, rawY, rotate, isBowLetter, onBowNear, isTouchDevice])

  const textStyle: React.CSSProperties = {
    display: 'inline-block',
    fontFamily: 'var(--font-bodoni-moda)',
    fontVariationSettings: '"wght" 400, "opsz" 96',
    fontSize: 'clamp(80px, 26vw, 320px)',
    letterSpacing: '-0.04em',
    lineHeight: 0.85,
    background: 'linear-gradient(135deg, #FF1493 0%, #C2185B 60%, #AD1457 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    userSelect: 'none',
    willChange: 'transform',
    filter: 'drop-shadow(0px 12px 24px rgba(194, 24, 91, 0.20))',
  }

  return (
    <div style={{ overflow: 'visible', display: 'inline-block', padding: '8px 2px 0' }}>
      <motion.span
        ref={letterRef}
        initial={{ y: '110%', opacity: 0, rotateX: -90, filter: 'blur(8px)' }}
        animate={{ y: '0%', opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
        transition={{
          duration: 0.9,
          delay: 0.6 + index * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          display: 'inline-block',
          x: isTouchDevice ? 0 : x,
          y: isTouchDevice ? 0 : y,
          rotate: isTouchDevice ? 0 : rotate,
          transformOrigin: 'bottom center',
          perspective: 800,
        }}
      >
        {isBowLetter ? (
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={textStyle}>{scrambledChar}</span>
            <BowOnI />
          </span>
        ) : (
          <span style={textStyle}>{scrambledChar}</span>
        )}
      </motion.span>
    </div>
  )
}

/* ─── Bow on the I — entrance bounce, pendulum on parent hover ─── */
function BowOnI() {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0, scale: 0.3, rotate: -20 }}
      animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 16,
        delay: 0.65,
      }}
      style={{
        position: 'absolute',
        top: '-6%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}
    >
      <BowSvg size={44} color="#C2185B" swing={true} swingReverse={false} />
    </motion.div>
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
          transition={{ delay: 1.9, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(32px, 5vh, 48px)',
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
          {/* 1px vertical line, breathing pulse */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '48px',
              background: 'rgba(194,24,91,0.45)',
              borderRadius: '1px',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 300,
              fontSize: '9px',
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--text-soft)',
              transition: 'color 400ms ease',
            }}
          >
            scroll to explore
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Hero ─── */
export function Hero() {
  const [bowNear, setBowNear] = useState(false)

  // Cursor-following ambient glow — very subtle on light bg
  const bgXRaw = useMotionValue(0)
  const bgYRaw = useMotionValue(0)
  const bgX = useSpring(bgXRaw, { stiffness: 18, damping: 28 })
  const bgY = useSpring(bgYRaw, { stiffness: 18, damping: 28 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      bgXRaw.set((e.clientX / window.innerWidth - 0.5) * 40)
      bgYRaw.set((e.clientY / window.innerHeight - 0.5) * 40)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [bgXRaw, bgYRaw])

  const LETTERS = [
    { char: 'A', isBow: false },
    { char: 'K', isBow: false },
    { char: 'I', isBow: true },
  ]

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
      aria-label="Hero — Aki's World"
    >
      {/* Breathing gradient mesh — lives beneath everything */}
      <GradientMesh />

      {/* Breathing ambient glow — #9 heartbeat pulse */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '50vw',
          height: '50vw',
          marginLeft: '-25vw',
          marginTop: '-25vw',
          background:
            'radial-gradient(circle at center, rgba(255,182,217,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 1,
          animation: 'ambient-breathe 4s ease-in-out infinite',
        }}
      />

      {/* Cursor-following ambient blush glow */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '40vw',
          height: '40vw',
          marginLeft: '-20vw',
          marginTop: '-20vw',
          background:
            'radial-gradient(circle at center, rgba(255,182,217,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
          x: bgX,
          y: bgY,
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 1,
        }}
      />

      {/* Grain overlay — makes the background feel physical, like cream paper */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.028,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: '300px 300px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/*
        ── CENTRE STAGE: AKI Letters ──
        Positioned at golden ratio: 42% from top.
        On a 100dvh screen, spacer = 42dvh minus half the approximate
        letter block height (~0.85 lineHeight × clamp font).
        We use padding-top on a flex column to achieve this.
        The letters themselves have overflow:visible so the bow doesn't clip.
      */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          /* 42% golden ratio placement minus approximate half-height of AKI name */
          marginTop: 'calc(42dvh - clamp(40px, 13vw, 160px))',
          width: '100%',
        }}
      >
        {/* AKI Letters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          role="heading"
          aria-level={1}
          aria-label="AKI"
          onDoubleClick={() => window.dispatchEvent(new CustomEvent('aki-bow-rain'))}
        >
          {LETTERS.map((l, i) => (
            <MagneticLetter
              key={l.char}
              char={l.char}
              index={i}
              isBowLetter={l.isBow}
              onBowNear={l.isBow ? setBowNear : undefined}
            />
          ))}
        </div>

        {/* Tagline — ONCE ONLY, centred below AKI, hot pink on blush */}
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ delay: 0.95, duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
          style={{
            position: 'relative',
            zIndex: 2,
            marginTop: 'clamp(20px, 3vh, 32px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              color: '#FF1493',
              margin: 0,
              cursor: 'default',
              whiteSpace: 'nowrap',
            }}
          >
            {eradicateOrphans("aneh, I'm just a girl").split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.95 + i * 0.08, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                style={{ display: 'inline-block', marginRight: '6px' }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.5, type: 'spring' }}
          >
            <BowSvg size={18} color="#C2185B" swing={true} swingReverse={true} />
          </motion.div>
        </motion.div>

        {/* Sub-tags — individually staggered entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 1.25 } },
          }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '4px',
            marginTop: 'clamp(14px, 2.5vh, 24px)',
            cursor: 'default',
          }}
          aria-hidden
        >
          {(['interior design', 'psychology', 'diamond 1', 'coconut'] as const).map((tag, i, arr) => (
            <motion.span
              key={tag}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
              }}
              style={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 300,
                fontSize: 'clamp(9px, 1.1vw, 12px)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--text-soft)',
                transition: 'color 400ms ease',
              }}
            >
              {tag}{i < arr.length - 1 && <span style={{ marginLeft: '4px', opacity: 0.4 }}> &middot;</span>}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — bottom-centre */}
      <ScrollIndicator />

      {/* Sentinel — Navbar IntersectionObserver hook */}
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
