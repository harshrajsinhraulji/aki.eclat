'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BowSvg } from '@/components/ui/BowSvg'

const TARGET = 'aneh'
const BOW_COUNT = 60

interface BowParticle {
  id: number
  x: number      
  rotStart: number
  rotEnd: number
  scale: number  
  dur: number    
  delay: number  
  size: number   
  color: string  
  blur: number
  zIndex: number
}

const COLORS = ['#FF1493', '#C2185B', '#E91E63', '#AD1457', '#FF69B4', '#FFF0F5']

function randomBow(id: number): BowParticle {
  const isForeground = Math.random() > 0.85
  const isBackground = Math.random() > 0.6 && !isForeground
  
  let scale = 0.6 + Math.random() * 0.8
  let blur = 0
  let zIndex = 50
  
  if (isForeground) {
    scale = 3 + Math.random() * 3
    blur = 4 + Math.random() * 8
    zIndex = 999999
  } else if (isBackground) {
    scale = 0.2 + Math.random() * 0.3
    blur = 2 + Math.random() * 4
    zIndex = 10
  }

  return {
    id,
    x: Math.random() * 100,
    rotStart: Math.random() * 360,
    rotEnd: Math.random() * 720 - 360,
    scale,
    dur: isForeground ? 1.5 + Math.random() * 1 : 2.5 + Math.random() * 3,
    delay: Math.random() * 1.5,
    size: 24,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    blur,
    zIndex
  }
}

function playGlassChimes() {
  try {
    const ctx = new AudioContext()
    
    // Play 5 rapid random chimes
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      osc.type = 'sine'
      // High pitch frequencies
      osc.frequency.value = 800 + Math.random() * 2000
      
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      const time = ctx.currentTime + Math.random() * 1.5
      
      gainNode.gain.setValueAtTime(0, time)
      gainNode.gain.linearRampToValueAtTime(0.1, time + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5)
      
      osc.start(time)
      osc.stop(time + 0.6)
    }
  } catch (e) {
    // AudioContext blocked
  }
}

export function AnehEasterEgg() {
  const [bows, setBows] = useState<BowParticle[]>([])
  const [buffer, setBuffer] = useState('')

  const triggerRain = useCallback(() => {
    playGlassChimes()
    const particles = Array.from({ length: BOW_COUNT }, (_, i) => randomBow(i))
    setBows(particles)
    setTimeout(() => setBows([]), 6000)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const newBuffer = (buffer + e.key.toLowerCase()).slice(-TARGET.length)
      setBuffer(newBuffer)

      if (newBuffer === TARGET) {
        triggerRain()
        setBuffer('')
      }
    }

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
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }} aria-hidden>
      <AnimatePresence>
        {bows.map((bow) => (
          <motion.div
            key={bow.id}
            initial={{ y: '-20vh', x: `${bow.x}vw`, rotate: bow.rotStart, scale: bow.scale, opacity: 0, filter: `blur(${bow.blur}px)` }}
            animate={{ 
              y: '120vh', 
              x: `${bow.x + (Math.random() * 10 - 5)}vw`, 
              rotate: bow.rotEnd,
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: bow.dur, 
              delay: bow.delay, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            style={{
              position: 'absolute',
              zIndex: bow.zIndex,
            }}
          >
            <BowSvg size={bow.size} color={bow.color} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
