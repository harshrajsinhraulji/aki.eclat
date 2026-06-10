'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { plushies } from '@/lib/data'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { easings } from '@/lib/motion'

// --- Custom Hover Cursor ---
// A tiny sparkling wand cursor for the plushies
const customCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23FF1493" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5z"/><path d="M22 22L12 12"/></svg>') 12 12, auto`

// --- Volumetric Dust Motes ---
const DUST = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: 10 + Math.random() * 20,
  delay: Math.random() * 10,
}))

function DustMotes() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {DUST.map((m) => (
        <motion.div
          key={m.id}
          animate={{
            y: ['0vh', '-10vh', '0vh'],
            x: ['0vw', '2vw', '0vw'],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            borderRadius: '50%',
            background: 'var(--text-soft)',
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  )
}

// --- Typewriter Text ---
function TypewriterText({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', marginRight: '4px' }}>
          {word.split('').map((char, j) => (
            <motion.span
              key={j}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (i * 5 + j) * 0.02, duration: 0.1 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

// --- Tilt Hook with Gravity ---
function useGodlyTilt(ref: React.RefObject<HTMLElement | null>) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 300, damping: 30 }
  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg'])
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ['-8px', '8px'])
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ['-8px', '8px'])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  return { rotateX, rotateY, translateX, translateY, handleMouseMove, handleMouseLeave }
}

// --- Desktop Plushie Card ---
function DesktopPlushie({
  plushie,
  index,
  isHovered,
  isAnyHovered,
  onHoverStart,
  onHoverEnd,
}: {
  plushie: typeof plushies[0]
  index: number
  isHovered: boolean
  isAnyHovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { rotateX, rotateY, translateX, translateY, handleMouseMove, handleMouseLeave } = useGodlyTilt(ref)
  const [bouncing, setBouncing] = useState(false)
  
  return (
    <motion.div
      ref={ref}
      onHoverStart={onHoverStart}
      onHoverEnd={() => { onHoverEnd(); handleMouseLeave() }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        setBouncing(true)
        setTimeout(() => setBouncing(false), 400)
      }}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: easings.outExpo }}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/4',
        borderRadius: '32px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: isHovered 
          ? `0 40px 100px ${plushie.color}35, 0 0 0 1px ${plushie.color}80` 
          : '0 12px 40px var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        x: isHovered ? translateX : 0,
        y: bouncing ? -20 : (isHovered ? translateY : 0),
        scale: isHovered ? 1.05 : 1,
        opacity: isAnyHovered && !isHovered ? 0.3 : 1,
        filter: isAnyHovered && !isHovered ? 'blur(4px) grayscale(0.6)' : 'blur(0px) grayscale(0)',
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
        cursor: customCursor,
        overflow: 'hidden',
        zIndex: isHovered ? 20 : 1,
        marginTop: index % 2 === 1 ? '80px' : '0', // Masonry Stagger
      }}
    >
      {/* Dynamic God Ray / Spotlight */}
      <div 
        aria-hidden
        style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150%',
          height: '150%',
          background: `radial-gradient(circle at top, ${plushie.color}30 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.6s ease',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      {/* 3D Pedestal Floor */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '20%',
          width: '80%',
          height: '40px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '50%',
          filter: 'blur(10px)',
          transform: 'translateZ(-20px)',
        }}
      />

      {/* Plushie Image with micro-vibrations */}
      <motion.div
        animate={{ scale: isHovered ? 1.05 : [1, 1.015, 1], y: isHovered ? -10 : [0, -4, 0] }}
        transition={{
          scale: isHovered ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 },
          y: isHovered ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 },
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '55%',
          marginBottom: '20px',
          zIndex: 2,
          transform: 'translateZ(40px)', // Pop out
        }}
      >
        <Image 
          src={plushie.image} 
          alt={plushie.name} 
          fill
          sizes="(max-width: 1024px) 200px, 300px"
          style={{ 
            objectFit: 'contain',
            filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.3))`,
          }}
        />
        {/* Click Sparkles */}
        <AnimatePresence>
          {bouncing && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: -20, pointerEvents: 'none' }}>
               {[...Array(6)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ scale: 0, x: 0, y: 0 }}
                   animate={{ 
                     scale: [0, 1, 0], 
                     x: (Math.random() - 0.5) * 100,
                     y: (Math.random() - 0.5) * 100
                   }}
                   transition={{ duration: 0.6, ease: 'easeOut' }}
                   style={{
                     position: 'absolute',
                     top: '50%', left: '50%',
                     width: '8px', height: '8px',
                     background: plushie.color,
                     borderRadius: '50%',
                     boxShadow: `0 0 10px ${plushie.color}`,
                   }}
                 />
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <span
        style={{
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(22px, 2.5vw, 28px)',
          color: 'var(--text-primary)',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          zIndex: 2,
          transform: 'translateZ(30px)',
        }}
      >
        {plushie.name}
      </span>

      {plushie.isSpecial && (
        <div
          style={{
            position: 'absolute',
            top: '20px', right: '20px',
            fontFamily: 'var(--font-figtree)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: plushie.color,
            background: `color-mix(in srgb, ${plushie.color} 15%, transparent)`,
            padding: '6px 12px',
            borderRadius: '100px',
            border: `1px solid color-mix(in srgb, ${plushie.color} 30%, transparent)`,
            transform: 'translateZ(20px)',
            backdropFilter: 'blur(4px)',
          }}
        >
          ✦ Special
        </div>
      )}

      {/* Glassmorphism Lore Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: '24px 32px',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderTop: `1px solid var(--glass-border)`,
              zIndex: 10,
              transform: 'translateZ(50px)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                fontSize: '18px',
                color: 'var(--text-primary)',
                textAlign: 'center',
                lineHeight: 1.4,
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <TypewriterText text={plushie.lore} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- Mobile Cover Flow Component ---
function MobileCoverFlow() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const handleDragEnd = (e: any, info: PanInfo) => {
    if ('vibrate' in navigator) navigator.vibrate(10)
    if (info.offset.x < -40 && activeIndex < plushies.length - 1) {
      setActiveIndex(prev => prev + 1)
    } else if (info.offset.x > 40 && activeIndex > 0) {
      setActiveIndex(prev => prev - 1)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ position: 'absolute', inset: 0, zIndex: 100, touchAction: 'pan-y' }}
      />
      
      {plushies.map((plushie, index) => {
        const offset = index - activeIndex
        const isCenter = offset === 0
        
        return (
          <motion.div
            key={plushie.id}
            animate={{
              x: offset * 180,
              scale: isCenter ? 1 : 0.75,
              rotateY: offset * -25,
              zIndex: 10 - Math.abs(offset),
              opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.35,
              filter: isCenter ? 'blur(0px) grayscale(0%)' : 'blur(4px) grayscale(80%)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              width: '260px',
              height: '380px',
              borderRadius: '24px',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: isCenter ? `0 32px 80px ${plushie.color}40` : '0 8px 32px var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              transformStyle: 'preserve-3d',
              pointerEvents: 'none', // Let the drag layer handle it
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '55%',
                marginBottom: '16px',
                transform: 'translateZ(30px)',
              }}
            >
              <Image 
                src={plushie.image} 
                alt={plushie.name} 
                fill
                sizes="260px"
                style={{ objectFit: 'contain', filter: `drop-shadow(0 16px 24px rgba(0,0,0,0.25))` }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-bodoni-moda)',
                fontSize: '24px',
                color: 'var(--text-primary)',
                textAlign: 'center',
                letterSpacing: '-0.02em',
                transform: 'translateZ(20px)',
                marginBottom: isCenter ? '12px' : '0',
              }}
            >
              {plushie.name}
            </span>
            
            <AnimatePresence>
              {isCenter && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    fontFamily: 'var(--font-instrument-serif)',
                    fontStyle: 'italic',
                    fontSize: '16px',
                    color: 'var(--text-soft)',
                    textAlign: 'center',
                    lineHeight: 1.3,
                    margin: 0,
                    transform: 'translateZ(10px)',
                  }}
                >
                  {plushie.lore}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
      
      {/* Pagination dots */}
      <div style={{ position: 'absolute', bottom: '10px', display: 'flex', gap: '8px', zIndex: 101, pointerEvents: 'none' }}>
        {plushies.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === activeIndex ? 'var(--accent-primary)' : 'var(--card-border-hover)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// --- Main Section ---
export function PlushieGang() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yParallax = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsDesktop(window.innerWidth >= 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Instead of returning null early, we render the section so `useScroll` can attach the ref immediately.
  // We conditionally render the contents after mounting to prevent hydration mismatch.

  return (
    <section
      id="plushies"
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        padding: 'clamp(80px, 10vh, 160px) 0',
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {mounted && (
        <>
          {/* Progressive Disclosure Lighting */}
          <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, var(--blob-color-1), transparent)',
          opacity: 0.05,
          pointerEvents: 'none',
          y: yParallax,
        }}
      />
      <DustMotes />

      <div style={{ padding: '0 clamp(24px, 6vw, 120px)', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easings.outExpo }}
          style={{ marginBottom: 'clamp(60px, 8vh, 100px)' }}
        >
          <div style={{ marginBottom: '24px' }}>
            <SectionLabel>The Plushie Gang</SectionLabel>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(44px, 6vw, 96px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: 'var(--text-primary)',
            }}
          >
            They&apos;re family,
            <br />
            <span
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                color: 'var(--accent-hot)',
              }}
            >
              not decorations.
            </span>
          </h2>
        </motion.div>

        {isDesktop ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(24px, 3vw, 48px)', paddingBottom: '80px' }}>
            {plushies.map((plushie, i) => (
              <DesktopPlushie
                key={plushie.id}
                plushie={plushie}
                index={i}
                isHovered={hoveredIndex === i}
                isAnyHovered={hoveredIndex !== null}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        ) : (
          <MobileCoverFlow />
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            marginTop: 'clamp(40px, 6vh, 80px)',
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2vw, 24px)',
            color: 'var(--text-soft)',
            textAlign: isDesktop ? 'left' : 'center',
          }}
        >
          {isDesktop ? "Hover over them. They have things to say." : "Swipe to explore. They have things to say."}
        </motion.p>
      </div>
        </>
      )}
    </section>
  )
}
