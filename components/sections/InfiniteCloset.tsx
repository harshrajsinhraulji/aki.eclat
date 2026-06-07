'use client'

/**
 * components/sections/InfiniteCloset.tsx
 * Section 03 — Horizontal drag-scroll gallery of Aki's aesthetic.
 *
 * FIXED:
 * — Replaced 2D free-drag 4000×4000 canvas with a proper horizontal drag track
 * — Removed translate(-50%,-50%) conflict with Framer Motion x/y values
 * — Drag constraints calculated from actual container vs track width
 * — Single drag axis (x only), no fighting between CSS transform + motion values
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform, useVelocity, AnimatePresence, type MotionValue, animate } from 'framer-motion'
import Image from 'next/image'
import { easings } from '@/lib/motion'

const items = [
  {
    id: 1,
    title: 'The White Dress',
    desc: 'Ethereal. Untouchable. The kind of dress that makes them stare.',
    akiNote: 'wore this exactly once. it deserved an audience.',
    emoji: '🤍',
    image: '/aki3.png',
    depth: 1.0,
  },
  {
    id: 2,
    title: 'Camera Roll',
    desc: 'Unfiltered, unsteady, untamed. The midnight archives.',
    akiNote: 'caught staring into the void.',
    emoji: '🎬',
    image: '/aki2.png',
    depth: 0.92,
  },
  {
    id: 3,
    title: 'Summer Whites',
    desc: 'Coquette energy in the heat. Tube tops and ruffled skirts.',
    akiNote: 'pastels are an attitude, not just a colour.',
    emoji: '🎀',
    image: '/aki1.png',
    depth: 1.08,
  },
  {
    id: 4,
    title: 'Chunky Boots',
    desc: 'Combat with coquette. The contradiction that makes sense.',
    akiNote: 'they go with everything. yes, everything.',
    emoji: '🥾',
    image: '/aki4.png',
    depth: 0.96,
  },
  {
    id: 6,
    title: 'Late Night Art',
    desc: 'Pastels, canvas, and Greek Mythology. What happens when the server is down.',
    akiNote: 'i draw at 2am. always 2am.',
    emoji: '🎨',
    image: '/aki-art.jpg',
    depth: 0.88,
  },
  {
    id: 7,
    title: 'Candid Moments',
    desc: 'Blurry, flash-on, holding cake. Uncurated reality.',
    akiNote: 'tell frank. i ainta kid no more!',
    emoji: '📸',
    image: '/aki-cake.png',
    depth: 1.12,
  },
]

// Card width + gap for drag bounds calculation
const CARD_W = 380
const CARD_GAP = 24

export function InfiniteCloset() {
  const [zoomItem, setZoomItem] = useState<(typeof items)[0] | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // #70 flip state per card
  const [flippedId, setFlippedId] = useState<number | null>(null)

  // Track active index based on scroll position of carousel
  const carouselRef = useRef<HTMLDivElement>(null)
  const prevIndexRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return
      const { scrollLeft } = carouselRef.current
      const newIndex = Math.max(0, Math.min(items.length - 1, Math.round(scrollLeft / (CARD_W + CARD_GAP))))
      setActiveIndex(newIndex)

      if (newIndex !== prevIndexRef.current) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10)
        prevIndexRef.current = newIndex
      }
    }
    const current = carouselRef.current
    if (current) {
      current.addEventListener('scroll', handleScroll, { passive: true })
      return () => current.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section
      id="closet"
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: 'linear-gradient(180deg, #0F0308 0%, #0A0306 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: '100px 100px',
          backgroundImage:
            'linear-gradient(to right, rgba(255,20,147,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,20,147,0.025) 1px, transparent 1px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Section label + #73 counter badge */}
      <div
        style={{
          position: 'relative',
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          paddingTop: 'clamp(80px, 10vh, 120px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
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
            color: '#FF1493',
          }}
        >
          03 — The Infinite Closet
        </span>
        {/* #73 Piece count badge */}
        <span
          style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C9A465',
            background: 'rgba(201,164,101,0.1)',
            border: '1px solid rgba(201,164,101,0.25)',
            borderRadius: '100px',
            padding: '2px 8px',
            marginLeft: '4px',
          }}
        >
          {String(items.length).padStart(2, '0')} pieces
        </span>
      </div>

      {/* Section heading */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: easings.outExpoAlt }}
        style={{
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(36px, 5vw, 64px)',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          color: '#FFF0F5',
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          marginBottom: 'clamp(40px, 5vh, 56px)',
          marginTop: '20px',
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        Fragments of
        <br />
        <span
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            color: '#FF1493',
          }}
        >
          my reality.
        </span>
      </motion.h2>


      {/* ── Scroll-Snap Carousel ── */}
      <div
        ref={carouselRef}
        className="closet-carousel"
        style={{
          paddingLeft: 'clamp(24px, 5vw, 48px)',
          paddingRight: 'clamp(24px, 5vw, 48px)',
          position: 'relative',
          zIndex: 5,
          marginTop: 'clamp(32px, 5vh, 48px)',
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => (
          <CarouselCard 
            key={item.id} 
            item={item} 
            onZoom={setZoomItem} 
            flipped={flippedId === item.id}
            onFlip={() => setFlippedId(flippedId === item.id ? null : item.id)}
          />
        ))}
      </div>

      {/* Pagination dots */}
      <style>{`.closet-dots { display: flex; }`}</style>
      <div
        className="closet-dots"
        aria-hidden
        style={{
          justifyContent: 'center',
          gap: '6px',
          paddingTop: '20px',
          paddingBottom: '40px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {items.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? '24px' : '6px',
              height: '6px',
              borderRadius: '100px',
              background: i === activeIndex ? '#FF1493' : 'rgba(194,24,91,0.25)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Zoom Lightbox Overlay */}
      <AnimatePresence>
        {zoomItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomItem(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(10,3,6,0.94)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
            }}
          >
            <motion.div
              layoutId={`closet-card-${zoomItem.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(90vw, 500px)',
                background: 'var(--card-bg)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {zoomItem.image ? (
                <motion.div layoutId={`closet-img-${zoomItem.id}`} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '16px', overflow: 'hidden' }}>
                  <Image src={zoomItem.image} alt={zoomItem.title} fill style={{ objectFit: 'cover' }} sizes="500px" />
                </motion.div>
              ) : (
                <div style={{ fontSize: '72px', textAlign: 'center' }}>{zoomItem.emoji}</div>
              )}
              <motion.div layoutId={`closet-content-${zoomItem.id}`}>
                <h3 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: '32px', color: 'var(--text-primary)', transition: 'color 400ms ease', margin: '0 0 8px 0' }}>
                  {zoomItem.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-figtree)', fontSize: '16px', color: 'var(--text-mid)', transition: 'color 400ms ease', margin: '0 0 16px 0', lineHeight: 1.6 }}>
                  {zoomItem.desc}
                </p>
                {zoomItem.akiNote && (
                  <div style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: '12px', borderLeft: '3px solid #FF1493' }}>
                    <p style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--text-mid)', transition: 'color 400ms ease', margin: 0 }}>
                      &ldquo;{zoomItem.akiNote}&rdquo;
                    </p>
                  </div>
                )}
              </motion.div>
              <button
                onClick={() => setZoomItem(null)}
                style={{
                  alignSelf: 'flex-end',
                  padding: '8px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  background: 'transparent',
                  color: '#FF1493',
                  fontFamily: 'var(--font-figtree)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderTop: '1px solid var(--card-border)'
                }}
              >
                Close Gallery
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ── Desktop Closet Card ── */
function ClosetCard({
  item,
  index,
  dragX,
  onZoom,
  flipped,
  onFlip,
}: {
  item: (typeof items)[0]
  index: number
  dragX: MotionValue<number>
  onZoom: (item: (typeof items)[0]) => void
  flipped: boolean
  onFlip: () => void
}) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const touchTimeout = useRef<NodeJS.Timeout | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 300, damping: 20 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const rotateX = useTransform(springY, [-100, 100], [3, -3])
  const rotateY = useTransform(springX, [-100, 100], [-3, 3])

  const dragVelocityX = useVelocity(dragX)
  const smoothVelocityX = useSpring(dragVelocityX, { damping: 50, stiffness: 400 })
  const skewX = useTransform(smoothVelocityX, [-2000, 2000], [4, -4])

  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }, [x, y])

  const handleTouchStart = () => {
    touchTimeout.current = setTimeout(() => {
      onZoom(item)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (touchTimeout.current) clearTimeout(touchTimeout.current)
  }

  return (
    <div
      className="card-flip-container"
      style={{
        flexShrink: 0,
        width: `${CARD_W}px`,
        height: 'clamp(400px, 58vh, 540px)',
        borderRadius: '24px',
        position: 'relative',
      }}
    >
      <div className={`card-flip-inner${flipped ? ' flipped' : ''}`}>
        {/* FRONT face */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.08, ease: easings.outExpoAlt }}
          viewport={{ once: true, margin: '-50px' }}
          whileHover={{
            y: -10,
            boxShadow: '0 24px 60px rgba(255,20,147,0.18), 0 0 0 1px rgba(255,20,147,0.25)',
            borderColor: 'rgba(255,20,147,0.35)',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={() => onZoom(item)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="card-flip-front"
          style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: 'clamp(28px, 4vw, 44px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 24px var(--shadow-sm), 0 1px 4px rgba(0,0,0,0.03)',
            border: '1px solid var(--card-border)',
            overflow: 'hidden',
            userSelect: 'none',
            transformStyle: 'preserve-3d',
            rotateX,
            rotateY,
            skewX,
            cursor: 'pointer',
            willChange: 'transform',
          }}
        >
          {/* Card number watermark */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              fontFamily: 'var(--font-bodoni-moda)',
              fontStyle: 'italic',
              fontSize: '72px',
              color: 'rgba(194,24,91,0.04)',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {String(item.id).padStart(2, '0')}
          </div>

          {/* #70 Flip button */}
          <button
            onClick={(e) => { e.stopPropagation(); onFlip() }}
            aria-label="Flip card to see Aki's note"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,20,147,0.08)',
              border: '1px solid rgba(255,20,147,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              transition: 'all 200ms ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,20,147,0.18)'; e.currentTarget.style.transform = 'rotate(180deg)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,20,147,0.08)'; e.currentTarget.style.transform = 'rotate(0deg)' }}
          >
            ↺
          </button>

          <div>
            {item.image ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  marginBottom: '20px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{ scale: isHovered ? 1.04 : 1 }}
                  transition={{ duration: 0.5, ease: easings.outExpoAlt }}
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="380px" loading="lazy" />
                </motion.div>
              </div>
            ) : (
              <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', marginBottom: '20px', lineHeight: 1 }}>
                {item.emoji}
              </div>
            )}

            <h3
              style={{
                fontFamily: 'var(--font-bodoni-moda)',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                color: 'var(--text-primary)',
                transition: 'color 400ms ease',
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
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.65,
              color: 'var(--text-mid)',
              transition: 'color 400ms ease',
            }}
          >
            {item.desc}
          </p>

          {/* Outfit overlay on hover */}
          <AnimatePresence>
            {isHovered && item.akiNote && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.35, ease: easings.outExpoAlt }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'var(--bg-primary)',
                  backdropFilter: 'blur(16px)',
                  borderTop: '1px solid var(--card-border)',
                  padding: '16px 20px 20px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-instrument-serif)',
                    fontStyle: 'italic',
                    fontSize: '14px',
                    color: 'var(--text-mid)',
                    transition: 'color 400ms ease',
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;{item.akiNote}&rdquo;
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* BACK face — Aki's note */}
        <div
          className="card-flip-back"
          onClick={onFlip}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontSize: '40px', lineHeight: 1 }}>{item.emoji}</div>
          <div style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255,20,147,0.6)',
          }}>
            Aki&apos;s note
          </div>
          <p style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.8vw, 22px)',
            color: 'rgba(255,240,245,0.85)',
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: '28ch',
          }}>
            &ldquo;{item.akiNote}&rdquo;
          </p>
          <button
            onClick={onFlip}
            style={{
              marginTop: '8px',
              padding: '8px 20px',
              borderRadius: '100px',
              border: '1px solid rgba(255,20,147,0.3)',
              background: 'transparent',
              color: '#FF1493',
              fontFamily: 'var(--font-figtree)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            flip back ↺
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Carousel Card ── */
function CarouselCard({ 
  item, 
  onZoom,
  flipped,
  onFlip 
}: { 
  item: (typeof items)[0]
  onZoom: (item: (typeof items)[0]) => void
  flipped: boolean
  onFlip: () => void
}) {
  const touchTimeout = useRef<NodeJS.Timeout | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const handleTouchStart = () => {
    touchTimeout.current = setTimeout(() => {
      onZoom(item)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (touchTimeout.current) clearTimeout(touchTimeout.current)
  }

  return (
    <motion.div
      layoutId={`closet-card-${item.id}`}
      className="card-flip-container"
      style={{
        scrollSnapAlign: 'center',
        flexShrink: 0,
        width: 'min(340px, 80vw)',
        height: 'clamp(400px, 58vh, 540px)',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div className={`card-flip-inner${flipped ? ' flipped' : ''}`}>
        {/* FRONT face */}
        <motion.div
          onDoubleClick={() => onZoom(item)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          className="card-flip-front"
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            boxShadow: '0 4px 20px var(--shadow-sm)',
          }}
        >
          {/* Spotlight Effect */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, var(--card-border-hover), transparent 80%)`,
              opacity: 0.15,
              zIndex: 1,
            }}
          />

          {/* Flip Button */}
          {item.akiNote && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFlip()
              }}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,20,147,0.1)',
                border: '1px solid rgba(255,20,147,0.2)',
                color: '#FF1493',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                fontSize: '14px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(180deg)'
                e.currentTarget.style.background = 'rgba(255,20,147,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg)'
                e.currentTarget.style.background = 'rgba(255,20,147,0.1)'
              }}
              aria-label="Flip card"
              title="Read Aki's note"
            >
              ↻
            </button>
          )}

          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              fontFamily: 'var(--font-bodoni-moda)',
              fontStyle: 'italic',
              fontSize: '60px',
              color: 'rgba(194,24,91,0.04)',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {String(item.id).padStart(2, '0')}
          </div>

          {item.image ? (
            <motion.div
              layoutId={`closet-img-${item.id}`}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px',
                zIndex: 2,
              }}
            >
              <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="340px" loading="lazy" />
            </motion.div>
          ) : (
            <div style={{ fontSize: '52px', lineHeight: 1, marginBottom: '16px', zIndex: 2 }}>{item.emoji}</div>
          )}

          <motion.div layoutId={`closet-content-${item.id}`} style={{ zIndex: 2 }}>
            <h3
              style={{
                fontFamily: 'var(--font-bodoni-moda)',
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                color: 'var(--text-primary)',
                transition: 'color 400ms ease',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--text-mid)',
                transition: 'color 400ms ease',
              }}
            >
              {item.desc}
            </p>
          </motion.div>
        </motion.div>

        {/* BACK face — Aki's note */}
        <div
          className="card-flip-back"
          onClick={onFlip}
          style={{ cursor: 'pointer', borderRadius: '20px' }}
        >
          <div style={{ fontSize: '40px', lineHeight: 1 }}>{item.emoji}</div>
          <div style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255,20,147,0.6)',
          }}>
            Aki&apos;s note
          </div>
          <p style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.8vw, 22px)',
            color: 'rgba(255,240,245,0.85)',
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: '28ch',
          }}>
            &ldquo;{item.akiNote}&rdquo;
          </p>
          <button
            onClick={onFlip}
            style={{
              marginTop: '8px',
              padding: '8px 20px',
              borderRadius: '100px',
              border: '1px solid rgba(255,20,147,0.3)',
              background: 'transparent',
              color: '#FF1493',
              fontFamily: 'var(--font-figtree)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            flip back ↺
          </button>
        </div>
      </div>
    </motion.div>
  )
}
