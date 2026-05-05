'use client'

/**
 * components/layout/Navbar.tsx
 * Hidden until hero sentinel exits viewport.
 * IntersectionObserver on #hero-sentinel div → slides in from top.
 *
 * Desktop: Aki wordmark left | nav links right (Figtree 300, 11px, 0.14em spacing)
 * Mobile:  3-dot toggle → staggered link list
 *
 * Active section tracking: IO with threshold 0.4 on each section.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { navLinks } from '@/lib/data'
import { stagger, easings } from '@/lib/motion'

export function Navbar() {
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
        if (entry.isIntersecting) setMobileOpen(false)
      },
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => l.href.replace('#', ''))
      .filter((id) => !id.startsWith('/'))

    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="navbar"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.4, ease: easings.outExpo }}
          style={{
            position: 'fixed',
            top: '32px', // below ticker height
            left: 0,
            right: 0,
            height: '56px',
            zIndex: 900,
            background: 'rgba(255, 240, 245, 0.94)',
            backdropFilter: 'blur(20px) saturate(200%)',
            borderBottom: '1px solid rgba(255, 20, 147, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Wordmark */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: '1.2rem',
              color: '#FF1493',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
            data-hover="link"
          >
            Aki
          </Link>

          {/* Desktop links — only shown on pointer:fine devices */}
          <div
            className="desktop-only"
            style={{ display: 'flex', alignItems: 'center', gap: '36px' }}
          >
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <NavLink key={link.label} href={link.href} isActive={isActive}>
                  {link.label}
                </NavLink>
              )
            })}
          </div>

          {/* Mobile toggle — 3 dots — hidden on desktop */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '10px',  // 44x44 touch target (Fitts' Law)
              position: 'absolute',
              right: '14px',
              minWidth: '44px',
              minHeight: '44px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: mobileOpen ? '#FF1493' : '#AD1457',
                  transition: 'background 200ms',
                }}
              />
            ))}
          </button>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: easings.outExpo }}
                style={{
                  position: 'absolute',
                  top: '56px',
                  left: 0,
                  right: 0,
                  background: 'rgba(255, 240, 245, 0.98)',
                  backdropFilter: 'blur(24px)',
                  borderBottom: '1px solid rgba(255, 20, 147, 0.1)',
                  overflow: 'hidden',
                  padding: '12px 24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0',
                }}
              >
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * stagger.nav, duration: 0.3, ease: easings.outExpo }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 0',
                        fontFamily: 'var(--font-figtree)',
                        fontWeight: 300,
                        fontSize: '13px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#A8627A',
                        textDecoration: 'none',
                        borderBottom: '1px solid rgba(255,20,147,0.07)',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

function NavLink({
  href,
  children,
  isActive,
}: {
  href: string
  children: React.ReactNode
  isActive: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover="link"
      style={{
        position: 'relative',
        fontFamily: 'var(--font-figtree)',
        fontWeight: 300,
        fontSize: '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: isActive || hovered ? '#FF1493' : '#A8627A',
        textDecoration: 'none',
        transition: 'color 200ms',
        paddingBottom: '3px',
      }}
    >
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive || hovered ? 1 : 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, #FF1493, #C2185B)',
          transformOrigin: 'left',
        }}
      />
    </Link>
  )
}
