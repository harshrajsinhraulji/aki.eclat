'use client'

/**
 * components/layout/CustomCursor.tsx
 * Desktop only (pointer:fine). Never visible on touch devices.
 *
 * UPGRADES:
 * — #1 Velocity-based ring deformation: when cursor moves fast,
 *      the ring stretches in the direction of travel.
 *
 * Light background update:
 * — Outer ring: 32px, border 1.5px solid rgba(255,20,147,0.5), trailing lag
 * — Inner dot: 6px, solid #FF1493 (hot pink), follows instantly
 * — On hoverable: outer ring scales to 2x, opacity 0.5, dot hides
 * — On text: outer ring morphs to thin vertical line 2px × 24px
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

export function CustomCursor() {
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  // Outer ring: luxurious ~120ms lag via low stiffness spring
  const ringX = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.6 })
  const ringY = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.6 })
  // Inner dot: instantaneous
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 40, mass: 0.1 })
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 40, mass: 0.1 })

  const ringSize = useMotionValue(32)
  const ringOpacity = useMotionValue(0)
  const ringScaleX = useMotionValue(1)
  const ringScaleY = useMotionValue(1)
  const dotScale = useMotionValue(1)
  const dotOpacity = useMotionValue(1)

  const [cursorText, setCursorText] = useState('')
  const [cursorIcon, setCursorIcon] = useState('')

  // Velocity tracking for stretch effect
  const prevPos = useRef({ x: -200, y: -200 })
  const velRef = useRef({ vx: 0, vy: 0 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    let entered = false
    let isOnHoverable = false
    let isOnText = false

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - prevPos.current.x
      const dy = e.clientY - prevPos.current.y
      prevPos.current = { x: e.clientX, y: e.clientY }

      // Smooth velocity with exponential decay
      velRef.current.vx = velRef.current.vx * 0.7 + dx * 0.3
      velRef.current.vy = velRef.current.vy * 0.7 + dy * 0.3

      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      if (!entered) {
        ringOpacity.set(1)
        entered = true
      }

      // Velocity-based stretch — only apply when in default cursor mode
      if (!isOnHoverable && !isOnText) {
        const speed = Math.hypot(velRef.current.vx, velRef.current.vy)
        if (speed > 3) {
          const angle = Math.atan2(velRef.current.vy, velRef.current.vx)
          const stretch = Math.min(speed * 0.065, 0.7) // max 70% stretch

          // Stretch along velocity direction
          const stretchX = 1 + Math.abs(Math.cos(angle)) * stretch
          const stretchY = 1 + Math.abs(Math.sin(angle)) * stretch

          // Compress on the perpendicular axis
          ringScaleX.set(stretchX * 0.92)
          ringScaleY.set((1 / stretchX) + Math.abs(Math.sin(angle)) * stretch * 0.85)
        } else {
          // Relax back to circle
          ringScaleX.set(1)
          ringScaleY.set(1)
        }
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      const customTextEl = target.closest('[data-cursor-text]')
      if (customTextEl) {
        const text = customTextEl.getAttribute('data-cursor-text') || ''
        setCursorText(text)
        setCursorIcon('')
        ringSize.set(64)
        ringScaleX.set(1)
        ringScaleY.set(1)
        dotScale.set(0)
        dotOpacity.set(0)
        isOnHoverable = true
        isOnText = false
        return
      }

      const sectionEl = target.closest('section')
      let sectionIcon = ''
      if (sectionEl) {
        if (sectionEl.id === 'closet') sectionIcon = '⌕' // Magnifying glass or plus
        else if (sectionEl.id === 'confessions') sectionIcon = '👁'
        else if (sectionEl.id === 'artwords') sectionIcon = '✒️'
      }

      setCursorText('')
      setCursorIcon(sectionIcon)

      if (target.closest('[data-hover]') || target.closest('button') || target.closest('a')) {
        // Hoverable: ring 2× size, dot hides, reset stretch
        setCursorIcon('')
        ringSize.set(64)
        ringScaleX.set(1)
        ringScaleY.set(1)
        dotScale.set(0)
        dotOpacity.set(0)
        isOnHoverable = true
        isOnText = false
      } else if (
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3'
      ) {
        // Text: outer ring → thin vertical line
        setCursorIcon('')
        ringSize.set(24)
        ringScaleX.set(0.083)
        ringScaleY.set(1)
        dotScale.set(1)
        dotOpacity.set(1)
        isOnHoverable = false
        isOnText = true
      } else {
        // Default
        ringSize.set(sectionIcon ? 48 : 32)
        ringScaleX.set(1)
        ringScaleY.set(1)
        dotScale.set(1)
        dotOpacity.set(sectionIcon ? 0 : 1)
        isOnHoverable = false
        isOnText = false
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [mouseX, mouseY, ringOpacity, ringScaleX, ringScaleY, ringSize, dotScale, dotOpacity])

  return (
    <div aria-hidden style={{ pointerEvents: 'none' }}>
      {/* Outer ring — trailing, luxurious lag, velocity-deformed */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: '1.5px solid white',
          background: 'transparent',
          scaleX: ringScaleX,
          scaleY: ringScaleY,
          opacity: ringOpacity,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          mixBlendMode: 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        transition={{
          width: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          scaleX: { duration: 0.15 },
          scaleY: { duration: 0.15 },
        }}
      >
        <AnimatePresence>
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{
                fontFamily: 'var(--font-figtree)',
                fontSize: '9px',
                fontWeight: 600,
                color: '#FF1493',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {cursorText}
            </motion.span>
          )}
          {cursorIcon && !cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
              style={{
                fontSize: '18px',
                lineHeight: 1,
                color: 'rgba(255,20,147,0.7)',
                filter: 'drop-shadow(0 2px 4px rgba(255,20,147,0.3))',
              }}
            >
              {cursorIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner dot — hot pink, instantaneous */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'white',
          scale: dotScale,
          opacity: dotOpacity,
          pointerEvents: 'none',
          zIndex: 100000,
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  )
}
