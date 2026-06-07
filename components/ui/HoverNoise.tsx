'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

/**
 * HoverNoise
 * An invisible SVG wrapper that generates dynamic fractal noise when hovered.
 * Used for cards, images, and interactive surfaces.
 */
export function HoverNoise({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SVG Noise Filter */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
            mixBlendMode: 'overlay',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
          }}
        />
      )}
      {children}
    </div>
  )
}
