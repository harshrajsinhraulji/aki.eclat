'use client'

/**
 * components/ui/SparkleSvg.tsx
 * Four-pointed sparkle SVG in --gold.
 * Used as decorative accents throughout the site.
 */

interface SparkleSvgProps {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

export function SparkleSvg({
  size = 16,
  color = '#C9A465',
  className = '',
  style = {},
}: SparkleSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', ...style }}
      aria-hidden
    >
      {/* Four-pointed star */}
      <path
        d="M12 2 L13.4 9.5 L20 12 L13.4 14.5 L12 22 L10.6 14.5 L4 12 L10.6 9.5 Z"
        fill={color}
      />
    </svg>
  )
}
