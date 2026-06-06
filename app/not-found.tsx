'use client'

/**
 * app/not-found.tsx
 * #35 Cinematic 404 redesign
 *
 * — Glitch-flicker on the "404" numeral
 * — Floating ambient blobs
 * — Aki-voice copy
 * — Auto-counting "signal lost" ticker
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { Metadata } from 'next'

export default function NotFound() {
  const [count, setCount] = useState(0)

  // Signal-lost counter ticking up
  useEffect(() => {
    const iv = setInterval(() => {
      setCount((c) => (c + 1) % 9999)
    }, 80)
    return () => clearInterval(iv)
  }, [])

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes glitch-shift {
          0%, 95%, 100% { clip-path: none; transform: none; opacity: 1; }
          96% { clip-path: inset(20% 0 50% 0); transform: translateX(-4px); opacity: 0.85; }
          97% { clip-path: inset(60% 0 10% 0); transform: translateX(4px); opacity: 0.9; }
          98% { clip-path: none; transform: none; opacity: 1; }
          99% { clip-path: inset(40% 0 30% 0); transform: translateX(-2px); }
        }

        @keyframes blob-float-404-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -20px) scale(1.05); }
        }

        @keyframes blob-float-404-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 30px) scale(0.95); }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        .four-zero-four {
          animation: glitch-shift 6s ease-in-out infinite;
        }

        .back-404:hover {
          background: linear-gradient(135deg, #FF1493, #C2185B) !important;
          color: white !important;
          border-color: transparent !important;
          box-shadow: 0 12px 48px rgba(255,20,147,0.4) !important;
        }
      `}</style>

      {/* Ambient blobs */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, var(--blob-color-1) 0%, transparent 65%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          animation: 'blob-float-404-1 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: '400px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, var(--blob-color-2) 0%, transparent 65%)',
          filter: 'blur(48px)',
          borderRadius: '50%',
          animation: 'blob-float-404-2 15s ease-in-out infinite',
        }} />

        {/* Subtle scanline sweep — once on load */}
        <motion.div
          initial={{ y: '-100%', opacity: 0.04 }}
          animate={{ y: '100vh', opacity: [0.04, 0.08, 0] }}
          transition={{ duration: 2, delay: 0.5, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,20,147,0.4), transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Signal-lost diagnostic */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1 }}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          fontFamily: 'var(--font-figtree)',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#FF1493',
        }}
      >
        signal_lost #{String(count).padStart(4, '0')}
      </motion.div>

      {/* aki. watermark */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-bodoni-moda)',
          fontStyle: 'italic',
          fontSize: 'clamp(120px, 25vw, 260px)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          margin: 0,
        }}
      >
        aki.
      </motion.p>

      {/* 404 numeral */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="four-zero-four"
        style={{
          fontFamily: 'var(--font-bodoni-moda)',
          fontVariationSettings: '"wght" 400, "opsz" 96',
          fontSize: 'clamp(100px, 20vw, 220px)',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #FF1493 0%, #C2185B 50%, #FFB6D9 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 12px 40px rgba(255,20,147,0.25))',
        }}
      >
        404
      </motion.h1>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 'clamp(60px, 10vw, 120px)',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,20,147,0.5), transparent)',
          margin: '28px 0',
          transformOrigin: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* Main copy */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 3vw, 38px)',
          color: 'var(--text-primary)',
          transition: 'color 400ms ease',
          textAlign: 'center',
          margin: '0 0 16px',
          maxWidth: '32ch',
          lineHeight: 1.35,
          position: 'relative',
          zIndex: 1,
        }}
      >
        aneh, this page doesn&apos;t exist 🎀
      </motion.p>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-figtree)',
          fontWeight: 300,
          fontSize: 'clamp(13px, 1.4vw, 16px)',
          color: 'var(--text-soft)',
          transition: 'color 400ms ease',
          textAlign: 'center',
          margin: '0 0 40px',
          maxWidth: '40ch',
          letterSpacing: '0.02em',
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1,
        }}
      >
        maybe it was never meant to be found.
        <br />
        <span style={{ opacity: 0.5, fontSize: '0.85em' }}>
          or maybe you just got lost. both are valid.
        </span>
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Link
          href="/"
          className="back-404 btn-tension"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#FF1493',
            textDecoration: 'none',
            padding: '14px 32px',
            border: '1px solid rgba(255,20,147,0.3)',
            borderRadius: '100px',
            transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,20,147,0.03)',
          }}
        >
          ← back to aki&apos;s world
        </Link>
      </motion.div>

      {/* Bottom mini copy */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '24px',
          fontFamily: 'var(--font-figtree)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-soft)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        aki.éclat — page not found
      </motion.p>
    </main>
  )
}
