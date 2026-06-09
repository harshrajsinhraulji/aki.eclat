'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Leaderboard from '@/components/arcade/Leaderboard'

export function ArcadeTeaser() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section
      ref={containerRef}
      id="arcade-teaser"
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0306', // Deep dark theme matching Diamond 1 / Psychology
        overflow: 'hidden',
        padding: '100px 24px',
      }}
    >
      {/* Inline Noise Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

      {/* Ambient glowing orbs */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, rgba(255,20,147,0.15) 0%, rgba(10,3,6,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          y: y1,
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(194,24,91,0.1) 0%, rgba(10,3,6,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          y: useTransform(scrollYProgress, [0, 1], [-50, 150]),
        }}
      />

      <motion.div
        style={{ opacity, position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px' }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(48px, 8vw, 100px)',
            color: '#FFF5F8',
            marginBottom: '24px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          The Archives
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(255,245,248,0.7)',
            marginBottom: '48px',
            maxWidth: '500px',
            marginInline: 'auto',
            lineHeight: 1.6,
          }}
        >
          Three psychological tests masked as minimal amusements. Synthesis, Thread, and Echoes. Can you reach the terminal state?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/arcade" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,20,147,0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-block',
                padding: '16px 48px',
                background: 'rgba(255,20,147,0.1)',
                border: '1px solid rgba(255,20,147,0.3)',
                borderRadius: '100px',
                color: '#FFB6D9',
                fontFamily: 'var(--font-figtree)',
                fontSize: '14px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,20,147,0.8)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,20,147,0.3)' }}
            >
              Enter Simulation
            </motion.div>
          </Link>
        </motion.div>

        {/* Global Leaderboards Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: '80px', display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <div style={{ flex: '1 1 250px', maxWidth: '350px' }}>
            <Leaderboard game="synthesis" />
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: '350px' }}>
            <Leaderboard game="thread" />
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: '350px' }}>
            <Leaderboard game="echoes" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
