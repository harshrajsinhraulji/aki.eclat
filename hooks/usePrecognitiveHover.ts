'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * usePrecognitiveHover
 * Mathematically predicts if the user's cursor is moving towards an anchor tag.
 * If a collision is highly probable, it pre-fetches the route instantly.
 */
export function usePrecognitiveHover() {
  const router = useRouter()
  const lastPos = useRef({ x: 0, y: 0, time: 0 })
  const prefetchedUrls = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Only run on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      const dt = now - lastPos.current.time

      // Only calculate every 50ms to save CPU
      if (dt > 50) {
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const velocity = distance / dt

        // Only predict if moving relatively fast
        if (velocity > 0.5) {
          const vx = dx / distance
          const vy = dy / distance

          // Look ahead 200px in the direction of movement
          const predictX = e.clientX + vx * 200
          const predictY = e.clientY + vy * 200

          // Check if there's an element near the predicted destination
          // We check the exact point, plus some padding (3 points)
          const points = [
            { x: predictX, y: predictY },
            { x: predictX + 20, y: predictY + 20 },
            { x: predictX - 20, y: predictY - 20 }
          ]

          for (const p of points) {
            // Keep within bounds
            if (p.x < 0 || p.x > window.innerWidth || p.y < 0 || p.y > window.innerHeight) continue

            const target = document.elementFromPoint(p.x, p.y)
            const anchor = target?.closest('a')

            if (anchor && anchor.href) {
              const url = new URL(anchor.href)
              // Only prefetch internal routes we haven't prefetched yet
              if (url.origin === window.location.origin && !prefetchedUrls.current.has(url.pathname)) {
                prefetchedUrls.current.add(url.pathname)
                router.prefetch(url.pathname)
                break // Prefetch one at a time
              }
            }
          }
        }

        lastPos.current = { x: e.clientX, y: e.clientY, time: now }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [router])
}

export function PrecognitiveEngine() {
  usePrecognitiveHover()
  return null
}
