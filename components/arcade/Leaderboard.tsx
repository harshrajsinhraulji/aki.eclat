import { useState, useEffect } from 'react'

export default function Leaderboard({ game }: { game: string }) {
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchScores() {
      try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`
        
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            structuredQuery: {
              from: [{ collectionId: `leaderboards_${game}` }],
              orderBy: [{ field: { fieldPath: 'score' }, direction: 'DESCENDING' }],
              limit: 10
            }
          })
        })
        const data = await res.json()
        const parsed = data.map((item: any) => {
          if (!item.document) return null
          return {
            username: item.document.fields.username.stringValue,
            score: item.document.fields.score.integerValue
          }
        }).filter(Boolean)
        setScores(parsed)
      } catch (e) {
        console.error('Leaderboard error', e)
      }
      setLoading(false)
    }
    fetchScores()
  }, [game])

  return (
    <div style={{ padding: '24px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)', width: '100%' }}>
      <h3 style={{ fontFamily: 'var(--font-bodoni-moda)', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>Top Synths</h3>
      {loading ? <p style={{ color: 'var(--text-soft)' }}>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-figtree)' }}>
          {scores.map((s, i) => (
            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-soft)' }}>
              <span style={{ color: i === 0 ? '#FF1493' : 'var(--text-mid)' }}>{i + 1}. {s.username}</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{s.score}</span>
            </li>
          ))}
          {scores.length === 0 && <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>No entries yet.</p>}
        </ul>
      )}
    </div>
  )
}
