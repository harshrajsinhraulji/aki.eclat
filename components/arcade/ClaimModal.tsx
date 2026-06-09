import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ClaimModal({ 
  score, 
  game, 
  uid, 
  username,
  onClaimed 
}: { 
  score: number, 
  game: string, 
  uid?: string, 
  username?: string | null,
  onClaimed: (username: string) => void 
}) {
  const [name, setName] = useState(username || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!name || name.length < 3) {
      setError('Name must be at least 3 characters')
      return
    }
    if (!uid) {
      setError('Authentication failed, please refresh')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/arcade/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, username: name, score, uid })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      onClaimed(name)
    } catch (e: any) {
      setError(e.message || 'Failed to claim score')
    }
    setLoading(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
      }}
    >
      <div style={{ background: '#111', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '100%', border: '1px solid #333' }}>
        <h2 style={{ fontFamily: 'var(--font-bodoni-moda)', color: '#fff', fontSize: '28px', marginBottom: '8px' }}>Worthy of the Archives</h2>
        <p style={{ fontFamily: 'var(--font-figtree)', color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>
          You achieved a score of {score}. Claim your identity to be recorded in the global synthesis.
        </p>
        
        <input 
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Enter username"
          maxLength={15}
          style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #444', color: '#fff', fontFamily: 'var(--font-figtree)', borderRadius: '8px', marginBottom: '16px' }}
        />
        {error && <p style={{ color: '#FF1493', fontSize: '12px', marginBottom: '16px', fontFamily: 'var(--font-figtree)' }}>{error}</p>}
        
        <button 
          onClick={submit} disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#FF1493', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font-figtree)' }}
        >
          {loading ? 'Transmitting...' : (username ? 'Submit Score' : 'Claim Identity')}
        </button>
      </div>
    </motion.div>
  )
}
