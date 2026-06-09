import { NextResponse } from 'next/server'

const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous'
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    // Rate limiting: 1 score submission per minute per IP to prevent spam
    if (record && now - record < RATE_LIMIT_WINDOW) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    rateLimitMap.set(ip, now)

    const body = await req.json()
    const { game, username, score, uid, honeypot } = body

    if (honeypot) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

    if (!game || !username || typeof score !== 'number' || !uid) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const sanitizedUser = username.replace(/<[^>]*>?/gm, '').trim().substring(0, 15)

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    if (!projectId || !apiKey) throw new Error('Missing Firebase Config')

    // Use REST API to write to leaderboards_GAME_scores collection
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/leaderboards_${game}?key=${apiKey}`
    
    const payload = {
      fields: {
        username: { stringValue: sanitizedUser },
        score: { integerValue: Math.floor(score) },
        uid: { stringValue: String(uid) },
        timestamp: { timestampValue: new Date().toISOString() }
      }
    }

    const firestoreRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!firestoreRes.ok) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Score POST error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
