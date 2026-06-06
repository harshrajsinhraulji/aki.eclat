/**
 * lib/firebase.ts
 * Firebase client factory — safe initialisation with graceful fallback.
 *
 * Supports:
 *   - Realtime Database (presence / visitor counter)
 *   - Firestore (confessions, reactions, admin settings)
 *
 * If env vars are not configured, each export is null.
 * All consumers must guard: `if (!database) return`
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check'
import { getDatabase, type Database } from 'firebase/database'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Determine if we have enough config to initialise
const hasConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
)

const hasDatabaseUrl = Boolean(firebaseConfig.databaseURL)

let app: FirebaseApp | null = null
let database: Database | null = null
let firestore: Firestore | null = null
let appCheck: AppCheck | null = null

if (hasConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

    if (hasDatabaseUrl) {
      database = getDatabase(app)
    }

    firestore = getFirestore(app)

    // Security: App Check
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      })
    }
  } catch (e) {
    // Log to console in dev only — never crash the app
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Firebase] Initialisation failed:', e)
    }
  }
}

export { app, database, firestore, appCheck }
export default app
