'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function GodlyEasterEggs() {
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    // 1. Console Art
    console.log(
      `%c
   🎀   🎀   🎀   🎀   🎀   🎀   🎀
   
   A K I . É C L A T
   
   "If you're looking under the hood, 
    you already know what you're looking for."

   We should talk: hello@aki.eclat
   
   🎀   🎀   🎀   🎀   🎀   🎀   🎀
      `,
      'color: #FF1493; font-weight: bold; font-family: monospace; font-size: 14px;'
    )

    // 2. Konami Code (A-K-I)
    const secretCode = ['a', 'k', 'i']
    let inputSequence: string[] = []

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      inputSequence.push(e.key.toLowerCase())
      if (inputSequence.length > secretCode.length) {
        inputSequence.shift()
      }

      if (inputSequence.join('') === secretCode.join('')) {
        // Trigger!
        setShowSecret(true)
        setTimeout(() => setShowSecret(false), 5000)
        
        // Play glass shatter / chime sound if possible
        try {
          const audio = new Audio('/sounds/shatter.mp3') // Assume we might have this, gracefully fail if not
          audio.volume = 0.2
          audio.play().catch(() => {})
        } catch(e) {}
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <AnimatePresence>
      {showSecret && (
        <>
          {/* Global pink flash */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#FF1493',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              zIndex: 999999,
            }}
          />
          
          {/* Secret Toast */}
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 40, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              translateX: '-50%',
              background: 'rgba(10,3,6,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,20,147,0.3)',
              borderRadius: '100px',
              padding: '16px 32px',
              boxShadow: '0 20px 40px rgba(255,20,147,0.2)',
              zIndex: 1000000,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '20px' }}>👁️</span>
            <span
              style={{
                fontFamily: 'var(--font-figtree)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#FF1493',
              }}
            >
              God Mode Activated. Aki sees you.
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
