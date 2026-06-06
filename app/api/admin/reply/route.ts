import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { password, confessionId, response } = await req.json()

    if (password !== 'ladygagabobs') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!confessionId || !response) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    
    if (!projectId || !apiKey) {
      return NextResponse.json({ error: 'Firebase config missing' }, { status: 500 })
    }

    // Use REST API to bypass Next.js Firebase Client SDK gRPC bugs
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/confessions/${confessionId}?updateMask.fieldPaths=akiResponse&key=${apiKey}`
    
    const payload = {
      fields: {
        akiResponse: { stringValue: response }
      }
    }

    const firestoreRes = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!firestoreRes.ok) {
      const errorText = await firestoreRes.text()
      console.error('Firestore REST Error:', firestoreRes.status, errorText)
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Admin reply error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
