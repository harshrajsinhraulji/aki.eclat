import { useState, useEffect, useCallback, useRef } from 'react'
import Leaderboard from './Leaderboard'
import ClaimModal from './ClaimModal'
import { audio } from '@/lib/audio'

const GRID_SIZE = 15

export default function TheThread({ username, claimUsername, uid }: { username: string | null, claimUsername: (n: string) => void, uid?: string }) {
  const [snake, setSnake] = useState([{x: 7, y: 7}])
  const [food, setFood] = useState({x: 3, y: 3})
  const [dir, setDir] = useState({x: 0, y: -1})
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Mobile check
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const dirRef = useRef(dir)
  dirRef.current = dir

  const resetGame = () => {
    setSnake([{x: 7, y: 7}])
    setDir({x: 0, y: -1})
    setFood({x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE)})
    setScore(0)
    setGameOver(false)
    setShowClaim(false)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (!isPlaying || gameOver) return
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0]
        const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y }
        
        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true)
          audio.playGameOver()
          setShowClaim(true)
          return prev
        }
        // Self collision
        if (prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true)
          audio.playGameOver()
          setShowClaim(true)
          return prev
        }

        const newSnake = [newHead, ...prev]
        
        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10)
          audio.playMerge(Math.floor(prev.length / 5) + 1) // increase pitch slightly as snake grows
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          })
        } else {
          newSnake.pop()
        }
        
        return newSnake
      })
    }, 150) // Speed
    return () => clearInterval(interval)
  }, [isPlaying, gameOver, food, username])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
    }
    if (gameOver || showClaim) return
    if (!isPlaying && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      setIsPlaying(true)
    }
    
    switch (e.key) {
      case 'ArrowUp': if (dirRef.current.y !== 1) setDir({x: 0, y: -1}); break
      case 'ArrowDown': if (dirRef.current.y !== -1) setDir({x: 0, y: 1}); break
      case 'ArrowLeft': if (dirRef.current.x !== 1) setDir({x: -1, y: 0}); break
      case 'ArrowRight': if (dirRef.current.x !== -1) setDir({x: 1, y: 0}); break
    }
  }, [gameOver, showClaim, isPlaying])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: '32px', color: '#fff' }}>The Thread</h2>
          <div style={{ fontFamily: 'var(--font-figtree)', fontSize: '20px', color: '#FF1493' }}>Score: {score}</div>
        </div>

        <div style={{ 
          background: '#0a0a0a', border: '1px solid #222', borderRadius: '12px', padding: '12px',
          width: 'fit-content',
          boxShadow: score > 0 ? `0 0 ${Math.min(score, 100)}px rgba(255,20,147,${Math.min(0.05 + score / 500, 0.4)})` : 'none',
          transition: 'box-shadow 0.3s ease'
        }}>
          <div style={{ 
            display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: '2px',
            width: '320px', height: '320px'
          }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE
              const y = Math.floor(i / GRID_SIZE)
              const isSnake = snake.some(s => s.x === x && s.y === y)
              const isHead = snake[0].x === x && snake[0].y === y
              const isFood = food.x === x && food.y === y
              
              return (
                <div key={i} style={{
                  background: isHead ? '#FF1493' : isSnake ? 'rgba(255,20,147,0.5)' : isFood ? '#fff' : 'rgba(255,255,255,0.02)',
                  borderRadius: isSnake || isFood ? '50%' : '2px',
                  transition: 'background 0.1s ease',
                  boxShadow: isFood ? '0 0 10px rgba(255,255,255,0.8)' : isHead ? '0 0 10px rgba(255,20,147,0.8)' : 'none'
                }} />
              )
            })}
          </div>
        </div>

        {/* Mobile D-Pad */}
        {isMobile && !gameOver && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
            <button 
              onClick={() => { if (!isPlaying) setIsPlaying(true); if (dirRef.current.y !== 1) setDir({x: 0, y: -1}) }}
              style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,20,147,0.1)', border: '1px solid rgba(255,20,147,0.3)', color: '#FF1493', fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', touchAction: 'manipulation' }}
            >↑</button>
            <div style={{ display: 'flex', gap: '60px' }}>
              <button 
                onClick={() => { if (!isPlaying) setIsPlaying(true); if (dirRef.current.x !== 1) setDir({x: -1, y: 0}) }}
                style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,20,147,0.1)', border: '1px solid rgba(255,20,147,0.3)', color: '#FF1493', fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', touchAction: 'manipulation' }}
              >←</button>
              <button 
                onClick={() => { if (!isPlaying) setIsPlaying(true); if (dirRef.current.x !== -1) setDir({x: 1, y: 0}) }}
                style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,20,147,0.1)', border: '1px solid rgba(255,20,147,0.3)', color: '#FF1493', fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', touchAction: 'manipulation' }}
              >→</button>
            </div>
            <button 
              onClick={() => { if (!isPlaying) setIsPlaying(true); if (dirRef.current.y !== -1) setDir({x: 0, y: 1}) }}
              style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,20,147,0.1)', border: '1px solid rgba(255,20,147,0.3)', color: '#FF1493', fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', touchAction: 'manipulation' }}
            >↓</button>
          </div>
        )}

        {!isPlaying && !gameOver && (
          <p style={{ fontFamily: 'var(--font-figtree)', color: '#888', marginTop: '16px' }}>Press any arrow key to start the thread.</p>
        )}

        {gameOver && (
          <div style={{ marginTop: '24px' }}>
            <p style={{ color: '#FF1493', fontFamily: 'var(--font-figtree)', marginBottom: '16px' }}>The thread has snapped.</p>
            <button onClick={resetGame} style={{ padding: '8px 16px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-figtree)' }}>Restart</button>
            {username && <button onClick={() => setShowClaim(true)} style={{ padding: '8px 16px', background: 'transparent', color: '#FF1493', border: '1px solid #FF1493', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-figtree)', marginLeft: '12px' }}>Submit Score</button>}
          </div>
        )}
      </div>

      <Leaderboard game="thread" />

      {showClaim && (
        <ClaimModal 
          score={score} game="thread" uid={uid} username={username}
          onClaimed={(name) => { claimUsername(name); setShowClaim(false); }} 
        />
      )}
    </div>
  )
}
