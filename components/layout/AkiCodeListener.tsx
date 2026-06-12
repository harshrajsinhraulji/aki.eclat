'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AkiCodeListener() {
  const [activated, setActivated] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activated) return

      const key = e.key.toLowerCase()
      setSequence((prev) => {
        const next = [...prev, key].slice(-3)
        if (next.join('') === 'aki') {
          setActivated(true)
          // Also dispatch an event so other components (like navbar) know
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
            background: 'var(--bg-primary)',
            mixBlendMode: 'difference',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 2, filter: 'blur(20px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(80px, 15vw, 240px)',
              color: '#FF1493',
              textShadow: '0 0 100px #FF1493',
            }}
          >
            AKI
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
