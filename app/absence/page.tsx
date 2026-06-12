'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function playCinematicDrone() {
  try {
    const ctx = new AudioContext()
    // Deep bass hum (Hans Zimmer style)
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc1.type = 'sine'
    osc1.frequency.value = 43.65 // F1
    osc2.type = 'sawtooth'
    osc2.frequency.value = 43.65

    filter.type = 'lowpass'
    filter.frequency.value = 120
    filter.Q.value = 2

    osc1.connect(gainNode)
    osc2.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Slow cinematic fade in
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 5) // 5s fade in

    osc1.start()
    osc2.start()

    return () => {
      // Fade out and stop
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
      setTimeout(() => {
        osc1.stop()
        osc2.stop()
        ctx.close()
      }, 2000)
    }
  } catch (e) {
    return () => {} // AudioContext failed (safari auto-play policy)
  }
}

export default function AbsencePage() {
  const [isStill, setIsStill] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioCleanup = useRef<(() => void) | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let animationFrameId: number

    const handleMove = () => {
      if (isStill) {
        setIsStill(false)
        if (audioCleanup.current) {
          audioCleanup.current()
          audioCleanup.current = null
        }
      }

      if (timerRef.current) clearTimeout(timerRef.current)
      
      timerRef.current = setTimeout(() => {
        setIsStill(true)
        if (!audioCleanup.current) {
          audioCleanup.current = playCinematicDrone()
        }
      }, 5000) // 5 seconds of pure stillness triggers the void
    }

    // Initialize timer
    handleMove()

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('keydown', handleMove)
    window.addEventListener('touchstart', handleMove)
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (audioCleanup.current) audioCleanup.current()
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('keydown', handleMove)
      window.removeEventListener('touchstart', handleMove)
    }
  }, [isStill])

  // Canvas Starfield Logic
  useEffect(() => {
    if (!isStill || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const stars = Array.from({ length: 400 }).map(() => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * 1000,
      radius: Math.random() * 1.5,
    }))

    let animationFrameId: number

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 3, 6, 0.2)' // trailing effect
      ctx.fillRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      ctx.fillStyle = '#FFF0F5'
      stars.forEach(star => {
        star.z -= 2 // move towards camera
        if (star.z <= 0) {
          star.z = 1000
          star.x = Math.random() * width - cx
          star.y = Math.random() * height - cy
        }

        const scale = 500 / star.z
        const x = cx + star.x * scale
        const y = cy + star.y * scale

        ctx.beginPath()
        ctx.arc(x, y, star.radius * scale, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(draw)
    }
    
    draw()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isStill])

  return (
    <AnimatePresence>
      {isStill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0A0306',
            zIndex: 999999, // Cover absolutely everything including navbar/footer
            cursor: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            transition={{ delay: 2, duration: 4, ease: 'easeOut' }}
            style={{
              position: 'relative',
              zIndex: 10,
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: '18px',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
            }}
          >
            There is nothing here.<br/><br/>Just you.
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
