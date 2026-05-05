'use client'

/**
 * components/layout/CustomCursor.tsx
 * Desktop only (pointer:fine). Never visible on touch devices.
 *
 * Outer ring: 20px, lazy spring (stiffness 120, damping 20) — trails
 * Inner dot:  5px, snappy spring (stiffness 600, damping 30) — immediate
 *
 * States:
 *   default → ring 20px, border #FF1493
 *   hover   → ring 40px, light pink fill, border thinner
 *   text    → ring squishes to thin vertical line (cursor-text feel)
 */

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const isPointer = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  const ringX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 })
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 30, mass: 0.2 })
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 30, mass: 0.2 })

  const ringSize = useMotionValue(20)
  const ringOpacity = useMotionValue(0)
  const ringBg = useMotionValue('rgba(255,20,147,0)')
  const ringScaleX = useMotionValue(1)
  const ringScaleY = useMotionValue(1)
  const dotScale = useMotionValue(1)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return
    isPointer.current = true

    // Fade in cursor once mouse enters
    let entered = false

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!entered) {
        ringOpacity.set(1)
        entered = true
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-hover]') || target.closest('button') || target.closest('a')) {
        ringSize.set(36)
        ringBg.set('rgba(255,20,147,0.08)')
        ringScaleX.set(1)
        ringScaleY.set(1)
        dotScale.set(0.5)
      } else if (
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3'
      ) {
        ringSize.set(20)
        ringBg.set('rgba(255,20,147,0)')
        ringScaleX.set(0.12)
        ringScaleY.set(1.6)
        dotScale.set(1)
      } else {
        ringSize.set(20)
        ringBg.set('rgba(255,20,147,0)')
        ringScaleX.set(1)
        ringScaleY.set(1)
        dotScale.set(1)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [mouseX, mouseY, ringBg, ringOpacity, ringScaleX, ringScaleY, ringSize, dotScale])

  return (
    <div ref={containerRef} aria-hidden style={{ pointerEvents: 'none' }}>
      {/* Outer ring */}
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
          border: '1.5px solid #FF1493',
          background: ringBg,
          scaleX: ringScaleX,
          scaleY: ringScaleY,
          opacity: ringOpacity,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 }, scaleX: { duration: 0.2 }, scaleY: { duration: 0.2 } }}
      />

      {/* Inner dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#FF1493',
          scale: dotScale,
          opacity: ringOpacity,
          pointerEvents: 'none',
          zIndex: 100000,
          willChange: 'transform',
        }}
      />
    </div>
  )
}
