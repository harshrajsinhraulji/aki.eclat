'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function playGodBell() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // Deep resonant bell
    osc.type = 'triangle'
    osc.frequency.value = 110 // A2

    filter.type = 'lowpass'
    filter.frequency.value = 400

    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    const now = ctx.currentTime
    
    // Sharp attack, very long decay
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.8, now + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 8)

    osc.start(now)
    osc.stop(now + 8.5)
  } catch (e) {}
}

export function AkiCodeListener() {
  const [activated, setActivated] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activated) return

      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const key = e.key.toLowerCase()
      setSequence((prev) => {
        const next = [...prev, key].slice(-3)
        if (next.join('') === 'aki') {
          setActivated(true)
          playGodBell()
          
          // System override: Force midnight theme permanently
          document.documentElement.setAttribute('data-theme', 'midnight')
          window.dispatchEvent(new Event('aki-theme-recheck'))
          window.dispatchEvent(new CustomEvent('aki-code-activated'))
        }
        return next
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activated])

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Architectural Blueprint Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundSize: '40px 40px',
              backgroundImage: `
                linear-gradient(to right, #00FFFF 1px, transparent 1px),
                linear-gradient(to bottom, #00FFFF 1px, transparent 1px)
              `,
              mixBlendMode: 'screen',
            }}
          />

          {/* Glitch Overlay */}
          <motion.div
            animate={{ 
              opacity: [0, 0.8, 0, 0.5, 0],
              x: [0, -10, 10, -5, 0]
            }}
            transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.6, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 20, 147, 0.1)',
              mixBlendMode: 'difference',
            }}
          />

          {/* Luminous Ascension */}
          <motion.div
            initial={{ y: '50vh', scale: 0.8, filter: 'blur(20px)', opacity: 0 }}
            animate={{ y: 0, scale: 1, filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(80px, 15vw, 240px)',
              color: '#00FFFF',
              textShadow: '0 0 40px #00FFFF, 0 0 100px rgba(0, 255, 255, 0.5)',
              letterSpacing: '0.2em',
              mixBlendMode: 'screen',
            }}
          >
            A K I
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
