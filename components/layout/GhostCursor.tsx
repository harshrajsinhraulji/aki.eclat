'use client'

/**
 * components/layout/GhostCursor.tsx
 * The Ghost Cursor: Records the user's mouse path for the first 10 seconds,
 * then eternally replays it as a faint, glowing secondary cursor to simulate 
 * the "ghost" of a past visitor.
 */

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type Point = { x: number; y: number; t: number }

export function GhostCursor() {
  const [points, setPoints] = useState<Point[]>([])
  const [isRecording, setIsRecording] = useState(true)
  const [isReplaying, setIsReplaying] = useState(false)
  
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  // Add subtle spring to the ghost for fluidity
  const ghostX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const ghostY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  const startTime = useRef<number>(0)
  const isPlayingRef = useRef(false)
  const replayStart = useRef<number>(0)

  useEffect(() => {
    // Only run on desktop
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    startTime.current = Date.now()
    const recordDuration = 8000 // record for 8 seconds

    const onMove = (e: MouseEvent) => {
      if (!isRecording) return
      
      const now = Date.now()
      const elapsed = now - startTime.current

      if (elapsed > recordDuration) {
        setIsRecording(false)
        setIsReplaying(true)
        return
      }

      // Record at ~60Hz to save memory
      setPoints((prev) => [...prev, { x: e.clientX, y: e.clientY, t: elapsed }])
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    
    // Auto-stop recording after duration even if mouse isn't moving
    const timer = setTimeout(() => {
      setIsRecording(false)
      setIsReplaying(true)
    }, recordDuration)

    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(timer)
    }
  }, [isRecording])

  useEffect(() => {
    if (!isReplaying || points.length === 0) return
    
    if (!isPlayingRef.current) {
      isPlayingRef.current = true
      replayStart.current = Date.now()
    }

    let animationFrameId: number

    const playFrame = () => {
      const now = Date.now()
      let elapsed = now - replayStart.current

      // Loop the recording
      const maxTime = points[points.length - 1].t
      if (elapsed > maxTime + 2000) { // 2s pause before repeating
        replayStart.current = now
        elapsed = 0
        mouseX.set(-1000) // hide offscreen momentarily
        mouseY.set(-1000)
      }

      // Find the two points we are between
      let p1 = points[0]
      let p2 = points[0]

      for (let i = 0; i < points.length - 1; i++) {
        if (points[i].t <= elapsed && points[i+1].t > elapsed) {
          p1 = points[i]
          p2 = points[i+1]
          break
        }
      }

      if (p1 && p2 && p1 !== p2) {
        // Interpolate
        const progress = (elapsed - p1.t) / (p2.t - p1.t)
        const x = p1.x + (p2.x - p1.x) * progress
        const y = p1.y + (p2.y - p1.y) * progress
        mouseX.set(x)
        mouseY.set(y)
      }

      animationFrameId = requestAnimationFrame(playFrame)
    }

    playFrame()

    return () => cancelAnimationFrame(animationFrameId)
  }, [isReplaying, points, mouseX, mouseY])

  if (!isReplaying || points.length === 0) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: ghostX,
        y: ghostY,
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,20,147,0.4) 0%, rgba(255,20,147,0) 70%)',
        filter: 'blur(2px)',
        pointerEvents: 'none',
        zIndex: 99998,
        translateX: '-50%',
        translateY: '-50%',
        willChange: 'transform',
      }}
    />
  )
}
