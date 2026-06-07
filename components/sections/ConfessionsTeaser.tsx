'use client'

/**
 * components/sections/ConfessionsTeaser.tsx
 * Shows 3 latest live confessions from Firebase with world-class hover effects.
 * Falls back to static samples if Firebase is unavailable.
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate, MotionValue } from 'framer-motion'
import Link from 'next/link'
import { easings } from '@/lib/motion'
import { firestore } from '@/lib/firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

const SAMPLE_CONFESSIONS = [
  { id: '1', text: "I pretend to like matcha so I look mysterious.", author: "anon" },
  { id: '2', text: "I booked a 7cups session just because you looked kind.", author: "lost" },
  { id: '3', text: "I still haven't told them I'm Diamond 1 too.", author: "challenger" },
]

const ROTATIONS = [-4, 2, -1.5]

function WhisperCard({ text, author, index, mouseX, mouseY }: { text: string; author: string; index: number; mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRipped, setIsRipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Dynamic Shadow Casting (Light Source Physics)
  const shadowX = useTransform([mouseX, mouseY], ([x, y]: number[]) => {
    if (!cardRef.current || x === -1000) return 0
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    return (centerX - x) * 0.04
  })

  const shadowY = useTransform([mouseX, mouseY], ([x, y]: number[]) => {
    if (!cardRef.current || y === -1000) return 12
    const rect = cardRef.current.getBoundingClientRect()
    const centerY = rect.top + rect.height / 2
    return Math.max((centerY - y) * 0.04, 4)
  })

  const defaultShadow = useMotionTemplate`${shadowX}px ${shadowY}px 28px rgba(255,20,147,0.08), 0 0 0 1px var(--card-border)`
  const hoverShadow = useMotionTemplate`${shadowX}px ${shadowY}px 80px rgba(255,20,147,0.25), 0 0 0 1px var(--card-border-hover), 0 0 20px rgba(255,20,147,0.08)`

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: "A whisper from Aki's Wall",
        text: `"${text}" — on Aki's Wall`,
        url: window.location.origin + '/confessions',
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`"${text}" — anon on Aki's Wall (${window.location.origin}/confessions)`)
      alert('Copied whisper to clipboard!')
    }
  }

  return (
    <AnimatePresence>
      {!isRipped && (
        <motion.div
          ref={cardRef}
          layoutId={`whisper-${text.substring(0, 10)}`}
          drag
          dragSnapToOrigin={true}
          dragElastic={0.4}
          onDragEnd={(e, info) => {
            const distance = Math.hypot(info.offset.x, info.offset.y)
            if (distance > 150) {
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([20, 10, 20])
              setIsRipped(true) // Ripped off the wall!
            }
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, y: -60, rotate: ROTATIONS[index] * 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: ROTATIONS[index] }}
          exit={{ opacity: 0, y: 500, rotate: ROTATIONS[index] + 45, scale: 0.8, filter: 'blur(10px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 16, delay: index * 0.14 }}
          animate={{
            rotate: isHovered ? 0 : ROTATIONS[index],
            y: isHovered ? -16 : 0,
            scale: isHovered ? 1.04 : 1,
            zIndex: isHovered ? 10 : 1,
          }}
          style={{
            width: 'clamp(280px, 28vw, 380px)',
            padding: 'clamp(24px, 3vw, 32px)',
            background: 'var(--card-bg)',
            borderRadius: '12px',
            boxShadow: isHovered ? hoverShadow : defaultShadow,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            cursor: 'grab',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.4s ease',
            willChange: 'transform, box-shadow',
          }}
          whileTap={{ cursor: 'grabbing', scale: 1.02 }}
        >
          {/* Live pulse dot */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FF1493',
              boxShadow: isHovered ? '0 0 0 4px rgba(255,20,147,0.15)' : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          />

          {/* Glow shard on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '-40%',
                  left: '-20%',
                  width: '140%',
                  height: '140%',
                  background: 'radial-gradient(ellipse at top left, rgba(255,20,147,0.1) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          <p
            style={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 300,
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              lineHeight: 1.7,
              color: isHovered ? 'var(--text-primary)' : 'var(--text-mid)',
              transition: 'color 0.3s ease',
              position: 'relative',
              zIndex: 1,
              filter: 'url(#ink-bleed)', // Ink Bleed Aesthetics
              opacity: 0.9,
            }}
          >
            &ldquo;{text}&rdquo;
          </p>
          <span
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: '15px',
              color: isHovered ? '#FF1493' : 'var(--text-soft)',
              transition: 'color 0.3s ease',
              position: 'relative',
              zIndex: 1,
              filter: 'url(#ink-bleed)',
            }}
          >
            — {author}
          </span>

          {isHovered && (
            <motion.button
              onClick={handleShare}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                background: 'rgba(255,20,147,0.12)',
                border: '1px solid rgba(255,20,147,0.25)',
                borderRadius: '6px',
                padding: '4px 8px',
                color: '#FF1493',
                fontFamily: 'var(--font-figtree)',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,20,147,0.22)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,20,147,0.12)'}
            >
              Share ✦
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ConfessionsTeaser() {
  const [confessions, setConfessions] = useState(SAMPLE_CONFESSIONS)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  useEffect(() => {
    if (!firestore) return
    try {
      const q = query(
        collection(firestore, 'confessions'),
        orderBy('createdAt', 'desc'),
        limit(3)
      )
      const unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((doc) => ({
          id: doc.id,
          text: (doc.data().text?.stringValue || doc.data().text) as string,
          author: (doc.data().author?.stringValue || doc.data().author || 'anon') as string,
        }))
        if (docs.length >= 3) setConfessions(docs)
      }, () => {/* stay on samples */})
      return () => unsub()
    } catch { /* stay on samples */ }
  }, [])

  useEffect(() => {
    if (!firestore) return
    try {
      const unsub = onSnapshot(collection(firestore, 'confessions'), (snap) => {
        setTotalCount(snap.size)
      }, () => {})
      return () => unsub()
    } catch { /* ignore */ }
  }, [])

  return (
    <section
      id="confessions-teaser"
      onMouseMove={(e) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px)',
        /* Deep intimate blush — not the main blush, slightly more saturated */
        background: '#FFF0F5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(40px, 6vh, 64px)',
      }}
    >
      {/* Ink Bleed Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden>
        <filter id="ink-bleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(120px, 25vw, 360px)',
          color: 'rgba(255,20,147,0.03)',
          letterSpacing: '-0.06em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic',
          lineHeight: 1,
        }}
      >
        spill
      </div>

      {/* Cinematic intro phrase — appears before cards */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '700px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C9A465' }} />
          <span style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 500,
            fontSize: '10px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#C2185B',
          }}>
            06 · The Wall · Live
          </span>
        </div>

        {/* The cinematic hook line */}
        <p style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 3.5vw, 42px)',
          lineHeight: 1.35,
          color: '#6B2D4A',
          marginBottom: '24px',
          letterSpacing: '-0.01em',
        }}>
          &ldquo;they told me things they couldn&apos;t say out loud.&rdquo;
        </p>

        <h2 style={{
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(36px, 6vw, 80px)',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          color: '#1A0A12',
          marginBottom: '12px',
        }}>
          I read every confession.
        </h2>
        <p style={{
          fontFamily: 'var(--font-figtree)',
          fontWeight: 300,
          fontSize: 'clamp(15px, 1.4vw, 18px)',
          color: '#A8627A',
          maxWidth: '380px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          No names. No judgment.
          {totalCount !== null && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'block', color: '#C2185B', fontWeight: 500, marginTop: '8px', fontSize: 'clamp(13px, 1.2vw, 15px)', letterSpacing: '0.06em' }}
            >
              {totalCount.toLocaleString()} whispers and counting.
            </motion.span>
          )}
        </p>
      </motion.div>

      {/* Live confession cards */}
      <div
        style={{
          position: 'relative', /* anchor for ghost card absolute positioning */
          zIndex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          /* Wider gap: 36px floor → 54px ceiling. More editorial space at desktop. */
          gap: 'clamp(20px, 3vw, 40px)',
          justifyContent: 'center',
          alignItems: 'stretch',
          width: '100%',
          /* 1280px allows cards to reach clamp(280px, 28vw, 380px) on all 3 */
          maxWidth: '1280px',
        }}
      >
        {/* Ghost card: 4th decorative element, peeking behind the third.
            aria-hidden: purely atmospheric, no content weight. */}
        <div
          aria-hidden
          style={{
            width: 'clamp(280px, 28vw, 380px)',
            padding: 'clamp(24px, 3vw, 32px)',
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--card-border)',
            position: 'absolute',
            /* Offset right-downward to peek behind third card */
            right: '-8px',
            bottom: '-20px',
            opacity: 0.15,
            transform: 'rotate(-4deg)',
            pointerEvents: 'none',
            zIndex: 0,
            minHeight: '200px',
          }}
        />
        {confessions.slice(0, 3).map((c, i) => (
          <WhisperCard key={c.id} text={c.text} author={c.author} index={i} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>

      {/* Full-width dramatic CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px' }}
      >
        <Link
          href="/confessions"
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 32px 80px rgba(194, 24, 91, 0.30)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: 'clamp(20px, 3vh, 28px) clamp(32px, 5vw, 56px)',
              background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
              borderRadius: '20px',
              boxShadow: '0 16px 48px rgba(194, 24, 91, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-figtree)', fontWeight: 500, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>anonymous · no login</div>
              <div style={{ fontFamily: 'var(--font-bodoni-moda)', fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 32px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Enter the Wall</div>
            </div>
            <div style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-bodoni-moda)', fontStyle: 'italic' }}>✦</div>
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
