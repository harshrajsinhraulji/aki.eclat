'use client'

import { useState, useEffect } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function AkiAdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [confessions, setConfessions] = useState<any[]>([])
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !firestore) return

    const q = query(collection(firestore, 'confessions'), orderBy('createdAt', 'desc'), limit(100))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          text: data.text?.stringValue || data.text,
          author: data.author?.stringValue || data.author,
          akiResponse: data.akiResponse?.stringValue || data.akiResponse,
          createdAt: data.createdAt
        }
      })
      setConfessions(docs)
    })

    return () => unsubscribe()
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ladygagabobs') {
      setIsAuthenticated(true)
    } else {
      alert('Nice try, aneh.')
    }
  }

  const handleReply = async (id: string) => {
    const response = replyText[id]
    if (!response?.trim()) return

    setSubmitting(id)
    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confessionId: id, response })
      })

      if (!res.ok) throw new Error('Failed to send reply')
      
      setReplyText(prev => ({ ...prev, [id]: '' }))
    } catch (err) {
      alert('Error sending reply')
      console.error(err)
    } finally {
      setSubmitting(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050203',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Cinematic Lighting */}
        <div style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle at center, rgba(255,20,147,0.15) 0%, transparent 60%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }} />

        <Link href="/" style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          fontFamily: 'var(--font-figtree)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: '#FFFFFF',
          textDecoration: 'none',
          opacity: 0.5,
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
        >
          Return
        </Link>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleLogin} 
          style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '64px',
            borderRadius: '32px',
            border: '1px solid rgba(255,20,147,0.1)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            width: '420px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.05)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#FFFFFF', fontFamily: 'var(--font-bodoni-moda)', fontSize: '32px', letterSpacing: '-0.02em', marginBottom: '8px' }}>Control Room</h1>
            <p style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', color: '#FF1493', fontSize: '18px' }}>Aki only.</p>
          </div>

          <div style={{ position: 'relative' }}>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter passphrase"
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontFamily: 'var(--font-figtree)',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FF1493'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          
          <button type="submit" style={{
            padding: '16px',
            background: '#FFFFFF',
            color: '#000000',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontSize: '12px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FF1493'
            e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF'
            e.currentTarget.style.color = '#000000'
          }}
          >
            Authenticate
          </button>
        </motion.form>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDFBF7',
      padding: 'clamp(60px, 10vh, 120px) clamp(24px, 5vw, 60px)',
      fontFamily: 'var(--font-figtree)',
      position: 'relative'
    }}>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        padding: '24px clamp(24px, 5vw, 60px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(253, 251, 247, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 50,
        borderBottom: '1px solid rgba(138,58,89,0.1)'
      }}>
        <div style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: '24px', color: '#8A3A59' }}>Aki's Desk</div>
        <Link href="/" style={{
          fontFamily: 'var(--font-figtree)',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#B08E9D',
          textDecoration: 'none'
        }}>Exit</Link>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '60px' }}>
        <header style={{ marginBottom: '80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(48px, 6vw, 72px)',
            color: '#4A2B38',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Confessions
          </h1>
          <p style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: '24px',
            color: '#B08E9D'
          }}>Manage the whispers.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
          <AnimatePresence>
            {confessions.map((c, i) => (
              <motion.div 
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: '#FFFFFF',
                  padding: '32px',
                  borderRadius: '24px',
                  boxShadow: '0 24px 48px rgba(138,58,89,0.05), 0 4px 12px rgba(138,58,89,0.02)',
                  border: '1px solid rgba(138,58,89,0.08)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ 
                  color: '#1A0A12', 
                  fontSize: '16px', 
                  lineHeight: 1.6, 
                  marginBottom: '24px',
                  fontWeight: 500 
                }}>
                  "{c.text}"
                </div>
                <div style={{ 
                  color: '#B08E9D', 
                  fontSize: '14px', 
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  marginBottom: '32px' 
                }}>
                  — {c.author || 'anon'}
                </div>

                {c.akiResponse ? (
                  <div style={{
                    marginTop: 'auto',
                    background: 'rgba(255,20,147,0.03)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,20,147,0.1)',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      top: '-10px',
                      left: '20px',
                      background: '#FF1493', 
                      color: 'white', 
                      fontSize: '10px', 
                      fontWeight: 800, 
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}>Your Take</div>
                    <div style={{ 
                      fontFamily: 'var(--font-instrument-serif)', 
                      fontStyle: 'italic', 
                      fontSize: '20px', 
                      color: '#FF1493',
                      lineHeight: 1.4,
                      marginTop: '8px'
                    }}>
                      "{c.akiResponse}"
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <textarea 
                      placeholder="Spill back..."
                      value={replyText[c.id] || ''}
                      onChange={e => setReplyText({ ...replyText, [c.id]: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(138,58,89,0.1)',
                        background: '#FDFBF7',
                        outline: 'none',
                        color: '#4A2B38',
                        fontFamily: 'var(--font-figtree)',
                        fontSize: '14px',
                        resize: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#FF1493'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(138,58,89,0.1)'}
                    />
                    <button 
                      onClick={() => handleReply(c.id)}
                      disabled={submitting === c.id || !replyText[c.id]?.trim()}
                      style={{
                        padding: '16px',
                        background: submitting === c.id || !replyText[c.id]?.trim() ? '#F3E9EC' : 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
                        color: submitting === c.id || !replyText[c.id]?.trim() ? '#B08E9D' : '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: submitting === c.id || !replyText[c.id]?.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontFamily: 'var(--font-figtree)',
                        fontSize: '12px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        boxShadow: submitting === c.id || !replyText[c.id]?.trim() ? 'none' : '0 8px 24px rgba(255,105,180,0.3)'
                      }}
                    >
                      {submitting === c.id ? 'Sending...' : 'Respond'}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
