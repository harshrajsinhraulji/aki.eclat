'use client'

/**
 * components/layout/SectionNavDots.tsx
 *
 * #53 Fixed right-side dot navigation
 * #58 Active section highlight
 *
 * Desktop only. Each dot corresponds to a page section.
 * Active dot pulses pink. Hovering reveals a label.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'hero',               label: 'Home'    },
  { id: 'coconut',            label: 'About'   },
  { id: 'universe',           label: 'Universe'},
  { id: 'closet',             label: 'Closet'  },
  { id: 'art',                label: 'Art'     },
  { id: 'plushies',           label: 'Gang'    },
  { id: 'confessions-teaser', label: 'Spill'   },
  { id: 'contact',            label: 'Talk'    },
]

export function SectionNavDots() {
  const [activeId, setActiveId] = useState('hero')
  const [visible, setVisible] = useState(false)

  // Show dots after hero leaves viewport
  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([e]) => setVisible(!e.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  // Track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="section-dots"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-nav-dots"
          aria-label="Section navigation"
        >
          {SECTIONS.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <button
                key={id}
                className={`section-nav-dot${isActive ? ' active' : ''}`}
                onClick={() => scrollTo(id)}
                aria-label={`Navigate to ${label}`}
                style={{ background: 'none', border: 'none', padding: '4px 0' }}
              >
                <span className="section-nav-dot-label">{label}</span>
                <motion.span
                  className="section-nav-dot-circle"
                  animate={{
                    scale: isActive ? 1.4 : 1,
                    backgroundColor: isActive ? '#FF1493' : 'rgba(194,24,91,0.25)',
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </button>
            )
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
