'use client'

/**
 * components/confessions/ConfessionsWall.tsx
 * A live, masonry-style whisper board.
 */

import { useState, useEffect, useRef } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { StickyNote } from './StickyNote'
import { SubmitForm } from './SubmitForm'
import { motion } from 'framer-motion'
import { easings } from '@/lib/motion'
import { useTheme } from '@/lib/ThemeContext'
import Link from 'next/link'

// Temporary mock if firebase is failing
const MOCK_CONFESSIONS = [
  { id: '1', text: 'I pretend to like matcha so I look mysterious.', author: 'anon', createdAt: Date.now() },
  { id: '2', text: 'I still have my ex\'s hoodie hidden in a box.', author: 'lost', createdAt: Date.now() - 10000 },
  { id: '3', text: 'I booked a 7cups session just because you looked pretty.', author: 'simp', createdAt: Date.now() - 50000 },
  { id: '4', text: 'I tell everyone I am Diamond 1, but I just bought an account.', author: 'imposter', createdAt: Date.now() - 60000 },
  { id: '5', text: 'Your interior designs make me want to redo my whole flat.', author: 'obsessed', createdAt: Date.now() - 70000 },
  { id: '6', text: 'I actually think the giant bows are chic.', author: 'anon', createdAt: Date.now() - 80000 },
]

export function ConfessionsWall() {
  const [confessions, setConfessions] = useState<any[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'midnight' || theme === 'dusk'

  useEffect(() => {
    if (!firestore) {
      setConfessions(MOCK_CONFESSIONS)
      return
    }

    try {
      const q = query(collection(firestore, 'confessions'), orderBy('createdAt', 'desc'), limit(50))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        if (docs.length > 0) {
          setConfessions(docs)
        } else {
          setConfessions(MOCK_CONFESSIONS)
        }
      }, (err) => {
        console.warn('Firestore subscription failed, using mock data.', err)
        setConfessions(MOCK_CONFESSIONS)
      })

      return () => unsubscribe()
    } catch (e) {
      console.warn('Firestore not configured properly.', e)
      setConfessions(MOCK_CONFESSIONS)
    }
  }, [])

  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-primary)', transition: 'background 400ms ease', overflow: 'hidden' }}>
      {/* Decorative tea-room gradients */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(255,20,147,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Standalone Header Elements */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: 'clamp(16px, 3vw, 32px)',
        right: 'clamp(16px, 3vw, 32px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-figtree)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-mid)',
          textDecoration: 'none',
          transition: 'color 400ms ease',
        }} data-hover="link">
          ← Back to Main
        </Link>
        <button
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,20,147,0.08)',
            border: '1px solid rgba(255,20,147,0.15)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF1493',
            fontSize: '14px',
            transition: 'all 200ms ease',
          }}
          aria-label="Toggle dark mode"
        >
          {isDark ? '☾' : '☼'}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easings.outExpo }}
        style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 10, paddingTop: '10vh' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-bodoni-moda)',
          fontSize: 'clamp(48px, 8vw, 100px)',
          color: 'var(--text-primary)',
          transition: 'color 400ms ease',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}>
          The Whisper Room
        </h1>
        <p style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(20px, 3vw, 28px)',
          color: '#FF1493',
          marginTop: '16px',
        }}>
          Tell me your secrets. I’m pouring.
        </p>
        
        <button
          onClick={() => setIsFormOpen(true)}
          style={{
            marginTop: '32px',
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #FF1493 0%, #C2185B 100%)',
            color: '#FFFFFF',
            borderRadius: '100px',
            border: 'none',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 500,
            fontSize: '13px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(255,20,147,0.25)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          data-cursor-text="WHISPER"
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(255,20,147,0.4)' }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,20,147,0.25)' }}
        >
          Leave a whisper
        </button>
      </motion.div>

      <div className="whisper-masonry" style={{
        position: 'relative',
        width: '100%',
        margin: '0 auto',
        flex: 1,
        padding: '24px var(--spacing-edge)',
        zIndex: 1,
      }}>
        {confessions.map((confession, i) => (
          <div key={confession.id} style={{ breakInside: 'avoid', marginBottom: '24px' }}>
            <StickyNote confession={confession} index={i} />
          </div>
        ))}
      </div>

      <SubmitForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        containerRef={containerRef}
      />
    </section>
  )
}
