import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Leaderboard from './Leaderboard'
import ClaimModal from './ClaimModal'
import { audio } from '@/lib/audio'

type Grid = number[][]

export default function Synthesis({ username, claimUsername, uid }: { username: string | null, claimUsername: (n: string) => void, uid?: string }) {
  const [grid, setGrid] = useState<Grid>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null)
  const [combo, setCombo] = useState(1)
  const [lastMoveTime, setLastMoveTime] = useState(Date.now())
  const [voidMode, setVoidMode] = useState(false)
  const [milestone, setMilestone] = useState<string | null>(null)
  const konamiSeq = useRef<string[]>([])

  // Initialize game
  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    let newGrid = Array(4).fill(null).map(() => Array(4).fill(0))
    newGrid = addRandomTile(addRandomTile(newGrid))
    setGrid(newGrid)
    setScore(0)
    setCombo(1)
    setLastMoveTime(Date.now())
    setGameOver(false)
    setShowClaim(false)
  }

  function addRandomTile(currentGrid: Grid): Grid {
    const emptyCells: {r: number, c: number}[] = []
    currentGrid.forEach((row, r) => row.forEach((cell, c) => { if (cell === 0) emptyCells.push({r, c}) }))
    if (emptyCells.length === 0) return currentGrid
    const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const newGrid = currentGrid.map(row => [...row])
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4
    return newGrid
  }

  const move = useCallback((key: string) => {
    if (gameOver || showClaim) return
    
    // Basic implementation of merging
    let newGrid = [...grid.map(row => [...row])]
    let newScore = score
    let moved = false
    
    const now = Date.now()
    const currentCombo = now - lastMoveTime < 800 ? combo + 1 : 1
    let pointsGained = 0

    // Helper to compress and merge an array
    const slideAndMerge = (arr: number[]) => {
      let filtered = arr.filter(v => v !== 0)
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2
          pointsGained += (filtered[i] * currentCombo)
          filtered[i + 1] = 0
        }
      }
      filtered = filtered.filter(v => v !== 0)
      while (filtered.length < 4) filtered.push(0)
      return filtered
    }

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      for (let r = 0; r < 4; r++) {
        let row = newGrid[r]
        if (key === 'ArrowRight') row.reverse()
        const newRow = slideAndMerge(row)
        if (key === 'ArrowRight') newRow.reverse()
        if (newGrid[r].join(',') !== newRow.join(',')) moved = true
        newGrid[r] = newRow
      }
    } else {
      for (let c = 0; c < 4; c++) {
        let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]]
        if (key === 'ArrowDown') col.reverse()
        const newCol = slideAndMerge(col)
        if (key === 'ArrowDown') newCol.reverse()
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== newCol[r]) moved = true
          newGrid[r][c] = newCol[r]
        }
      }
    }

    if (moved) {
      newGrid = addRandomTile(newGrid)
      setGrid(newGrid)
      
      const prevScore = score
      const nextScore = newScore + pointsGained
      setScore(nextScore)
      
      // Milestone detection
      if (prevScore < 1000 && nextScore >= 1000) triggerMilestone('ANALYST')
      else if (prevScore < 5000 && nextScore >= 5000) triggerMilestone('ARCHITECT')
      else if (prevScore < 10000 && nextScore >= 10000) triggerMilestone('SINGULARITY')
      else if (prevScore < 50000 && nextScore >= 50000) triggerMilestone('GOD-TIER')

      if (pointsGained > 0) {
        setCombo(currentCombo)
        setLastMoveTime(now)
        audio.playMerge(currentCombo)
      } else {
        // Just a move, no merge, preserve combo timer but update lastMoveTime
        setLastMoveTime(now)
      }
      // Check game over
      const hasEmpty = newGrid.some(row => row.some(cell => cell === 0))
      if (!hasEmpty) {
        // Check for possible moves
        let canMove = false
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if (c < 3 && newGrid[r][c] === newGrid[r][c+1]) canMove = true
            if (r < 3 && newGrid[r][c] === newGrid[r+1][c]) canMove = true
          }
        }
        if (!canMove) {
          setGameOver(true)
          audio.playGameOver()
          setShowClaim(true)
        }
      }
    }
  }, [grid, score, gameOver, showClaim, username])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Konami code tracker
    const seq = [...konamiSeq.current, e.key]
    if (seq.length > 10) seq.shift()
    konamiSeq.current = seq
    if (seq.join(',') === 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a') {
      setVoidMode(prev => !prev)
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
      move(e.key)
    }
  }, [move])

  const triggerMilestone = (text: string) => {
    setMilestone(text)
    setTimeout(() => setMilestone(null), 3000)
  }

  const getRank = () => {
    if (score >= 50000) return 'God-Tier'
    if (score >= 10000) return 'Singularity'
    if (score >= 5000) return 'Architect'
    if (score >= 1000) return 'Analyst'
    return 'Initiate'
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    const dx = touchEnd.x - touchStart.x
    const dy = touchEnd.y - touchStart.y
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) move(dx > 0 ? 'ArrowRight' : 'ArrowLeft')
    } else {
      if (Math.abs(dy) > 30) move(dy > 0 ? 'ArrowDown' : 'ArrowUp')
    }
    setTouchStart(null)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getTileColor = (val: number) => {
    if (val === 0) return voidMode ? 'transparent' : 'rgba(255,255,255,0.02)'
    if (voidMode) return 'rgba(0,0,0,0.8)'
    const colors = {
      2: '#1a1a1a', 4: '#2a2a2a', 8: '#FF1493', 16: '#C2185B', 32: '#AD1457',
      64: '#880E4F', 128: '#ffb6d9', 256: '#fff', 512: '#eee', 1024: '#ccc', 2048: '#fff'
    }
    return (colors as any)[val] || '#FF1493'
  }

  const getTileTextColor = (val: number) => {
    if (voidMode) return val === 0 ? 'transparent' : '#0f0' // Neon green in void mode
    if (val === 2 || val === 4) return '#888'
    if (val >= 128) return '#000'
    return '#fff'
  }

  return (
    <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative' }}>
      
      {/* Milestone Overlay */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, pointerEvents: 'none' }}
          >
            <h1 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: 'clamp(60px, 10vw, 120px)', color: '#FF1493', textShadow: '0 0 40px rgba(255,20,147,0.8)', mixBlendMode: 'screen' }}>
              {milestone}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: '32px', color: voidMode ? '#0f0' : '#fff', marginBottom: '4px' }}>Synthesis {voidMode && '[VOID]'}</h2>
            <div style={{ fontFamily: 'var(--font-figtree)', fontSize: '14px', color: voidMode ? '#0f0' : (combo > 1 ? '#FF1493' : '#888'), transition: 'color 0.3s' }}>Combo: x{combo}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-figtree)', fontSize: '20px', color: voidMode ? '#0f0' : '#FF1493' }}>Score: {score}</div>
            <div style={{ fontFamily: 'var(--font-figtree)', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Rank: {getRank()}</div>
          </div>
        </div>

        <div 
          style={{ 
            background: voidMode ? '#000' : '#0a0a0a', padding: '12px', borderRadius: '12px', border: voidMode ? '1px solid #0f0' : '1px solid #222', 
            width: 'fit-content', touchAction: 'none',
            boxShadow: score > 0 ? `0 0 ${Math.min(score / 20, 100)}px ${voidMode ? 'rgba(0,255,0,' : 'rgba(255,20,147,'}${Math.min(0.05 + score / 10000, 0.4)})` : 'none',
            transition: 'all 0.3s ease'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {grid.map((row, r) => row.map((cell, c) => (
              <div key={`${r}-${c}`} style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', position: 'relative' }}>
                <AnimatePresence>
                  {cell !== 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -2 * Math.min(combo, 5), 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        position: 'absolute', inset: 0, background: getTileColor(cell), borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: voidMode && cell !== 0 ? '1px solid #0f0' : 'none',
                        fontFamily: voidMode ? 'monospace' : 'var(--font-figtree)', fontWeight: 'bold', fontSize: cell > 512 ? '20px' : '28px',
                        color: getTileTextColor(cell), boxShadow: cell >= 8 ? `0 0 ${20 + (combo*2)}px rgba(${voidMode?'0,255,0':'255,20,147'},${0.2 + (combo*0.05)})` : 'none'
                      }}
                    >
                      {cell}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )))}
          </div>
        </div>

        {gameOver && (
          <div style={{ marginTop: '24px' }}>
            <p style={{ color: '#FF1493', fontFamily: 'var(--font-figtree)', marginBottom: '16px' }}>Terminal state reached.</p>
            <button onClick={resetGame} style={{ padding: '8px 16px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-figtree)' }}>Restart</button>
            {username && <button onClick={() => setShowClaim(true)} style={{ padding: '8px 16px', background: 'transparent', color: '#FF1493', border: '1px solid #FF1493', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-figtree)', marginLeft: '12px' }}>Submit Score</button>}
          </div>
        )}
      </div>

      <Leaderboard game="synthesis" />

      {showClaim && (
        <ClaimModal 
          score={score} game="synthesis" uid={uid} username={username}
          onClaimed={(name) => { claimUsername(name); setShowClaim(false); }} 
        />
      )}
    </div>
  )
}
