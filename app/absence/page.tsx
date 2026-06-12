'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/ThemeContext'

export default function AbsencePage() {
  const [isStill, setIsStill] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Force midnight theme via effect, but keep it local to avoid flashing the rest of the app later
  // Actually, setting document body style is safer
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'midnight')
    // The main layout has navbar and footer, wait, this page needs to hide them?
    // We can just hide them via CSS for this specific route.
    document.body.style.background = '#0A0306'
    
    return () => {
      // Clean up body style
      document.body.style.background = ''
      // Let ThemeContext fix the theme
      window.dispatchEvent(new Event('aki-theme-recheck'))
    }
  }, [])

  useEffect(() => {
    const handleMove = () => {
      setIsStill(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      
      timerRef.current = setTimeout(() => {
        setIsStill(true)
      }, 10000) // 10 seconds of pure stillness
    }

    // Initialize timer
    handleMove()

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('keydown', handleMove)
    window.addEventListener('touchstart', handleMove)
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('keydown', handleMove)
      window.removeEventListener('touchstart', handleMove)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0306',
        zIndex: 999999, // Cover absolutely everything including navbar/footer
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isStill ? 'none' : 'default',
      }}
    >
      <AnimatePresence>
        {isStill && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: '14px',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.4)',
              textAlign: 'center',
            }}
          >
            There is nothing here.<br/><br/>Just you.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
