'use client'

/**
 * components/layout/CursorTrail.tsx
 * Creates a bloom/dissolve trail of pink dots behind the cursor.
 * DOM-based. Max 10 particles alive at once.
 * Capped at 50ms between spawns — 60fps safe.
 */

import { useEffect, useRef } from 'react'

interface Particle {
  el: HTMLDivElement
  x: number
  y: number
  created: number
  size: number
}

export function CursorTrail() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const particles = useRef<Particle[]>([])
  const lastSpawn = useRef(0)
  const rafId = useRef<number>(0)
  const isPointer = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return
    isPointer.current = true

    const container = containerRef.current
    if (!container) return

    const MAX = 10
    const LIFETIME = 600 // ms

    const tick = (now: number) => {
      particles.current = particles.current.filter((p) => {
        const age = now - p.created
        if (age > LIFETIME) {
          p.el.remove()
          return false
        }
        const progress = age / LIFETIME
        const opacity = Math.max(0, 1 - progress * progress)
        const scale = 0.2 + progress * 0.8
        p.el.style.opacity = String(opacity * 0.6)
        p.el.style.transform = `translate(-50%, -50%) scale(${scale})`
        return true
      })
      rafId.current = requestAnimationFrame(tick)
    }

    const spawn = (x: number, y: number) => {
      if (particles.current.length >= MAX) {
        const oldest = particles.current.shift()
        oldest?.el.remove()
      }

      const el = document.createElement('div')
      const size = 8 + Math.random() * 8
      el.style.cssText = `
        position:fixed;
        left:${x}px;
        top:${y}px;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:radial-gradient(circle, rgba(255,20,147,0.8) 0%, rgba(255,20,147,0) 100%);
        pointer-events:none;
        z-index:99998;
        transform:translate(-50%,-50%) scale(0.2);
        will-change:transform,opacity;
      `
      container.appendChild(el)
      particles.current.push({ el, x, y, created: performance.now(), size })
    }

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawn.current < 40) return
      lastSpawn.current = now
      spawn(e.clientX, e.clientY)
    }

    rafId.current = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      particles.current.forEach((p) => p.el.remove())
      particles.current = []
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99997,
        overflow: 'hidden',
      }}
    />
  )
}
