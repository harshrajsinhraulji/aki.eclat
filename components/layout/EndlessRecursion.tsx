'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * EndlessRecursion
 * Mathematically monitors scroll state. If the user scrolls past the absolute bottom
 * of the document, it triggers a visual 'glitch' and seamlessly teleports them
 * back to the top (Hero section), creating an infinite loop.
 */
export function EndlessRecursion() {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Check if we hit the bottom
          const { scrollTop, scrollHeight, clientHeight } = document.documentElement
          
          // If we are at the very bottom (allow 5px margin of error for mobile elastic scrolling)
          if (scrollTop + clientHeight >= scrollHeight - 5) {
            // Trigger recursion
            setIsGlitching(true)
            
            // Wait 150ms for glitch effect, then teleport
            setTimeout(() => {
              window.scrollTo(0, 0)
              setIsGlitching(false)
            }, 150)
          }
          
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isGlitching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#FF1493', // Hot pink flash
            mixBlendMode: 'exclusion',
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  )
}
