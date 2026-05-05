'use client'

/**
 * hooks/useKeySequence.ts
 * Detects a keyboard sequence (Konami-style).
 * Used to unlock the admin panel without a visible button.
 *
 * Default sequence: ↑ ↑ ↓ ↓ ← → ← → (configurable)
 * On match: calls the provided callback.
 */

import { useEffect, useRef, useCallback } from 'react'

export function useKeySequence(
  sequence: string[],
  onMatch: () => void,
  timeoutMs = 3000
) {
  const inputRef = useRef<string[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    inputRef.current = []
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      inputRef.current.push(e.key)

      // Keep only the last N keys (length of sequence)
      if (inputRef.current.length > sequence.length) {
        inputRef.current.shift()
      }

      // Reset the idle timer
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(reset, timeoutMs)

      // Check for match
      const isMatch =
        inputRef.current.length === sequence.length &&
        inputRef.current.every((key, i) => key === sequence[i])

      if (isMatch) {
        onMatch()
        reset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [sequence, onMatch, timeoutMs, reset])
}
