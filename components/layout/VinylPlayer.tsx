'use client'

/**
 * components/layout/VinylPlayer.tsx
 *
 * Glassmorphism luxury music player.
 * Light background redesign:
 * — Background: rgba(255,255,255,0.85) glass
 * — Border: 1px solid rgba(255,20,147,0.12)
 * — SVG vinyl record replaces "N" avatar
 * — Deep rose play/pause button
 * — Custom pink volume slider
 * — NEVER auto-plays
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ColomboTime } from './ColomboTime'
import { nowPlaying } from '@/lib/data'
import { useTheme } from '@/lib/ThemeContext'

export function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)
  const [isMobileState, setIsMobileState] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const update = (matches: boolean) => setIsMobileState(matches)
    const mq = window.matchMedia('(max-width: 768px)')
    update(mq.matches)
    const handler = (e: MediaQueryListEvent) => update(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = volume
      audio.play().catch(() => {
        // Autoplay policy blocked — user must interact again
      })
      setIsPlaying(true)
    }
  }, [isPlaying, volume])

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  // Derived style tokens based on dark/light
  const bgStyle = isDark ? 'rgba(10,3,6,0.85)' : 'rgba(255,255,255,0.85)'
  const borderStyle = isDark ? '1px solid rgba(255,20,147,0.18)' : '1px solid rgba(255,20,147,0.12)'
  const shadowStyle = isDark
    ? '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)'
    : '0 8px 32px rgba(255,20,147,0.10), 0 2px 8px rgba(0,0,0,0.04)'
  const titleColor = isDark ? 'rgba(255,240,245,0.92)' : '#2D1A2E'
  const artistColor = isDark ? 'rgba(255,182,217,0.65)' : '#8B5A7A'

  const playerPill = (
    <motion.div
      data-hover="player"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        boxShadow: isDark
          ? '0 12px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 12px 40px rgba(255,20,147,0.18), 0 4px 12px rgba(0,0,0,0.06)',
        borderColor: 'rgba(255,20,147,0.25)',
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '0 14px 0 8px',
        width: '280px',
        height: '56px',
        borderRadius: '28px',
        background: bgStyle,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: borderStyle,
        boxShadow: shadowStyle,
        transition: 'background 350ms ease, border-color 350ms ease, box-shadow 350ms ease',
      }}
    >
      {/* SVG Vinyl Record — click to open Spotify */}
      <a
        href="https://open.spotify.com/track/6KnFJGCqVYxp7Q8BjVpCg"
        target="_blank"
        rel="noopener noreferrer"
        title="Listen on Spotify"
        style={{ flexShrink: 0, display: 'block', cursor: 'pointer' }}
        aria-label="Listen on Spotify"
      >
        <VinylSvg size={38} spinning={isPlaying} />
      </a>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>
        <div
          style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 400,
            fontSize: '12px',
            color: titleColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 350ms ease',
          }}
        >
          {nowPlaying.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: '10px',
            color: artistColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 350ms ease',
          }}
        >
          {nowPlaying.artist}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <PlayPauseButton playing={isPlaying} onClick={togglePlay} />
        {isPlaying && <WaveformBars />}
        <VolumeSlider value={volume} onChange={handleVolume} />
      </div>
    </motion.div>
  )

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        left: 'clamp(24px, 3vw, 48px)',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        maxWidth: 'calc(100vw - 48px)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden audio element — NEVER auto-plays */}
      <audio ref={audioRef} src={nowPlaying.audioSrc} loop preload="none" />

      {/* Colombo time — slides up above on hover (desktop) */}
      {!isMobileState && <ColomboTime visible={isHovered} />}

      {/* Mobile: circle toggle + expanded pill */}
      {isMobileState ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          {/* Mobile collapsed: 44px spinning vinyl circle */}
          <motion.button
            onClick={() => {
              if (!isMobileExpanded) {
                setIsMobileExpanded(true)
              } else {
                togglePlay()
              }
            }}
            onDoubleClick={() => setIsMobileExpanded(false)}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: borderStyle,
              background: bgStyle,
              backdropFilter: 'blur(20px)',
              boxShadow: shadowStyle,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'background 350ms ease, border-color 350ms ease, box-shadow 350ms ease',
            }}
            aria-label="Music player"
          >
            <VinylSvg size={32} spinning={isPlaying} />
          </motion.button>

          {/* Mobile expanded pill */}
          <AnimatePresence>
            {isMobileExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 12 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0 14px 0 8px',
                  height: '48px',
                  borderRadius: '100px',
                  background: isDark ? 'rgba(10,3,6,0.92)' : 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(20px)',
                  border: borderStyle,
                  boxShadow: shadowStyle,
                  transition: 'background 350ms ease, border-color 350ms ease, box-shadow 350ms ease',
                }}
              >
                <VinylSvg size={30} spinning={isPlaying} />
                <div style={{ lineHeight: 1.2 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-figtree)',
                      fontWeight: 400,
                      fontSize: '11px',
                      color: titleColor,
                      transition: 'color 350ms ease',
                    }}
                  >
                    {nowPlaying.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-figtree)',
                      fontWeight: 300,
                      fontSize: '10px',
                      color: artistColor,
                      transition: 'color 350ms ease',
                    }}
                  >
                    {nowPlaying.artist}
                  </div>
                </div>
                <PlayPauseButton playing={isPlaying} onClick={togglePlay} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        playerPill
      )}
    </div>
  )
}

/* \u2500\u2500 Waveform Bars \u2014 3 oscillating bars when music is playing \u2500\u2500 */
function WaveformBars() {
  return (
    <div
      aria-hidden
      style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '16px' }}
    >
      <div className="waveform-bar-1" style={{ width: '2px', background: '#C2185B', borderRadius: '1px' }} />
      <div className="waveform-bar-2" style={{ width: '2px', background: '#C2185B', borderRadius: '1px' }} />
      <div className="waveform-bar-3" style={{ width: '2px', background: '#C2185B', borderRadius: '1px' }} />
    </div>
  )
}

/* \u2500\u2500 SVG Vinyl Record \u2500\u2500 */
function VinylSvg({ size, spinning }: { size: number; spinning: boolean }) {
  return (
    <div
      className={spinning ? 'vinyl-spinning' : 'vinyl-paused'}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        /* Glow ring pulses when playing */
        boxShadow: spinning
          ? '0 0 0 2px rgba(194,24,91,0.15), 0 0 14px rgba(194,24,91,0.18)'
          : 'none',
        transition: 'box-shadow 0.5s ease',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        {/* Outer disc — dark warm tone */}
        <circle cx="20" cy="20" r="20" fill="#2D1A2E" />
        {/* Groove rings — monochrome at low opacity, physical texture */}
        <circle cx="20" cy="20" r="17.5" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" fill="none" />
        <circle cx="20" cy="20" r="15" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" fill="none" />
        <circle cx="20" cy="20" r="12.5" stroke="rgba(255,255,255,0.09)" strokeWidth="0.6" fill="none" />
        <circle cx="20" cy="20" r="10" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" fill="none" />
        <circle cx="20" cy="20" r="7.5" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" fill="none" />
        {/* Centre label — rose pink */}
        <circle cx="20" cy="20" r="5.5" fill="#C2185B" />
        <circle cx="20" cy="20" r="4" fill="#AD1457" />
        {/* Centre spindle hole */}
        <circle cx="20" cy="20" r="1.5" fill="#2D1A2E" />
        {/* Specular highlight — makes it feel like a physical object */}
        <ellipse cx="13" cy="12" rx="3.5" ry="2" fill="white" opacity="0.08" />
      </svg>
    </div>
  )
}

/* ── Deep Rose Play/Pause Button ── */
function PlayPauseButton({ playing, onClick }: { playing: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      data-hover="button"
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: 'none',
        background: playing ? 'rgba(194,24,91,0.12)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        color: '#C2185B',
        padding: 0,
        flexShrink: 0,
        transition: 'background 200ms',
      }}
      aria-label={playing ? 'Pause' : 'Play'}
    >
      {playing ? (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor">
          <rect x="2" y="2" width="3.5" height="10" rx="1" />
          <rect x="8.5" y="2" width="3.5" height="10" rx="1" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor">
          <path d="M3 2.5 L12 7 L3 11.5 Z" />
        </svg>
      )}
    </motion.button>
  )
}

/* ── Custom Volume Slider — pink track + hot pink thumb ── */
function VolumeSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={value}
      onChange={onChange}
      aria-label="Volume"
      style={{
        width: '44px',
        cursor: 'pointer',
        // Custom styling via globals.css input[type="range"] rules
      }}
    />
  )
}
