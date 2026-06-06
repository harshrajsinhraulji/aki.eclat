'use client'

/**
 * components/confessions/StickyNote.tsx
 * A sleek, glassmorphic whisper card for the luxury void aesthetic.
 * Removing all Framer Motion drag physics and laggy 3D skews.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { easings } from '@/lib/motion'

interface StickyNoteProps {
  confession: any
  index: number
}

export function StickyNote({ confession, index }: StickyNoteProps) {
  // If created in the last 5 minutes, show live pulse
  const isNew = confession.createdAt && (Date.now() - confession.createdAt < 300000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: (index % 10) * 0.05, ease: easings.outExpo }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(233, 30, 99, 0.15)', borderColor: 'var(--card-border-hover)' }}
      style={{
        width: '100%',
        padding: '28px',
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderRadius: '12px',
        border: '1px solid var(--card-border)',
        borderTop: '1px solid var(--card-border)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 8px 32px var(--shadow-sm)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, background 400ms ease, color 400ms ease',
      }}
      data-cursor-text="READ"
    >
      {isNew && (
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E91E63', boxShadow: '0 0 8px #E91E63' }}
          />
          <span style={{ fontFamily: 'var(--font-figtree)', fontSize: '9px', color: '#E91E63', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Live</span>
        </div>
      )}

      <p style={{
        fontFamily: 'var(--font-figtree)',
        fontWeight: 300,
        fontSize: 'clamp(15px, 1.5vw, 17px)',
        lineHeight: 1.6,
        color: 'var(--text-primary)',
        transition: 'color 400ms ease',
        letterSpacing: '0.01em',
        marginTop: isNew ? '12px' : '0',
      }}>
        "{confession.text}"
      </p>

      <div style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid var(--card-border)',
        paddingTop: '16px',
      }}>
        {/* Actions Bar removed — User requested no reactions */}
        <span style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: '16px',
          color: confession.author?.toLowerCase() === 'aki' ? '#E91E63' : 'var(--text-soft)',
          transition: 'color 400ms ease',
          fontWeight: confession.author?.toLowerCase() === 'aki' ? 600 : 400,
        }}>
          — {confession.author || 'anon'}
        </span>
      </div>

      {confession.akiResponse && (
        <div style={{
          marginTop: '8px',
          padding: '16px',
          background: 'rgba(233, 30, 99, 0.05)',
          borderRadius: '8px',
          border: '1px solid var(--card-border)',
          position: 'relative',
        }}>
          <div style={{
             display: 'inline-block',
             color: '#E91E63',
             fontSize: '10px',
             fontWeight: 600,
             fontFamily: 'var(--font-figtree)',
             textTransform: 'uppercase',
             letterSpacing: '0.1em',
             marginBottom: '8px',
          }}>Aki's Note</div>
          <p style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: '18px',
            color: 'var(--text-primary)', 
            transition: 'color 400ms ease',
            lineHeight: 1.4,
          }}>
            "{confession.akiResponse}"
          </p>
        </div>
      )}
    </motion.div>
  )
}
