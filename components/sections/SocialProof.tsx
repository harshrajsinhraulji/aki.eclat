'use client'

/**
 * components/sections/SocialProof.tsx
 * Section 01.5 — Ambient Credibility Strip.
 *
 * NOT a trophy cabinet. NOT a resume.
 * This is editorial metadata — facts mentioned in passing,
 * as though you happened to notice them on a business card.
 * Three signals: Gaming rank, Listener status, Student location.
 * Plus a live whisper count from Firebase — the most social signal of all.
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { easings } from '@/lib/motion'
import { firestore } from '@/lib/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { Gamepad2, HeartHandshake, Compass, MessageCircleHeart } from 'lucide-react'

const SIGNALS = [
  {
    id: 'rank',
    label: 'Rank',
    value: 'Diamond I',
    sub: 'League of Legends',
    icon: <Gamepad2 size={20} />,
    color: 'var(--badge-secondary-text)',
    bg: 'var(--badge-secondary-bg)',
    border: 'var(--badge-secondary-border)',
  },
  {
    id: 'listener',
    label: 'Status',
    value: 'Active Listener',
    sub: '7cups · empathy-certified',
    icon: <HeartHandshake size={20} />,
    color: 'var(--badge-primary-text)',
    bg: 'var(--badge-primary-bg)',
    border: 'var(--badge-primary-border)',
  },
  {
    id: 'education',
    label: 'Studying',
    value: 'Interior Design',
    sub: 'London, UK',
    icon: <Compass size={20} />,
    color: 'var(--badge-secondary-text)',
    bg: 'var(--badge-secondary-bg)',
    border: 'var(--badge-secondary-border)',
  },
]

function Signal({ id, label, value, sub, icon, color, bg, border }: typeof SIGNALS[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4, 
        scale: 1.02, 
        boxShadow: '0 24px 48px rgba(26, 10, 18, 0.08)',
        borderColor: 'rgba(26, 10, 18, 0.12)'
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: easings.outExpo }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 20px',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-md, 16px)',
        flex: '1 1 200px',
        minWidth: '180px',
        cursor: 'default',
        transition: 'background 400ms ease, border-color 400ms ease',
      }}
    >
      <span style={{ color, display: 'flex', flexShrink: 0, position: 'relative' }}>
        {icon}
        {/* Pulsating live dot for Active Listener */}
        {id === 'listener' && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#E1306C',
              boxShadow: '0 0 8px #E1306C',
            }}
          />
        )}
      </span>
      <div>
        <div style={{
          fontFamily: 'var(--font-figtree)',
          fontSize: '9px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-soft)',
          marginBottom: '2px',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(14px, 1.4vw, 17px)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: 'var(--font-figtree)',
          fontSize: '11px',
          color: 'var(--text-soft)',
          marginTop: '1px',
        }}>
          {sub}
        </div>
      </div>
    </motion.div>
  )
}

export function SocialProof() {
  const [whisperCount, setWhisperCount] = useState<number | null>(null)

  useEffect(() => {
    if (!firestore) return
    try {
      const unsub = onSnapshot(collection(firestore, 'confessions'), (snap) => {
        setWhisperCount(snap.size)
      }, () => {})
      return () => unsub()
    } catch { /* no-op */ }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--bg-primary)',
        padding: '0 clamp(24px, 5vw, 80px) clamp(40px, 6vh, 64px)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'stretch',
      }}>
        {SIGNALS.map((s) => (
          <Signal key={s.id} {...s} />
        ))}

        {/* Live whisper count — the most compelling social signal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ 
            y: -4, 
            scale: 1.02, 
            boxShadow: '0 24px 48px rgba(194, 24, 91, 0.15)',
            borderColor: 'rgba(194, 24, 91, 0.40)'
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easings.outExpo, delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 20px',
            background: 'var(--badge-primary-bg)',
            border: '1px solid var(--badge-primary-border)',
            borderRadius: 'var(--radius-md, 16px)',
            flex: '1 1 200px',
            minWidth: '180px',
            cursor: 'default',
            transition: 'background 400ms ease, border-color 400ms ease',
          }}
        >
          <span style={{ color: 'var(--badge-primary-text)', display: 'flex', flexShrink: 0, position: 'relative' }}>
            <MessageCircleHeart size={20} />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--badge-primary-text)',
                boxShadow: '0 0 12px var(--badge-primary-text)',
              }}
            />
          </span>
          <div>
            <div style={{
              fontFamily: 'var(--font-figtree)',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-soft)',
              marginBottom: '2px',
            }}>
              Confessions Wall
            </div>
            <div style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              color: 'var(--badge-primary-text)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              {whisperCount !== null ? `${whisperCount.toLocaleString()} whispers` : 'Live Wall'}
            </div>
            <div style={{
              fontFamily: 'var(--font-figtree)',
              fontSize: '11px',
              color: 'var(--text-soft)',
              marginTop: '1px',
            }}>
              and I read every one
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
