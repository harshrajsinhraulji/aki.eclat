'use client'

/**
 * components/layout/LoadingScreen.tsx
 *
 * Sequence (first visit):
 *   0ms:    Pink background. Grain. Horizontal line extends from centre.
 *   400ms:  "AKI" letters slide up individually (100ms stagger).
 *   900ms:  Tagline fades up with bow.
 *   1700ms: Everything scales down + fades out.
 *   2150ms: onComplete() fires → hero visible.
 *
 * Subsequent visits: onComplete() fires immediately (no screen shown).
 * Uses a single unified useEffect to avoid race conditions.
 */

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BowSvg } from '@/components/ui/BowSvg'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState<'line' | 'letters' | 'tagline' | 'exit'>('line')
  const calledComplete = useRef(false)

  useEffect(() => {
    // Guard — only call onComplete once
    const complete = () => {
      if (!calledComplete.current) {
        calledComplete.current = true
        onComplete()
      }
    }

    const hasVisited = sessionStorage.getItem('aki-visited')
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (hasVisited || prefersReducedMotion) {
      // Returning visitor or prefers-reduced-motion — skip loading screen immediately
      complete()
      return
    }

    // First visit — run full sequence
    sessionStorage.setItem('aki-visited', '1')

    const t0 = setTimeout(() => setVisible(true), 0)
    const t1 = setTimeout(() => setPhase('letters'), 400)
    const t2 = setTimeout(() => setPhase('tagline'), 900)
    const t3 = setTimeout(() => setPhase('exit'), 1700)
    const t4 = setTimeout(() => {
      setVisible(false)
      complete()
    }, 2150)

    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // Run once — onComplete is stable (wrapped in useCallback in parent)

  const letters = ['A', 'K', 'I']

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          transition={{ duration: 0.45, ease: [0.87, 0, 0.13, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: '#FFF0F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {/* Grain overlay */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.025,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundSize: '300px 300px',
              pointerEvents: 'none',
            }}
          />

          {/* Extending horizontal line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(255,20,147,0.4), transparent)',
              transformOrigin: 'center',
            }}
          />

          {/* AKI letters */}
          <motion.div
            animate={phase === 'exit' ? { scale: 0.96, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.87, 0, 0.13, 1] }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.01em',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {letters.map((letter, i) => (
              <div
                key={letter}
                style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 0.85 }}
              >
                <motion.span
                  initial={{ y: '110%' }}
                  animate={
                    phase === 'letters' || phase === 'tagline' || phase === 'exit'
                      ? { y: '0%' }
                      : { y: '110%' }
                  }
                  transition={{
                    duration: 0.75,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-bodoni-moda)',
                    fontSize: 'clamp(96px, 16vw, 200px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 0.85,
                    background:
                      'linear-gradient(175deg, #FF1493 0%, #C2185B 55%, #AD1457 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {letter}
                </motion.span>
              </div>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
            animate={
              phase === 'tagline'
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : phase === 'exit'
                ? { opacity: 0, y: 6, filter: 'blur(3px)' }
                : { opacity: 0, y: 16, filter: 'blur(5px)' }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 2vw, 22px)',
              color: '#C2185B',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            aneh, I&apos;m just a girl
            <BowSvg size={20} color="#C2185B" swing={false} />
          </motion.div>

          {/* Animated loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'exit' ? 0 : 0.45 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '44px',
              display: 'flex',
              gap: '6px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.18,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#C2185B',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
