'use client'

/**
 * components/sections/Universe.tsx
 * Section 02 — Everything I'm Made Of.
 *
 * DESKTOP (≥1024px): Horizontal accordion.
 *   - Left column: sticky narrative (align-self: start, prevents overflow)
 *   - Right: 3 panels side-by-side, click/hover to expand
 *   - Collapsed: 120px wide, title rotated -90deg, opacity 0.5
 *   - Expanded: flex:1 (takes remaining width), title de-rotates, content staggered in
 *   - First card expanded by default — no empty state on first render
 *   - Spring: stiffness 200, damping 30, mass 0.8
 *
 * TABLET/MOBILE (<1024px): Vertical stack.
 *   - Narrative heading above cards
 *   - Click to expand each card, click again collapses (minimum: 1 always open)
 *   - No sticky column — static heading
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { easings } from '@/lib/motion'

const CARDS = [
  {
    id: 1,
    title: 'Design',
    description: 'Minimalism with warmth. Spaces that make me feel something before I understand why.',
    bg: 'linear-gradient(145deg, #2D0A1E 0%, #1A0A12 100%)',
    border: 'rgba(255,20,147,0.2)',
    borderHover: 'rgba(255,20,147,0.45)',
    tag: 'Interior Design',
    accent: '#FF1493',
    tagColor: 'rgba(255,20,147,0.7)',
  },
  {
    id: 2,
    title: 'Gaming',
    description: "Diamond 1. Not just playing — mastering. Perfect CS, macro calls, outplaying the jungler at 3am.",
    bg: 'linear-gradient(145deg, #1E0818 0%, #0F0308 100%)',
    border: 'rgba(194,24,91,0.2)',
    borderHover: 'rgba(194,24,91,0.45)',
    tag: 'League of Legends',
    accent: '#C2185B',
    tagColor: 'rgba(194,24,91,0.7)',
  },
  {
    id: 3,
    title: 'Mind',
    description: "I study cognitive biases, decision theory, and why humans are beautifully irrational. Also: 7cups.",
    bg: 'linear-gradient(145deg, #1A061A 0%, #0A0408 100%)',
    border: 'rgba(173,20,87,0.2)',
    borderHover: 'rgba(173,20,87,0.45)',
    tag: 'Psychology',
    accent: '#AD1457',
    tagColor: 'rgba(173,20,87,0.7)',
  },
]

/* Spring shared across all layout animations */
const SPRING = { type: 'spring', stiffness: 200, damping: 30, mass: 0.8 } as const

const DESIGN_PATTERN = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h16v16H0V0zm1 1h14v14H1V1z' fill='%23fff' fill-opacity='.04' fill-rule='evenodd'/%3E%3C/svg%3E")`
const GAMING_PATTERN = `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' fill='%23fff' fill-opacity='.05'/%3E%3C/svg%3E")`
const MIND_PATTERN = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1.5' fill='%23fff' fill-opacity='.05'/%3E%3C/svg%3E")`

const MIND_FACTS = [
  "Zeigarnik Effect: We remember unfinished tasks better than completed ones.",
  "Von Restorff Effect: An item that stands out is more likely to be remembered.",
  "Peak-End Rule: We judge experiences by their peak and how they end.",
]

/* ── Starfield — 60 tiny twinkling stars ── */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: ((i * 1237 + 53) % 100),
  y: ((i * 839 + 17) % 100),
  size: 1 + (i % 3) * 0.5,
  opacity: 0.08 + (i % 5) * 0.06,
  delay: (i % 8) * 0.4,
  dur: 3 + (i % 4),
}))

function StarField() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [s.opacity, s.opacity * 3, s.opacity] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
          }}
        />
      ))}
    </div>
  )
}

export function Universe() {
  /* expandedIndex: which card is active. Default 0 = first card.
     On desktop: never -1 (no empty state). On tablet: can be any. */
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [currentHour, setCurrentHour] = useState<number | null>(null)

  useEffect(() => {
    setCurrentHour(new Date().getHours())
  }, [])

  /* Detect desktop vs tablet/mobile.
     We use a media query not pointer:coarse — iPad+keyboard is desktop-like
     but at 768-1023px we still want the vertical stack (space constraint). */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = (matches: boolean) => {
      setIsDesktop(matches)
      /* When switching to desktop, ensure a card is always expanded */
      if (matches) setExpandedIndex((i) => (i < 0 ? 0 : i))
    }
    update(mq.matches)
    const handler = (e: MediaQueryListEvent) => update(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleCardActivate = (index: number) => {
    if (isDesktop) {
      /* Desktop: hover/click sets active — never collapses all */
      setExpandedIndex(index)
    } else {
      /* Tablet/mobile: click toggles. But always keep at least one open. */
      setExpandedIndex((prev) => (prev === index ? 0 : index))
    }
  }

  /* Desktop: reset to first card when leaving accordion */
  const handleAccordionLeave = () => {
    if (isDesktop) setExpandedIndex(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const currentX = e.targetTouches[0].clientX
    const diff = touchStart - currentX

    if (diff > 50) {
      // swipe left -> next card
      setExpandedIndex((prev) => Math.min(CARDS.length - 1, prev + 1))
      setTouchStart(null)
    } else if (diff < -50) {
      // swipe right -> prev card
      setExpandedIndex((prev) => Math.max(0, prev - 1))
      setTouchStart(null)
    }
  }

  return (
    <section
      id="universe"
      className="universe-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        background: 'linear-gradient(180deg, #0A0306 0%, #150818 50%, #0A0306 100%)',
        transition: 'background 400ms ease',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
        overflow: 'hidden',
      }}
    >
      {/* Seamless section fade-in from above — blends Coconut into Universe */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw', height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,20,147,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Starfield — 60 twinkling stars */}
      <StarField />

      {/* ── LEFT: Sticky Narrative ─────────────────────────────────────────── */}
      <div
        style={{
          position: isDesktop ? 'sticky' : 'static',
          top: isDesktop ? '20vh' : undefined,
          width: isDesktop ? 'clamp(240px, 24vw, 340px)' : '100%',
          flexShrink: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 2.5vh, 24px)',
        }}
      >
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easings.outExpo }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,20,147,0.8)' }} />
          <span
            style={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 500,
              fontSize: '10px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255,20,147,0.8)',
            }}
          >
            02 — The Universe
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.06, ease: easings.outExpo }}
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: 'rgba(255, 240, 245, 0.95)',
          }}
        >
          Everything I&apos;m made of.
        </motion.h2>

        {/* Desktop only: supporting text */}
        {isDesktop && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 300,
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'rgba(255,182,217,0.65)',
              maxWidth: '32ch',
            }}
          >
            Three obsessions. One person. Hover to explore.
          </motion.p>
        )}
      </div>

      {/* ── RIGHT: Accordion ───────────────────────────────────────────────── */}
      <div
        className="universe-accordion"
        onMouseLeave={handleAccordionLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ zIndex: 2, position: 'relative' }}
      >
        {CARDS.map((card, index) => (
          <AccordionCard
            key={card.id}
            card={card}
            index={index}
            isExpanded={expandedIndex === index}
            isAnyExpanded={true}
            isDesktop={isDesktop}
            currentHour={currentHour}
            onActivate={() => handleCardActivate(index)}
          />
        ))}
      </div>
    </section>
  )
}

/* ── Accordion Card ──────────────────────────────────────────────────────── */

function AccordionCard({
  card,
  index,
  isExpanded,
  isDesktop,
  currentHour,
  onActivate,
}: {
  card: (typeof CARDS)[0]
  index: number
  isExpanded: boolean
  isAnyExpanded: boolean
  isDesktop: boolean
  currentHour: number | null
  onActivate: () => void
}) {
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    if (card.id !== 3 || !isExpanded) return
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % MIND_FACTS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [card.id, isExpanded])

  return (
    <motion.div
      layout
      style={{
        flex: isDesktop
          ? isExpanded
            ? '1 0 0'      /* expanded: grow to fill available space */
            : '0 0 120px'  /* collapsed: fixed 120px gutter */
          : '1 1 auto',    /* tablet/mobile: natural height */
        minHeight: !isDesktop
          ? isExpanded
            ? 'clamp(220px, 32vh, 340px)'
            : '72px'
          : undefined,
        position: 'relative',
        background: card.bg,
        borderRadius: '20px',
        border: `1px solid ${isExpanded ? card.borderHover : card.border}`,
        boxShadow: isExpanded
          ? `0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${card.borderHover}`
          : '0 4px 20px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isDesktop && !isExpanded ? 0.5 : 1,
        transition: 'opacity 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        ...(isDesktop && { height: '100%' }),
      }}
      transition={{ layout: SPRING }}
      onMouseEnter={() => isDesktop && onActivate()}
      onClick={() => !isDesktop && onActivate()}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: isDesktop && !isExpanded ? 0.5 : 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Background texture pattern */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isExpanded ? 0.04 : 0.015,
          backgroundImage: card.id === 1 ? DESIGN_PATTERN : card.id === 2 ? GAMING_PATTERN : MIND_PATTERN,
          backgroundSize: card.id === 1 ? '16px 16px' : card.id === 2 ? '8px 8px' : '24px 24px',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Inner glow — shows on expanded with breathing animation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1.0, 0.6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
            style={{
              position: 'absolute',
              top: '-40%', left: '-20%',
              width: '140%', height: '140%',
              background: `radial-gradient(ellipse at top left, ${card.accent}18 0%, transparent 60%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── DESKTOP COLLAPSED: Rotated title ─────────────────────────────── */}
      {isDesktop && (
        <motion.div
          initial={false}
          animate={{ opacity: isExpanded ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          aria-hidden={isExpanded}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(22px, 2.2vw, 32px)',
              letterSpacing: '-0.02em',
              color: card.accent,
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap',
            }}
          >
            {card.title}
          </h3>
        </motion.div>
      )}

      {/* ── EXPANDED CONTENT ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            style={{
              padding: 'clamp(24px, 4vw, 48px)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {card.id === 3 && currentHour !== 2 && currentHour !== null && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                background: 'rgba(10, 3, 6, 0.4)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-figtree)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#FF1493',
                  background: 'rgba(255, 20, 147, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: '1px solid rgba(255, 20, 147, 0.2)',
                }}>
                  This thought only exists at 2:00 AM.
                </span>
              </div>
            )}
            <div style={{
              filter: card.id === 3 && currentHour !== 2 && currentHour !== null ? 'blur(12px) grayscale(1)' : 'none',
              pointerEvents: card.id === 3 && currentHour !== 2 && currentHour !== null ? 'none' : 'auto',
              userSelect: card.id === 3 && currentHour !== 2 && currentHour !== null ? 'none' : 'auto',
              transition: 'filter 0.5s ease',
              display: 'contents', // Inherit flex behavior
            }}>
              <div>
              {/* Tag — first element */}
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.35, ease: easings.outExpo }}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 500,
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.28em',
                  color: card.tagColor,
                  marginBottom: '12px',
                }}
              >
                {card.tag}
              </motion.span>

              {/* Title — delay 80ms */}
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4, ease: easings.outExpo }}
                style={{
                  fontFamily: 'var(--font-bodoni-moda)',
                  fontSize: isDesktop
                    ? 'clamp(44px, 5.5vw, 88px)'
                    : 'clamp(36px, 5vw, 60px)',
                  lineHeight: 0.95,
                  color: 'rgba(255,240,245,0.92)',
                  letterSpacing: '-0.03em',
                  marginBottom: '20px',
                }}
              >
                {card.title}
              </motion.h3>

              {/* Description — delay 160ms */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.4, ease: easings.outExpo }}
                style={{
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 300,
                  fontSize: 'clamp(14px, 1.4vw, 17px)',
                  lineHeight: 1.68,
                  color: 'rgba(255,200,220,0.68)',
                  maxWidth: '40ch',
                }}
              >
                {card.description}
              </motion.p>
            </div>

            {/* Custom interactive elements based on card type */}
            <div style={{ marginTop: '24px' }}>
              {card.id === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.4 }}
                  style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                >
                  {['Tadao Ando', 'Wabi-sabi', 'Bauhaus'].map((insp) => (
                    <span
                      key={insp}
                      style={{
                        fontFamily: 'var(--font-figtree)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: 'rgba(255,20,147,0.08)',
                        border: '1px solid rgba(255,20,147,0.15)',
                        color: 'rgba(255,255,255,0.8)',
                      }}
                    >
                      {insp}
                    </span>
                  ))}
                </motion.div>
              )}

              {card.id === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.4 }}
                  style={{ width: '100%', maxWidth: '280px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-figtree)', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <span>Diamond 1</span>
                    <span>75% to Grandmaster</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                      style={{ height: '100%', background: '#FF1493' }}
                    />
                  </div>
                </motion.div>
              )}

              {card.id === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.4 }}
                  style={{ minHeight: '44px' }}
                >
                  <div style={{ fontSize: '9px', fontFamily: 'var(--font-figtree)', color: 'rgba(255,20,147,0.6)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '4px' }}>
                    Mind Insight
                  </div>
                  <div style={{ position: 'relative' }}>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={factIndex}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          fontFamily: 'var(--font-figtree)',
                          fontWeight: 300,
                          fontSize: '13px',
                          lineHeight: 1.4,
                          color: 'rgba(255,255,255,0.75)',
                          maxWidth: '38ch',
                          margin: 0,
                        }}
                      >
                        {MIND_FACTS[factIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Watermark number */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                bottom: '16px', right: '20px',
                fontFamily: 'var(--font-bodoni-moda)',
                fontStyle: 'italic',
                fontSize: 'clamp(40px, 6vw, 80px)',
                color: 'rgba(255,255,255,0.04)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            >
              {String(card.id).padStart(2, '0')}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TABLET/MOBILE COLLAPSED: Mini title row ─────────────────────── */}
      {!isDesktop && !isExpanded && (
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(26px, 4vw, 40px)',
              letterSpacing: '-0.02em',
              color: card.accent,
            }}
          >
            {card.title}
          </h3>
          <span
            style={{
              fontFamily: 'var(--font-figtree)',
              fontSize: '18px',
              color: 'rgba(255,255,255,0.3)',
              lineHeight: 1,
            }}
          >
            +
          </span>
        </div>
      )}
    </motion.div>
  )
}
