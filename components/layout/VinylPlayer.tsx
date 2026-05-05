'use client'

/**
 * components/layout/VinylPlayer.tsx
 * Fixed bottom-left. Glassmorphic luxury music player.
 *
 * Desktop: 272px pill with vinyl, track info, play/pause, volume
 * Mobile:  44px circle — tap to expand full pill, tap again to play
 *
 * Audio: /audio/drinkee-preview.mp3 — never autoplays
 * Vinyl SVG spins only when playing
 * On hover: ColomboTime slides up above
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ColomboTime } from './ColomboTime'
import { nowPlaying } from '@/lib/data'

export function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)
  const isMobile = useRef(false)
  const [isMobileState, setIsMobileState] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const update = (matches: boolean) => {
      isMobile.current = matches
      setIsMobileState(matches)
    }
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

  const playerPill = (
    <motion.div
      data-hover="player"
      whileHover={{ boxShadow: '0 8px 32px rgba(255, 20, 147, 0.22)' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '0 14px 0 6px',
        width: '272px',
        height: '52px',
        borderRadius: '26px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 20, 147, 0.14)',
        boxShadow: '0 4px 20px rgba(255, 20, 147, 0.1)',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <VinylSvg size={40} spinning={isPlaying} />
      </div>

      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
        <div
          style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 500,
            fontSize: '12px',
            color: '#1A0A12',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {nowPlaying.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: '10px',
            color: '#A8627A',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {nowPlaying.artist}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <PlayPauseButton playing={isPlaying} onClick={togglePlay} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          aria-label="Volume"
          style={{ width: '44px' }}
        />
      </div>
    </motion.div>
  )

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={nowPlaying.audioSrc} loop preload="none" />

      {/* Colombo time — slides up above on hover (desktop) */}
      {!isMobileState && <ColomboTime visible={isHovered} />}

      {/* Mobile: circle toggle + expanded pill above */}
      {isMobileState ? (
        <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-start', gap: '8px' }}>
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
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 16px rgba(255,20,147,0.18)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
            aria-label="Music player"
          >
            <VinylSvg size={34} spinning={isPlaying} />
          </motion.button>

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
                  background: 'rgba(255,255,255,0.97)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,20,147,0.14)',
                  boxShadow: '0 4px 16px rgba(255,20,147,0.12)',
                }}
              >
                <VinylSvg size={30} spinning={isPlaying} />
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontFamily: 'var(--font-figtree)', fontWeight: 500, fontSize: '11px', color: '#1A0A12' }}>
                    {nowPlaying.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-figtree)', fontWeight: 300, fontSize: '10px', color: '#A8627A' }}>
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

/* ── Vinyl Record SVG ── */
function VinylSvg({ size, spinning }: { size: number; spinning: boolean }) {
  return (
    <div
      className={spinning ? 'vinyl-spinning' : 'vinyl-paused'}
      style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="20" fill="#1A0A12" />
        <circle cx="20" cy="20" r="17" stroke="#3D1A2A" strokeWidth="0.6" fill="none" />
        <circle cx="20" cy="20" r="14" stroke="#3D1A2A" strokeWidth="0.6" fill="none" />
        <circle cx="20" cy="20" r="11" stroke="#3D1A2A" strokeWidth="0.6" fill="none" />
        <circle cx="20" cy="20" r="8.5" stroke="#3D1A2A" strokeWidth="0.6" fill="none" />
        <circle cx="20" cy="20" r="6" fill="#C2185B" />
        <circle cx="20" cy="20" r="4.5" fill="#AD1457" />
        <circle cx="20" cy="20" r="1.5" fill="#FF1493" />
        <ellipse cx="14" cy="13" rx="3" ry="2" fill="white" opacity="0.07" />
      </svg>
    </div>
  )
}

/* ── Play/Pause Button ── */
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
        background: playing ? 'rgba(255,20,147,0.1)' : 'transparent',
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
