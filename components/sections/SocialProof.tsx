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

const SIGNALS = [
  {
    id: 'rank',
    label: 'Rank',
    value: 'Diamond I',
    sub: 'League of Legends',
    icon: '♦',
    color: '#7B9FCF',
    bg: 'rgba(123, 159, 207, 0.08)',
    border: 'rgba(123, 159, 207, 0.2)',
  },
  {
    id: 'listener',
    label: 'Status',
    value: 'Active Listener',
    sub: '7cups · empathy-certified',
    icon: '♡',
    color: '#00897B',
    bg: 'rgba(0, 137, 123, 0.07)',
    border: 'rgba(0, 137, 123, 0.2)',
  },
  {
    id: 'education',
    label: 'Studying',
    value: 'Interior Design',
    sub: 'London, UK',
    icon: '✦',
    color: '#C9A465',
    bg: 'rgba(201, 164, 101, 0.08)',
    border: 'rgba(201, 164, 101, 0.2)',
  },
]

function Signal({ id, label, value, sub, icon, color, bg, border }: typeof SIGNALS[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: easings.outExpo }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 20px',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '14px',
        flex: '1 1 200px',
        minWidth: '180px',
      }}
    >
      <span style={{ fontSize: '20px', color, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
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
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: easings.outExpo, delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 20px',
            background: 'rgba(233, 30, 99, 0.06)',
            border: '1px solid rgba(233, 30, 99, 0.15)',
            borderRadius: '14px',
            flex: '1 1 200px',
            minWidth: '180px',
          }}
        >
          <span style={{ fontSize: '20px', color: '#E91E63', lineHeight: 1, flexShrink: 0 }}>🎀</span>
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
              color: '#E91E63',
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
