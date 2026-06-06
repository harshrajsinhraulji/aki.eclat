'use client'

/**
 * components/ui/KeyboardNav.tsx
 * Arrow key navigation between sections.
 * ↓ = next section, ↑ = previous section.
 * Ignored when focus is inside an input/textarea.
 */

import { useEffect } from 'react'

const SECTION_IDS = [
  'hero',
  'coconut',
  'universe',
  'closet',
  'art',
  'plushies',
  'confessions-teaser',
  'contact',
]

export function KeyboardNav() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()

      const vh2 = window.innerHeight / 2
      const current = SECTION_IDS.findIndex((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= vh2 && rect.bottom > 0
      })

      const next =
        e.key === 'ArrowDown'
          ? Math.min(current + 1, SECTION_IDS.length - 1)
          : Math.max(current - 1, 0)

      document
        .getElementById(SECTION_IDS[next])
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
