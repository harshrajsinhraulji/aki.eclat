'use client'

/**
 * hooks/useLenis.ts
 * Lenis smooth scroll initialisation.
 * Returns the Lenis instance for programmatic control.
 *
 * Integration pattern:
 *   Lenis RAF feeds into GSAP ticker — no conflicts.
 *   Destroyed on unmount — no memory leaks.
 */

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { lenisConfig } from '@/lib/motion'

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis(lenisConfig)
    lenisRef.current = lenis

    // Feed Lenis RAF into GSAP ticker — the correct integration pattern.
    // This ensures GSAP ScrollTrigger and Lenis work without conflict.
    function onGsapTick(time: number) {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onGsapTick)

    // Disable GSAP's own lag smoothing — Lenis handles this.
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onGsapTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
