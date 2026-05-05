'use client'

/**
 * app/layout-client.tsx
 *
 * Client shell. Key fix: main content starts visible (opacity:1).
 * LoadingScreen sits ABOVE content as a fixed overlay — content
 * never needs to wait for it. This eliminates the blank screen bug.
 *
 * The LoadingScreen is a cosmetic overlay only.
 * It does not gate the main content.
 */

import { useCallback } from 'react'
import { useLenis } from '@/hooks/useLenis'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { CursorTrail } from '@/components/layout/CursorTrail'
import { ObsessionsTicker } from '@/components/layout/ObsessionsTicker'
import { VinylPlayer } from '@/components/layout/VinylPlayer'
import { VisitorCounter } from '@/components/layout/VisitorCounter'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  useLenis()

  // onComplete is a no-op now — loading screen is just cosmetic overlay
  const handleLoadComplete = useCallback(() => {
    // No-op: content is already visible. LoadingScreen just fades out.
  }, [])

  return (
    <>
      {/* Loading screen — fixed overlay, purely cosmetic, never gates content */}
      <LoadingScreen onComplete={handleLoadComplete} />

      {/* Global persistent UI elements */}
      <CustomCursor />
      <CursorTrail />
      <ObsessionsTicker />
      <ScrollProgress />
      <VinylPlayer />
      <VisitorCounter />
      <Navbar />

      {/* Page content — always visible, no opacity gate */}
      <main style={{ minHeight: '100dvh' }}>
        {children}
      </main>

      <Footer />
    </>
  )
}
