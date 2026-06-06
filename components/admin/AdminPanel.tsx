'use client'

/**
 * components/admin/AdminPanel.tsx
 * The hidden luxury CMS for Aki's personal site.
 * Unlocked via a Konami-style key sequence defined in ENV.
 * 
 * Provides an interface to update Firebase Realtime Database and delete Confessions from Firestore.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { easings } from '@/lib/motion'
import { database, firestore } from '@/lib/firebase'
import { ref, set, onValue } from 'firebase/database'
import { collection, onSnapshot, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore'

const TARGET_SEQUENCE = process.env.NEXT_PUBLIC_ADMIN_KEY_SEQUENCE || 'ArrowUpArrowUpArrowDownArrowDown'

type TickerItem = { type: 'heart' | 'star'; text: string }
type Confession = { id: string, text: string, author: string, createdAt: number }

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [sequence, setSequence] = useState<string>('')
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Listen for the secret sequence
  useEffect(() => {
    if (isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Meta', 'Control', 'Shift', 'Alt'].includes(e.key)) return

      setSequence((prev) => {
        const next = prev + e.key
        if (next.includes(TARGET_SEQUENCE)) {
          setIsOpen(true)
          return ''
        }
        return next.length > TARGET_SEQUENCE.length + 10 ? next.slice(-TARGET_SEQUENCE.length) : next
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Load from Firebase
  useEffect(() => {
    if (!isOpen || !database) return

    const tickerRef = ref(database, 'cms/tickerItems')
    const unsubscribe = onValue(tickerRef, (snapshot) => {
      const data = snapshot.val()
      if (data && Array.isArray(data)) {
        setTickerItems(data)
      } else {
        // Fallback default
        setTickerItems([
          { type: 'heart', text: 'reading: the secret history' },
          { type: 'star', text: 'obsessed with manta rays rn' },
          { type: 'heart', text: 'I write poems at 2am' },
        ])
      }
    })

    return () => unsubscribe()
  }, [isOpen])

  // Load Confessions
  useEffect(() => {
    if (!isOpen || !firestore) return

    const q = query(collection(firestore, 'confessions'), orderBy('createdAt', 'desc'), limit(50))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Confession[]
      setConfessions(docs)
    }, (err) => {
      console.warn('Admin: Firestore subscription failed', err)
    })

    return () => unsubscribe()
  }, [isOpen])

  const handleSave = async () => {
    if (!database) {
      alert('Firebase is not configured.')
      return
    }

    setIsSaving(true)
    try {
      await set(ref(database, 'cms/tickerItems'), tickerItems.filter(t => t.text.trim() !== ''))
      setTimeout(() => setIsSaving(false), 800)
    } catch (e) {
      console.error(e)
      alert('Failed to save')
      setIsSaving(false)
    }
  }

  const handleDeleteConfession = async (id: string) => {
    if (!firestore) return
    if (!confirm('Are you sure you want to delete this whisper?')) return

    try {
      await deleteDoc(doc(firestore, 'confessions', id))
    } catch (e) {
      console.error('Failed to delete confession', e)
      alert('Failed to delete whisper.')
    }
  }

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: easings.outExpo }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10, 3, 6, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            padding: '24px',
          }}
        >
          {/* Close Area */}
          <div 
            style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.6, ease: easings.outExpo }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#1A0A12',
              borderRadius: '32px',
              padding: 'clamp(32px, 5vw, 48px)',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 600,
                    fontSize: '10px',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: '#E91E63',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  System Override
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-bodoni-moda)',
                    fontSize: 'clamp(28px, 4vw, 42px)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                  }}
                >
                  Admin Control
                </h2>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(233, 30, 99, 0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#E91E63',
                  fontSize: '20px',
                  lineHeight: 1,
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(233, 30, 99, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(233, 30, 99, 0.1)'}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {/* Ticker Editor */}
              <div style={{
                flex: 1,
                minWidth: '300px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '24px',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  fontSize: '24px',
                  color: '#E91E63',
                  marginBottom: '16px',
                }}>
                  Obsessions Ticker
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {tickerItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const newItems = [...tickerItems]
                          newItems[idx].type = e.target.value as 'heart' | 'star'
                          setTickerItems(newItems)
                        }}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: '#0A0306',
                          fontFamily: 'var(--font-figtree)',
                          fontSize: '14px',
                          color: '#FFFFFF',
                          outline: 'none',
                        }}
                      >
                        <option value="heart">♡ Heart</option>
                        <option value="star">✦ Star</option>
                      </select>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => {
                          const newItems = [...tickerItems]
                          newItems[idx].text = e.target.value
                          setTickerItems(newItems)
                        }}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: '#0A0306',
                          fontFamily: 'var(--font-figtree)',
                          fontSize: '14px',
                          color: '#FFFFFF',
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={() => {
                          const newItems = [...tickerItems]
                          newItems.splice(idx, 1)
                          setTickerItems(newItems)
                        }}
                        style={{
                          padding: '0 16px',
                          borderRadius: '12px',
                          background: 'rgba(233, 30, 99, 0.1)',
                          border: 'none',
                          color: '#E91E63',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setTickerItems([...tickerItems, { type: 'heart', text: '' }])}
                    style={{
                      fontFamily: 'var(--font-figtree)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#E91E63',
                      background: 'transparent',
                      border: '1px solid rgba(233, 30, 99, 0.3)',
                      padding: '10px 20px',
                      borderRadius: '100px',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Item
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      fontFamily: 'var(--font-figtree)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'white',
                      background: isSaving ? '#6B2D4A' : '#E91E63',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '100px',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Whispers Moderation */}
              <div style={{
                flex: 1,
                minWidth: '300px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '24px',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  fontSize: '24px',
                  color: '#E91E63',
                  marginBottom: '16px',
                }}>
                  Whispers
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {confessions.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: 'var(--font-figtree)' }}>No whispers found.</div>
                  ) : (
                    confessions.map((confession) => (
                      <div key={confession.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0306', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                          <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-figtree)', fontSize: '13px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            "{confession.text}"
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-figtree)', fontSize: '10px' }}>
                            by {confession.author || 'anon'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteConfession(confession.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(233, 30, 99, 0.1)',
                            border: '1px solid rgba(233, 30, 99, 0.2)',
                            borderRadius: '8px',
                            color: '#E91E63',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            flexShrink: 0,
                            marginLeft: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
