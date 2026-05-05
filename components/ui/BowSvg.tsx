'use client'

/**
 * components/ui/BowSvg.tsx
 * Precisely drawn SVG bow — not an emoji, a vector.
 * Two loops, two trailing ribbons, --pink-deep colour.
 * Used on: loading screen letter i, hero name i, tagline ribbon.
 *
 * Props:
 *   size — width in px (height calculated proportionally)
 *   color — fill/stroke colour
 *   swing — enables pendulum swing animation
 *   swingReverse — reverses phase (tagline bow swings opposite)
 */

import { motion, type Variants } from 'framer-motion'

interface BowSvgProps {
  size?: number
  color?: string
  swing?: boolean
  swingReverse?: boolean
  className?: string
  style?: React.CSSProperties
}

export function BowSvg({
  size = 32,
  color = '#C2185B',
  swing = false,
  swingReverse = false,
  className = '',
  style = {},
}: BowSvgProps) {
  const h = size * 0.75 // proportional height

  const swingVariants: Variants = {
    idle: { rotate: 0 },
    swinging: {
      rotate: swingReverse ? [8, -8, 8] : [-8, 8, -8],
      transition: {
        duration: 2.5,
        ease: 'easeInOut' as const,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
  }

  return (
    <motion.svg
      width={size}
      height={h}
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', transformOrigin: '50% 35%', ...style }}
      variants={swing ? swingVariants : undefined}
      animate={swing ? 'swinging' : 'idle'}
      aria-hidden
    >
      {/* Left bow loop */}
      <path
        d="M32 24 C32 24 18 8 8 10 C2 11 0 18 4 22 C8 26 20 22 32 24Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M32 24 C32 24 16 18 10 28 C6 35 10 42 18 40 C26 38 28 30 32 24Z"
        fill={color}
        opacity="0.75"
      />

      {/* Right bow loop */}
      <path
        d="M32 24 C32 24 46 8 56 10 C62 11 64 18 60 22 C56 26 44 22 32 24Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M32 24 C32 24 48 18 54 28 C58 35 54 42 46 40 C38 38 36 30 32 24Z"
        fill={color}
        opacity="0.75"
      />

      {/* Centre knot */}
      <ellipse cx="32" cy="24" rx="5" ry="5.5" fill={color} />

      {/* Left ribbon trailing */}
      <path
        d="M27 26 C20 32 14 38 12 46"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />

      {/* Right ribbon trailing */}
      <path
        d="M37 26 C44 32 50 38 52 46"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
    </motion.svg>
  )
}
