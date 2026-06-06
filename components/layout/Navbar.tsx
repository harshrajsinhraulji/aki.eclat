'use client'

/**
 * components/layout/Navbar.tsx
 *
 * Architecture: Three-column CSS grid for perfect non-overlapping layout.
 * [wordmark | nav links | mobile toggle]
 *
 * UPGRADES:
 * — #55 Pill nav: morphs to pill shape with deeper blur on scroll
 * — #57 Full-screen mobile menu: blush overlay with large staggered links
 * — #62 Better scroll auto-hide: hide after 200px scroll down, show on any scroll up
 * — #80 meta theme-color: updated via ThemeContext
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { navLinks } from '@/lib/data'
import { easings } from '@/lib/motion'
import { BowSvg } from '@/components/ui/BowSvg'
import { useTheme } from '@/lib/ThemeContext'

const DARK_SECTIONS = new Set(['universe', 'confessions-teaser', 'contact'])

export function Navbar() {
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'midnight' || theme === 'dusk'
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  // Show navbar after hero sentinel leaves viewport
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

  // #55 Pill shape + #62 auto-hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      // Pill shape at 80px
      setScrolled(currentY > 80)

      // Hide when scrolling down > 12px (after 200px from top), show on any up
      if (currentY > 200) {
        if (delta > 12) {
          setHidden(true)
          setMobileOpen(false)
        } else if (delta < -4) {
          setHidden(false)
        }
      } else {
        setHidden(false)
      }

      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => l.href.replace('#', ''))
      .filter((id) => !id.startsWith('/'))

    const allTrackedIds = [...sectionIds, 'universe', 'confessions-teaser', 'contact']
    const observers: IntersectionObserver[] = []

    allTrackedIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // #80 Dynamic meta theme-color
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) {
      meta.content = isDark ? '#0A0306' : '#FFF5F8'
    }
  }, [isDark])

  // Derived theme tokens
  const navBg = isDark
    ? 'rgba(10,3,6,0.88)'
    : 'rgba(255,245,248,0.92)'
  const navBorder = isDark
    ? 'rgba(255,20,147,0.15)'
    : 'rgba(255,20,147,0.10)'
  const navShadow = isDark
    ? '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,20,147,0.08)'
    : '0 8px 40px rgba(194,24,91,0.08), 0 1px 0 rgba(255,20,147,0.06)'
  const wordmarkColor = isDark ? 'rgba(255,245,248,0.92)' : '#2D1A2E'
  const wordmarkHover = '#FF1493'
  const linkColor = isDark ? 'rgba(255,182,217,0.65)' : '#8B5A7A'
  const linkActive = '#FF1493'
  const dotColor = isDark ? 'rgba(255,182,217,0.65)' : '#8B5A7A'
  const mobileBg = isDark ? 'rgba(10,3,6,0.98)' : 'rgba(255,245,248,0.98)'

  return (
    <>
      <AnimatePresence>
        {visible && !hidden && (
          <motion.nav
            key="navbar"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4, ease: easings.outExpo }}
            style={{
              position: 'fixed',
              top: scrolled ? '16px' : '24px',
              left: scrolled ? '24px' : 0,
              right: scrolled ? '24px' : 0,
              height: scrolled ? '56px' : '60px',
              zIndex: 900,
              background: navBg,
              backdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'blur(24px) saturate(180%)',
              borderTop: scrolled ? `1px solid ${navBorder}` : 'none',
              borderRight: scrolled ? `1px solid ${navBorder}` : 'none',
              borderLeft: scrolled ? `1px solid ${navBorder}` : 'none',
              borderBottom: `1px solid ${navBorder}`,
              boxShadow: navShadow,
              borderRadius: scrolled ? '24px' : '0px',
              transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center',
              padding: '0 clamp(16px, 3vw, 32px)',
              gap: 'clamp(12px, 2vw, 32px)',
            }}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Col 1: Wordmark with tiny swinging bow badge */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-bodoni-moda)',
                fontVariationSettings: '"wght" 400, "opsz" 48',
                fontSize: '1.15rem',
                color: wordmarkColor,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                transition: 'color 350ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = wordmarkHover }}
              onMouseLeave={(e) => { e.currentTarget.style.color = wordmarkColor }}
              data-hover="link"
            >
              Aki
              <BowSvg size={12} color="#C2185B" swing={true} style={{ marginLeft: '1px' }} />
            </Link>

            {/* Col 2: Centre nav links — DESKTOP ONLY */}
            <div
              className="nav-desktop"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(20px, 3vw, 44px)',
              }}
            >
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '')
                const isActive = activeSection === sectionId
                return (
                  <NavLink
                    key={link.label}
                    href={link.href}
                    isActive={isActive}
                    isDark={isDark}
                    defaultColor={linkColor}
                    activeColor={linkActive}
                  >
                    {link.label}
                  </NavLink>
                )
              })}
            </div>

            {/* Col 2 (mobile): spacer */}
            <div className="nav-mobile" style={{ display: 'none' }} aria-hidden />

            {/* Col 3: Theme toggle & 3-dot mobile toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="nav-mobile"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '12px',
                  minWidth: '48px',
                  minHeight: '48px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Toggle navigation"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  // X icon when open
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M2 2L14 14M14 2L2 14" stroke="#FF1493" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  [0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        display: 'block',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: dotColor,
                        transition: 'background 350ms ease',
                      }}
                    />
                  ))
                )}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* #57 Full-screen mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-fullscreen-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-nav-fullscreen"
            style={{ background: mobileBg, backdropFilter: 'blur(32px)' }}
            onClick={() => setMobileOpen(false)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute',
                top: '28px',
                right: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '12px',
              }}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 3L17 17M17 3L3 17" stroke="#FF1493" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>

            {/* Decorative bow */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ marginBottom: '40px' }}
            >
              <BowSvg size={36} color="#FF1493" swing={true} />
            </motion.div>

            {/* Nav links — large and staggered */}
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{
                  delay: 0.1 + i * 0.07,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ width: '100%', textAlign: 'center' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    padding: '18px 40px',
                    fontFamily: 'var(--font-bodoni-moda)',
                    fontVariationSettings: '"wght" 400, "opsz" 48',
                    fontSize: 'clamp(32px, 8vw, 52px)',
                    letterSpacing: '-0.02em',
                    color: link.href.startsWith('/') ? '#C9A465' : (isDark ? 'rgba(255,245,248,0.85)' : '#2D1A2E'),
                    textDecoration: 'none',
                    lineHeight: 1.1,
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FF1493' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = link.href.startsWith('/') ? '#C9A465' : (isDark ? 'rgba(255,245,248,0.85)' : '#2D1A2E') }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Bottom caption */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'absolute',
                bottom: '32px',
                fontFamily: 'var(--font-figtree)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#FF1493',
              }}
            >
              aki.eclat
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({
  href,
  children,
  isActive,
  isDark,
  defaultColor,
  activeColor,
}: {
  href: string
  children: React.ReactNode
  isActive: boolean
  isDark: boolean
  defaultColor: string
  activeColor: string
}) {
  const [hovered, setHovered] = useState(false)
  const isHighlighted = isActive || hovered
  const isSpecial = href.startsWith('/')
  const resolvedDefaultColor = isSpecial ? '#C9A465' : defaultColor

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
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: isHighlighted ? (isSpecial ? '#FF1493' : activeColor) : resolvedDefaultColor,
        textDecoration: 'none',
        transition: 'color 200ms ease',
        paddingBottom: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHighlighted ? 1 : 0 }}
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

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'midnight' || theme === 'dusk'

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme === 'dawn' || theme === 'noon' ? '#8B5A7A' : '#FFB6D9',
        transition: 'color 300ms ease, background 300ms ease',
        pointerEvents: 'auto',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,182,217,0.1)' : 'rgba(255,20,147,0.06)'
        e.currentTarget.style.color = '#FF1493'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = theme === 'dawn' || theme === 'noon' ? '#8B5A7A' : '#FFB6D9'
      }}
      aria-label="Toggle theme mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dawn' || theme === 'noon' ? (
          <motion.svg
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}
