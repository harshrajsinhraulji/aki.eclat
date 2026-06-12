'use client'

/**
 * components/ui/AnehEasterEgg.tsx
 * Keyboard sequence easter egg: type "a" "n" "e" "h" anywhere on the page
 * → 50 SVG bows rain down from the top of the viewport.
 *
 * Each bow has:
 * — Random horizontal position (0–100%)
 * — Random rotation (-30° to +30°)
 * — Random scale (0.6–1.4)
 * — Random duration (1.2s–2.4s)
 * — Random delay (0–400ms)
 *
 * The bows use CSS animation (bow-fall keyframe from globals.css)
 * for GPU-only animation. No JS requestAnimationFrame loop.
 * After 3s (max bow-duration + delay), bows are cleaned up from DOM.
 */

import { useEffect, useState, useCallback } from 'react'
import { BowSvg } from '@/components/ui/BowSvg'

const TARGET = 'aneh'
const BOW_COUNT = 40

interface BowParticle {
  id: number
  x: number      // 0–100% left
  rot: number    // -30 to +30 degrees
  scale: number  // 0.6 to 1.4
  dur: string    // animation duration
  delay: string  // animation delay
  size: number   // 14–28px
  color: string  // hot pink or deep rose
}

const COLORS = ['#FF1493', '#C2185B', '#E91E63', '#AD1457']

function randomBow(id: number): BowParticle {
  return {
    id,
    x: Math.random() * 100,
    rot: Math.random() * 60 - 30,
    scale: 0.6 + Math.random() * 0.8,
    dur: `${1.2 + Math.random() * 1.2}s`,
    delay: `${Math.random() * 0.4}s`,
    size: 14 + Math.floor(Math.random() * 14),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

export function AnehEasterEgg() {
  const [bows, setBows] = useState<BowParticle[]>([])
  const [buffer, setBuffer] = useState('')

  const triggerRain = useCallback(() => {
    const particles = Array.from({ length: BOW_COUNT }, (_, i) => randomBow(i))
    setBows(particles)
    /* Clean up after max animation duration finishes */
    setTimeout(() => setBows([]), 3200)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      /* Ignore if focused on input/textarea/select */
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const newBuffer = (buffer + e.key.toLowerCase()).slice(-TARGET.length)
      setBuffer(newBuffer)

      if (newBuffer === TARGET) {
        triggerRain()
        setBuffer('')
      }
    }

    /* Custom event: double-clicking AKI in the hero fires this */
    const handleCustom = () => triggerRain()

    window.addEventListener('keydown', handleKey)
    window.addEventListener('aki-bow-rain', handleCustom)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('aki-bow-rain', handleCustom)
    }
  }, [buffer, triggerRain])

  if (bows.length === 0) return null

  return (
    <div className="bow-rain-container" aria-hidden>
      {bows.map((bow) => (
        <div
          key={bow.id}
          className="bow-rain-item"
          style={{
            '--bow-x': `${bow.x}%`,
            '--bow-rot': `${bow.rot}deg`,
            '--bow-scale': bow.scale,
            '--bow-dur': bow.dur,
            '--bow-delay': bow.delay,
          } as React.CSSProperties}
        >
          <BowSvg size={bow.size} color={bow.color} />
        </div>
      ))}
    </div>
  )
}
