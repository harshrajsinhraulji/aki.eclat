'use client'

/**
 * components/ui/KeyboardToast.tsx
 *
 * #39 Keyboard shortcut toast
 * Press '?' to open a glassmorphic shortcut legend.
 * Press 'Escape' or click outside to dismiss.
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SHORTCUTS = [
  { key: '↑ / ↓',     action: 'Jump between sections' },
  { key: 'T',         action: 'Toggle dark / light mode' },
  { key: '?',         action: 'Show / hide shortcuts' },
  { key: 'Esc',       action: 'Close any overlay' },
]

export function KeyboardToast() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === '?') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          key="keyboard-toast"
          className="keyboard-toast"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div className="keyboard-toast-title">Shortcuts</div>
          {SHORTCUTS.map(({ key, action }) => (
            <div key={key} className="keyboard-toast-row">
              <span className="keyboard-toast-action">{action}</span>
              <kbd className="keyboard-toast-key">{key}</kbd>
            </div>
          ))}

          {/* Dismiss hint */}
          <div style={{
            marginTop: '12px',
            fontFamily: 'var(--font-figtree)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-soft)',
            textAlign: 'center',
            opacity: 0.7,
          }}>
            press ? to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
