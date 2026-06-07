'use client'

/**
 * components/sections/LetsTalk.tsx
 * Section 07 — You Found Me.
 *
 * DESKTOP (≥1024px): Two-column editorial split.
 *   Left (6/12 cols): Massive headline + narrative, left-aligned white type.
 *   Right (6/12 cols): CTA button + Discord block + closing note, right-aligned.
 *   Visual tension: left is mass (white, heavy), right is precision (pink accents).
 *   The two columns feel like opposing gravitational forces — not a symmetrical pair.
 *
 * TABLET (768–1023px): Single column, max-width 600px, centered container,
 *   left-aligned text (not centered text — centering long copy is hard to read).
 *
 * MOBILE (<768px): Same as tablet, tighter padding.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { BowSvg } from '@/components/ui/BowSvg'
import { easings, durations } from '@/lib/motion'

/* Discord SVG — official brand mark */
function DiscordIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
    </svg>
  )
}

/* Copyable Discord username block */
function VIPAccessPass() {
  const [copied, setCopied] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('aki.eclat')
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {}
  }

  return (
    <motion.div
      onClick={copy}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -4, boxShadow: '0 40px 100px color-mix(in srgb, var(--text-primary) 15%, transparent)' }}
      whileTap={{ scale: 0.96, y: 8, boxShadow: '0 8px 20px color-mix(in srgb, var(--text-primary) 15%, transparent) inset, 0 4px 10px color-mix(in srgb, var(--text-primary) 5%, transparent)' }}
      initial={{ opacity: 0, y: 40, boxShadow: '0 32px 80px color-mix(in srgb, var(--text-primary) 10%, transparent)' }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: easings.outExpo }}
      style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '1px',
        borderRadius: '24px',
        background: 'color-mix(in srgb, var(--text-primary) 3%, transparent)',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        border: '1px solid color-mix(in srgb, var(--text-primary) 5%, transparent)',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(88,101,242,0.15), transparent 80%)`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(88,101,242,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 32px rgba(88,101,242,0.2)',
          border: '1px solid rgba(88,101,242,0.2)'
        }}>
          <DiscordIcon size={36} color="#5865F2" />
        </div>
        <div style={{ textAlign: 'center' }}>
           <h3 style={{ fontFamily: 'var(--font-figtree)', fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em', margin: 0 }}>aki.eclat</h3>
           <p style={{ fontFamily: 'var(--font-figtree)', fontSize: '11px', fontWeight: 400, color: 'color-mix(in srgb, var(--text-primary) 50%, transparent)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '6px' }}>Discord Access Pass</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '100px', background: 'color-mix(in srgb, var(--text-primary) 4%, transparent)', border: '1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)', marginTop: '8px' }}>
          <motion.div 
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3BA55C', boxShadow: '0 0 8px #3BA55C' }} 
          />
          <AnimatePresence mode="wait">
            <motion.span 
              key={copied ? 'copied' : 'copy'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ fontSize: '10px', color: copied ? '#5865F2' : 'color-mix(in srgb, var(--text-primary) 70%, transparent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: copied ? 700 : 500 }}
            >
              {copied ? 'Copied to clipboard' : 'Click to copy & join'}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export function LetsTalk() {
  const [isDesktop, setIsDesktop] = useState(false)

  // Scroll Velocity Tracking
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const textBlur = useTransform(smoothVelocity, [-1000, 0, 1000], [6, 0, 6])
  const textOpacity = useTransform(smoothVelocity, [-1000, 0, 1000], [0.3, 1, 0.3])
  const textFilter = useMotionTemplate`blur(${textBlur}px)`

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        /* CINEMATIC CLOSE — the final dark. Matches Universe and InfiniteCloset depth. */
        background: '#0A0306',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
        overflow: 'hidden',
      }}
    >
      {/* Top bridge — seamless from ConfessionsTeaser dark bridge */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, #0A0306 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 1,
        }}
      />
      {/* Film-grain texture */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, opacity: 0.032,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: '300px 300px',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Aurora conic gradient — rotates 30s loop, barely visible */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200%',
          height: '200%',
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(255,20,147,0.04), rgba(45,26,46,0) 25%, rgba(201,164,101,0.03) 50%, rgba(45,26,46,0) 75%, rgba(255,20,147,0.04))',
          animation: 'aurora-rotate 30s linear infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Large watermark 'hello' — decorative, behind all content */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-bodoni-moda)',
          /* Enormous — purely atmospheric. Low opacity ensures no contrast conflict. */
          fontSize: 'clamp(120px, 22vw, 340px)',
          color: 'rgba(255,20,147,0.03)',
          letterSpacing: '-0.06em', fontStyle: 'italic', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        }}
      >
        hello
      </div>

      {/* Radial light source — top center */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw', height: '60vw',
          maxWidth: '800px', maxHeight: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,20,147,0.055) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* ── CONTENT CONTAINER ──────────────────────────────────────────────
          Desktop: 2-col grid (6/6 of 12). No centered single column.
          Tablet: single col, max-width 600px, centered in page.
          Every spacing value is on the 8pt scale. */}
      {/* ── CENTRAL CONTENT: Cinematic Hero ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px',
        }}
      >
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easings.outExpo }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}
        >
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C9A465' }} />
          <span style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 500, fontSize: '10px',
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: '#E91E63',
          }}>
            07 — Let&apos;s Talk
          </span>
        </motion.div>

        {/* Massive Screen-Spanning Typography */}
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)', scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: easings.outExpo }}
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(64px, 14vw, 240px)',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            textAlign: 'center',
            /* Light on dark — white cream, luminous */
            color: '#FFF0F5',
            textShadow: '0 32px 80px rgba(233,30,99,0.15)',
            marginBottom: '64px',
          }}
        >
          YOU FOUND <br />
          <span style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            color: '#FF1493',
            opacity: 0.95,
            paddingRight: '4vw'
          }}>
            ME.
          </span>
        </motion.h2>

        {/* VIP Access Pass */}
        <VIPAccessPass />

        {/* Footer Meta Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: '10px',
            letterSpacing: '0.16em',
            /* Soft pink-white on dark */
            color: 'rgba(255,182,217,0.5)',
            opacity: textOpacity,
            filter: textFilter,
            willChange: 'opacity, filter',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 2,
            marginTop: '48px',
          }}
        >
          Sri Lankan blood · London soul<br />
          Interior Design student
        </motion.p>
      </div>

      {/* ── DECONSTRUCTED SOCIAL FOOTER ────────────────────────────────────────────── */}
      <DeconstructedFooter />
    </section>
  )
}

function TikTokIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.34 2.88 2.88 0 0 1 2.31-4.53 2.66 2.66 0 0 1 1.61.53V9.5a5.96 5.96 0 0 0-1.53-.2A6.33 6.33 0 0 0 3.23 15.6a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.53-.25 4.85 4.85 0 0 1-1.28-.7z"/>
    </svg>
  )
}

function InstagramIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function SpotifyIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.746 3.842-.88 7.106-.492 9.715 1.103.294.18.386.562.207.856zm1.226-2.738c-.226.368-.7.484-1.069.257-2.686-1.648-6.786-2.13-9.965-1.166-.412.125-.845-.108-.97-.52-.125-.413.108-.846.52-.97 3.652-1.107 8.163-.566 11.226 1.314.368.225.484.7.258 1.068zm.116-2.855c-3.218-1.91-8.524-2.083-11.583-1.155-.49.148-1.006-.13-1.154-.62-.148-.49.13-1.006.62-1.154 3.518-1.068 9.382-.868 13.085 1.332.44.26.583.83.322 1.27-.26.44-.83.582-1.27.322z"/>
    </svg>
  )
}

function PinterestIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.254 2.656 7.915 6.44 9.31-.086-.795-.164-2.016.034-2.885.176-.78 1.14-4.825 1.14-4.825s-.292-.582-.292-1.44c0-1.348.78-2.355 1.752-2.355.826 0 1.225.62 1.225 1.365 0 .83-.53 2.072-.803 3.224-.228.963.483 1.748 1.43 1.748 1.716 0 3.033-1.81 3.033-4.425 0-2.316-1.666-3.935-4.04-3.935-2.748 0-4.364 2.062-4.364 4.19 0 .832.32 1.724.72 2.21.08.096.09.183.066.284-.075.31-.242.985-.275 1.118-.042.176-.142.213-.326.128-1.218-.567-1.98-2.348-1.98-3.774 0-3.076 2.235-5.9 6.446-5.9 3.385 0 6.015 2.41 6.015 5.62 0 3.365-2.12 6.074-5.064 6.074-1.026 0-1.988-.534-2.318-1.163 0 0-.507 1.93-.63 2.404-.227.876-.84 1.97-1.253 2.64C10.22 23.858 11.096 24 12 24c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
    </svg>
  )
}

function CupsIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <path d="M6 1v3"/>
      <path d="M10 1v3"/>
      <path d="M14 1v3"/>
    </svg>
  )
}

function ArrowUpRightIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

function DeconstructedFooter() {
  const links = [
    { name: '7cups', icon: CupsIcon, url: 'https://www.7cups.com/@cottonhereforu', brandHex: '#2EC1A4', brandRgb: '46, 193, 164' },
    { name: 'TikTok', icon: TikTokIcon, url: 'https://www.tiktok.com/@candy.fountain?_t=8mCetJ6ulmu&_r=1', brandHex: '#00F2FE', brandRgb: '0, 242, 254' },
    { name: 'Insta Blog', icon: InstagramIcon, url: 'https://www.instagram.com/akii.galleries', brandHex: '#E1306C', brandRgb: '225, 48, 108' },
    { name: 'Spotify', icon: SpotifyIcon, url: 'https://open.spotify.com/user/315axoxstgixy7c3danlxtws4vva', brandHex: '#1DB954', brandRgb: '29, 185, 84' },
    { name: 'Pinterest', icon: PinterestIcon, url: 'https://pin.it/RkY3E3PzM', brandHex: '#E60023', brandRgb: '230, 0, 35' },
  ]

  return (
    <div style={{
      width: '100%',
      borderTop: '1px solid color-mix(in srgb, var(--text-primary) 5%, transparent)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      position: 'relative',
      zIndex: 2,
      background: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)',
      backdropFilter: 'blur(20px)',
    }}>
      {links.map((link, i) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          data-hover="link"
          initial="rest"
          whileHover="hover"
          variants={{
            rest: { backgroundColor: 'transparent' },
            hover: { backgroundColor: `rgba(${link.brandRgb}, 0.05)` }
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '40px 24px',
            borderRight: i === links.length - 1 ? 'none' : '1px solid color-mix(in srgb, var(--text-primary) 5%, transparent)',
            textDecoration: 'none',
            color: 'color-mix(in srgb, var(--text-primary) 40%, transparent)',
          }}
        >
          <motion.div 
            variants={{ 
              rest: { color: 'color-mix(in srgb, var(--text-primary) 30%, transparent)', scale: 1, filter: 'drop-shadow(0 0 0px transparent)' }, 
              hover: { color: link.brandHex, scale: 1.1, filter: `drop-shadow(0 0 16px rgba(${link.brandRgb}, 0.6))` } 
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <link.icon size={24} color="currentColor" />
          </motion.div>
          <motion.span 
            variants={{
              rest: { color: 'color-mix(in srgb, var(--text-primary) 40%, transparent)' },
              hover: { color: 'var(--text-primary)' }
            }}
            style={{ 
              fontFamily: 'var(--font-figtree)', 
              fontSize: '10px', 
              fontWeight: 500, 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase' 
            }}
          >
            {link.name}
          </motion.span>
        </motion.a>
      ))}
    </div>
  )
}
