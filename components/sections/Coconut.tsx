'use client'

/**
 * components/sections/Coconut.tsx
 * Section 01 — Who is Aki.
 * Editorial split layout. whileInView animations.
 * Left: label + luxury image card.
 * Right: headline monument + mysterious, posh body copy + signature tags.
 */

import { motion } from 'framer-motion'
import Image from 'next/image'

const easingExpo = [0.16, 1, 0.3, 1] as const

export function Coconut() {
  return (
    <section
      id="coconut"
      style={{
        position: 'relative',
        width: '100%',
        background: '#FFF0F5',
        overflow: 'hidden',
        padding: 'clamp(80px, 14vh, 160px) clamp(24px, 6vw, 80px)',
      }}
    >
      {/* Decorative large watermark number */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-2%',
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(160px, 25vw, 380px)',
          lineHeight: 1,
          color: 'rgba(255,20,147,0.04)',
          fontStyle: 'italic',
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.04em',
        }}
        aria-hidden
      >
        01
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'clamp(160px, 25vw, 340px) 1fr',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'start',
        }}
        className="md:grid-cols-[clamp(160px,25vw,340px)_1fr] grid-cols-1"
      >
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easingExpo }}
        >
          {/* Section label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#C9A465',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 500,
                fontSize: '10px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#A8627A',
              }}
            >
              01 — The Enigma
            </span>
          </div>

          {/* Luxury Image Card */}
          <motion.div
            whileHover={{ rotate: -2, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: '100%',
              aspectRatio: '3/4',
              borderRadius: '24px',
              border: '1px solid rgba(255,20,147,0.14)',
              background: 'rgba(255,255,255,0.5)',
              padding: '8px',
              boxShadow: '0 12px 40px rgba(255,20,147,0.1)',
              position: 'relative',
              marginBottom: '32px',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', background: '#FCE4EC' }}>
              {/* Note: Save the provided image as 'aki-cake.png' in the 'public' folder */}
              <Image 
                src="/aki-cake.png" 
                alt="Aki holding a pink cake"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 80vw, 33vw"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Right column — editorial text */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: easingExpo }}
        >
          {/* Headline */}
          <h2
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(42px, 6vw, 84px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#FF1493',
              margin: '0 0 8px 0',
            }}
          >
            Too soft for London.
          </h2>
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(42px, 6vw, 84px)',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              color: '#C2185B',
              margin: '0 0 clamp(40px, 6vh, 64px) 0',
            }}
          >
            Too feral for anywhere else.
          </h2>

          {/* Body copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '540px' }}>
            <p
              style={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 300,
                fontSize: 'clamp(18px, 2vw, 24px)',
                lineHeight: 1.6,
                color: '#6B2D4A',
              }}
            >
              An enigma wrapped in oversized bows. I collect secrets, obsess over the psychology of spaces, and outplay you at 3am.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(22px, 2.4vw, 32px)',
                color: '#C2185B',
                lineHeight: 1.4,
                marginTop: '12px',
                paddingLeft: '20px',
                borderLeft: '2px solid rgba(255,20,147,0.25)',
              }}
            >
              You can try to figure me out. Good luck.
            </p>
          </div>

          {/* Signature tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: 'clamp(36px, 5vh, 56px)',
            }}
          >
            {['sri lanka 🇱🇰', 'london 🇬🇧', 'diamond 1', 'interior design', 'manta rays', 'coconut'].map(
              (tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: easingExpo }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  style={{
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 400,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#A8627A',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    border: '1px solid rgba(168,98,122,0.2)',
                    background: 'rgba(168,98,122,0.06)',
                    cursor: 'default',
                  }}
                >
                  {tag}
                </motion.span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
