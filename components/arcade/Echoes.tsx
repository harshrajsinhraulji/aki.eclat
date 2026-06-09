import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Leaderboard from './Leaderboard'
import ClaimModal from './ClaimModal'
import { audio } from '@/lib/audio'

const CONCEPTS = [
  'Zeigarnik', 'Von Restorff', 'Cognitive Dissonance', 
  'Halo Effect', 'Dunning-Kruger', 'Placebo', 
  'Confirmation Bias', 'Bystander Effect'
]

type Card = {
  id: number
  concept: string
  isFlipped: boolean
  isMatched: boolean
}

export default function Echoes({ username, claimUsername, uid }: { username: string | null, claimUsername: (n: string) => void, uid?: string }) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const [ghostPenalty, setGhostPenalty] = useState(0)
  // Score = 1000 - (moves * 10) - (ghostPenalty * 50). Minimum 100.
  const score = Math.max(100, 1000 - (moves * 10) - (ghostPenalty * 50))

  // Ghost Tile mechanic
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (flippedIndices.length === 1) {
      timeout = setTimeout(() => {
        setCards(prev => {
          const newCards = [...prev]
          newCards[flippedIndices[0]].isFlipped = false
          return newCards
        })
        setFlippedIndices([])
        setGhostPenalty(p => p + 1)
        audio.playGhostPenalty()
      }, 3000)
    }
    return () => clearTimeout(timeout)
  }, [flippedIndices])

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    const deck = [...CONCEPTS, ...CONCEPTS]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ id: i, concept: c, isFlipped: false, isMatched: false }))
    setCards(deck)
    setFlippedIndices([])
    setMoves(0)
    setGhostPenalty(0)
    setGameOver(false)
    setShowClaim(false)
  }

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return
    if (cards[index].isFlipped || cards[index].isMatched) return

    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      if (newCards[first].concept === newCards[second].concept) {
        // Match
        audio.playMerge(3) // nice high chime
        setTimeout(() => {
          setCards(prev => {
            const matched = [...prev]
            matched[first].isMatched = true
            matched[second].isMatched = true
            return matched
          })
          setFlippedIndices([])
          
          // Check win
          if (newCards.every((c, i) => i === first || i === second || c.isMatched)) {
            setGameOver(true)
            audio.playMerge(5) // win chime
            setShowClaim(true)
          }
        }, 500)
      } else {
        // No match
        audio.playGhostPenalty()
        setTimeout(() => {
          setCards(prev => {
            const unmatched = [...prev]
            unmatched[first].isFlipped = false
            unmatched[second].isFlipped = false
            return unmatched
          })
          setFlippedIndices([])
        }, 1000)
      }
    }
  }

  return (
    <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: '32px', color: '#fff' }}>Echoes</h2>
          <div style={{ fontFamily: 'var(--font-figtree)', fontSize: '20px', color: '#FF1493' }}>Score: {score}</div>
        </div>
        {flippedIndices.length === 1 && (
          <motion.div 
            initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 3, ease: "linear" }}
            style={{ height: '2px', background: '#FF1493', marginBottom: '12px', transformOrigin: 'left' }}
          />
        )}

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: 'fit-content',
          padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px',
          boxShadow: score > 100 ? `0 0 ${Math.min((score - 100) / 10, 100)}px rgba(255,20,147,${Math.min(0.05 + (score - 100) / 2000, 0.4)})` : 'none',
          transition: 'box-shadow 0.3s ease'
        }}>
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(i)}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isFlipped || card.isMatched ? 1 : 0.95 }}
              style={{
                width: '80px', height: '120px',
                perspective: '1000px', cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer'
              }}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  width: '100%', height: '100%',
                  position: 'relative', transformStyle: 'preserve-3d'
                }}
              >
                {/* Front (Hidden) */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-bodoni-moda)', fontSize: '24px' }}>?</span>
                </div>
                
                {/* Back (Revealed) */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: card.isMatched ? '#FF1493' : '#fff', border: card.isMatched ? '1px solid #C2185B' : '1px solid #ccc',
                  borderRadius: '8px', transform: 'rotateY(180deg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', textAlign: 'center'
                }}>
                  <span style={{ 
                    color: card.isMatched ? '#fff' : '#000', 
                    fontFamily: 'var(--font-figtree)', fontSize: '12px', fontWeight: 'bold' 
                  }}>
                    {card.concept}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {gameOver && (
          <div style={{ marginTop: '24px' }}>
            <p style={{ color: '#FF1493', fontFamily: 'var(--font-figtree)', marginBottom: '16px' }}>All echoes resolved. Final Score: {score}</p>
            <button onClick={resetGame} style={{ padding: '8px 16px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-figtree)' }}>Restart</button>
            {username && <button onClick={() => setShowClaim(true)} style={{ padding: '8px 16px', background: 'transparent', color: '#FF1493', border: '1px solid #FF1493', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-figtree)', marginLeft: '12px' }}>Submit Score</button>}
          </div>
        )}
      </div>

      <Leaderboard game="echoes" />

      {showClaim && (
        <ClaimModal 
          score={score} game="echoes" uid={uid} username={username}
          onClaimed={(name) => { claimUsername(name); setShowClaim(false); }} 
        />
      )}
    </div>
  )
}
