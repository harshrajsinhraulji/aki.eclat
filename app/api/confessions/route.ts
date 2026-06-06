import { NextResponse } from 'next/server'

// Extremely simple in-memory rate limiting map for edge environments
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS = 5

export async function POST(req: Request) {
  try {
    // 1. IP-based simple rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous'
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (record && now - record < RATE_LIMIT_WINDOW) {
      // Still in window, reject if they sent too many (we only allow 1 per minute here for strictness)
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    
    // Update rate limit record
    rateLimitMap.set(ip, now)

    const body = await req.json()
    const { text, author, honeypot } = body

    // 2. Honeypot check (bot protection)
    if (honeypot) {
      // Bots usually fill all fields
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    // 3. Validation & Sanitization
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Basic sanitization - strip html tags
    const sanitizedText = text.replace(/<[^>]*>?/gm, '').trim()
    const sanitizedAuthor = author ? author.replace(/<[^>]*>?/gm, '').trim() : 'anon'

    if (sanitizedText.length === 0 || sanitizedText.length > 500) {
      return NextResponse.json({ error: 'Text must be between 1 and 500 characters' }, { status: 400 })
    }

    // 4. Database execution via REST API (bypasses Next.js gRPC bug)
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    
    if (!projectId || !apiKey) {
      return NextResponse.json({ error: 'Firebase config missing' }, { status: 500 })
    }

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/confessions?key=${apiKey}`
    
    const payload = {
      fields: {
        text: { stringValue: sanitizedText },
        author: { stringValue: sanitizedAuthor },
        createdAt: { timestampValue: new Date().toISOString() },
        rotation: { doubleValue: (Math.random() * 8) - 4 }
      }
    }

    const firestoreRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!firestoreRes.ok) {
      const errorText = await firestoreRes.text()
      console.error('Firestore REST Error:', firestoreRes.status, errorText)
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 })
    }

    const firestoreData = await firestoreRes.json()
    // Extract document ID from the standard Firestore REST format: "projects/.../documents/confessions/{id}"
    const docId = firestoreData.name?.split('/').pop() || 'unknown'

    return NextResponse.json({ success: true, id: docId }, { status: 201 })
  } catch (error) {
    console.error('Confession POST error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
