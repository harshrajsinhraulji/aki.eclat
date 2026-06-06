'use client'

/**
 * components/confessions/SubmitForm.tsx
 * A glassmorphic modal for submitting confessions (Void Theme).
 */

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { easings } from '@/lib/motion'
import { useTheme } from '@/lib/ThemeContext'

interface SubmitFormProps {
  isOpen: boolean
  onClose: () => void
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export function SubmitForm({ isOpen, onClose }: SubmitFormProps) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const isHolding = useRef(false)
  const holdInterval = useRef<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          author,
          honeypot,
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to submit')
      }
      
      // Trigger bow rain easter egg to celebrate successful confession!
      window.dispatchEvent(new CustomEvent('aki-bow-rain'))

      // Reset & close
      setText('')
      setAuthor('')
      setHoneypot('')
      onClose()
    } catch (err) {
      console.error('Error adding confession:', err)
      alert(err instanceof Error ? err.message : 'Failed to spill the tea.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: isDark ? 'rgba(10, 3, 6, 0.85)' : 'rgba(255, 245, 248, 0.85)', // Dark void / light room blur
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div 
            style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: easings.outExpo }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              background: 'var(--bg-primary)', // Obsidian / Blush
              transition: 'background 400ms ease',
              borderRadius: '24px',
              padding: 'clamp(32px, 5vw, 40px)',
              boxShadow: '0 40px 100px var(--shadow-md)',
              border: '1px solid var(--card-border)',
              borderTop: '1px solid var(--card-border)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                 position: 'absolute',
                top: '24px',
                right: '24px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,20,147,0.08)',
                color: 'var(--text-primary)',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s, color 400ms ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,20,147,0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,20,147,0.08)'}
            >
              ×
            </button>

            <h2 style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: '32px',
              color: 'var(--text-primary)',
              transition: 'color 400ms ease',
              marginBottom: '8px',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}>
              Spill the Tea
            </h2>
            <p style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: '18px',
              color: '#FF1493',
              marginBottom: '32px',
            }}>
              No judgment. Well, maybe a little.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Honeypot field */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                <label htmlFor="website">Do not fill this out if you are human</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="I can't believe I..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--card-border)',
                    background: 'var(--card-bg)',
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 300,
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.3s, background 400ms ease, color 400ms ease',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF1493'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Alias (optional)"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '100px',
                    border: '1px solid var(--card-border)',
                    background: 'var(--card-bg)',
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 300,
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.3s, background 400ms ease, color 400ms ease',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF1493'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div style={{ position: 'relative', marginTop: '12px' }}>
                <motion.button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault()
                    if (isSubmitting || !text.trim()) return
                    isHolding.current = true
                    setHoldProgress(0)
                    const startTime = Date.now()
                    holdInterval.current = setInterval(() => {
                      const p = Math.min((Date.now() - startTime) / 1600, 1) // 1.6s to submit
                      setHoldProgress(p)
                      if (p >= 1) {
                        clearInterval(holdInterval.current!)
                        isHolding.current = false
                        // trigger submit
                        handleSubmit(new Event('submit') as any)
                      }
                    }, 16)
                  }}
                  onPointerUp={() => {
                    isHolding.current = false
                    if (holdInterval.current) clearInterval(holdInterval.current)
                    setHoldProgress(0)
                  }}
                  onPointerLeave={() => {
                    isHolding.current = false
                    if (holdInterval.current) clearInterval(holdInterval.current)
                    setHoldProgress(0)
                  }}
                  disabled={isSubmitting || !text.trim()}
                  animate={{
                    scale: holdProgress > 0 && holdProgress < 1
                      ? 1 + Math.sin(holdProgress * Math.PI * 10) * (0.02 + holdProgress * 0.05)
                      : 1
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '100px',
                    border: 'none',
                    background: isSubmitting || !text.trim() ? 'var(--card-border)' : 'rgba(255,20,147,0.1)',
                    color: isSubmitting || !text.trim() ? 'var(--text-soft)' : '#FF1493',
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: isSubmitting || !text.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: isSubmitting || !text.trim() ? 'none' : '0 12px 24px rgba(255,20,147,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    willChange: 'transform',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                >
                  {/* Fill progress background */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, #FF1493 0%, #C2185B 100%)',
                      transformOrigin: 'left',
                      transform: `scaleX(${holdProgress})`,
                      zIndex: 0,
                    }}
                  />
                  
                  {/* Text */}
                  <span style={{ 
                    position: 'relative', 
                    zIndex: 1,
                    color: holdProgress > 0.3 ? '#FFF' : 'inherit',
                    transition: 'color 200ms ease'
                  }}>
                    {isSubmitting ? 'Spilling...' : holdProgress > 0 ? 'KEEP HOLDING...' : 'HOLD TO WHISPER'}
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
