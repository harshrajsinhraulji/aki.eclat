'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { useArcadeAuth } from '@/lib/hooks/useArcadeAuth'
import Synthesis from '@/components/arcade/Synthesis'
import TheThread from '@/components/arcade/TheThread'
import Echoes from '@/components/arcade/Echoes'
import Leaderboard from '@/components/arcade/Leaderboard'
import Image from 'next/image'

type GameType = 'synthesis' | 'thread' | 'echoes' | null

export default function ArcadePage() {
  const { uid, username, claimUsername, loading } = useArcadeAuth()
  const [activeGame, setActiveGame] = useState<GameType>(null)

  return (
    <main style={{ minHeight: '100svh', background: '#0A0306', position: 'relative', overflowX: 'hidden' }}>
      {/* Dynamic Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,20,147,0.1) 0%, rgba(10,3,6,0) 70%)', filter: 'blur(80px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(194,24,91,0.08) 0%, rgba(10,3,6,0) 70%)', filter: 'blur(100px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', opacity: 0.03, mixBlendMode: 'overlay' }} />
      </div>

      <Navbar />
      
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '160px', paddingBottom: '100px', paddingLeft: 'clamp(24px, 5vw, 80px)', paddingRight: 'clamp(24px, 5vw, 80px)', minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="arcade-menu" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: 'clamp(48px, 8vw, 100px)', color: '#FFF5F8', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>The Archives</h1>
              <p style={{ fontFamily: 'var(--font-figtree)', fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,245,248,0.7)', maxWidth: '600px', marginBottom: '64px', lineHeight: 1.6 }}>
                Three psychological tests. Identity claimed:{' '}
                {loading ? '...' : username ? <span style={{color: '#FF1493', fontWeight: 600}}>{username}</span> : 'Guest (Unclaimed)'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                <GameCard 
                  title="Synthesis" desc="Merge concepts until singularity. A minimalist aesthetic test." 
                  gameId="synthesis"
                  banner="/images/arcade_synthesis.png"
                  onClick={() => setActiveGame('synthesis')}
                  delay={0.1}
                />
                <GameCard 
                  title="The Thread" desc="Follow the line. Consume to grow. A fluid spatial experience." 
                  gameId="thread"
                  banner="/images/arcade_thread.png"
                  onClick={() => setActiveGame('thread')}
                  delay={0.2}
                />
                <GameCard 
                  title="Echoes" desc="Match memories before they fade. A psychological recall test." 
                  gameId="echoes"
                  banner="/images/arcade_echoes.png"
                  onClick={() => setActiveGame('echoes')}
                  delay={0.3}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div key="game" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <button 
                onClick={() => setActiveGame(null)}
                style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF5F8', cursor: 'pointer', fontFamily: 'var(--font-figtree)', fontSize: '14px', padding: '12px 24px', borderRadius: '100px', marginBottom: '40px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,20,147,0.5)'; e.currentTarget.style.color = '#FF1493' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#FFF5F8' }}
              >
                ← Return to Archives
              </button>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: 'clamp(24px, 4vw, 48px)', backdropFilter: 'blur(20px)', flex: 1 }}>
                {activeGame === 'synthesis' && <Synthesis username={username} claimUsername={claimUsername} uid={uid || undefined} />}
                {activeGame === 'thread' && <TheThread username={username} claimUsername={claimUsername} uid={uid || undefined} />}
                {activeGame === 'echoes' && <Echoes username={username} claimUsername={claimUsername} uid={uid || undefined} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function GameCard({ title, desc, gameId, banner, onClick, delay }: { title: string, desc: string, gameId: string, banner: string, onClick: () => void, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        background: 'rgba(255,255,255,0.03)', 
        border: '1px solid rgba(255,255,255,0.08)', 
        borderRadius: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.borderColor = 'rgba(255,20,147,0.4)';
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,20,147,0.15)';
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #FF1493, #C2185B)', opacity: 0, transition: 'opacity 0.3s ease', zIndex: 20 }} className="card-highlight" />
      
      {/* Banner Image */}
      <div style={{ width: '100%', height: '180px', position: 'relative', background: '#000' }}>
        <Image src={banner} alt={title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(10,3,6,1))' }} />
      </div>

      <div style={{ padding: '0 32px 32px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: '32px', color: '#FFF5F8', marginBottom: '12px', marginTop: '-20px', position: 'relative', zIndex: 10 }}>{title}</h3>
        <p style={{ fontFamily: 'var(--font-figtree)', color: 'rgba(255,245,248,0.6)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>{desc}</p>
        
        {/* Embedded Leaderboard */}
        <div style={{ flex: 1, marginBottom: '24px' }}>
          <Leaderboard game={gameId} />
        </div>
        
        <button 
          onClick={onClick}
          style={{ width: '100%', padding: '16px', background: 'rgba(255,20,147,0.1)', color: '#FFB6D9', border: '1px solid rgba(255,20,147,0.3)', borderRadius: '12px', fontFamily: 'var(--font-figtree)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,20,147,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,20,147,0.1)' }}
        >
          Commence <span style={{ fontSize: '16px', marginLeft: '8px' }}>→</span>
        </button>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        div:hover > .card-highlight { opacity: 1 !important; }
      `}} />
    </motion.div>
  )
}
