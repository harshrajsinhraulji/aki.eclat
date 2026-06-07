'use client'

import { useState, useEffect } from 'react'

/**
 * usePerformanceMonitor
 * Tracks the browser's RequestAnimationFrame deltas.
 * If the framerate drops below 40fps for an extended period, it returns isThrottled = true
 * allowing the application to gracefully degrade WebGL effects.
 */
export function usePerformanceMonitor() {
  const [isThrottled, setIsThrottled] = useState(false)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let dropCount = 0
    let animationFrameId: number

    const checkFPS = (time: number) => {
      frameCount++
      
      // Check every 1 second
      if (time - lastTime >= 1000) {
        const fps = (frameCount * 1000) / (time - lastTime)
        
        if (fps < 40) {
          dropCount++
        } else {
          dropCount = 0 // Reset if it recovers
        }

        // If we drop below 40 FPS for 3 consecutive seconds, throttle
        if (dropCount >= 3) {
          setIsThrottled(true)
          return // Stop monitoring to save resources
        }

        frameCount = 0
        lastTime = time
      }
      
      animationFrameId = requestAnimationFrame(checkFPS)
    }

    animationFrameId = requestAnimationFrame(checkFPS)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return isThrottled
}
