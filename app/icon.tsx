import { ImageResponse } from 'next/og'

/**
 * app/icon.tsx
 * Dynamic favicon using Next.js App Router icon convention.
 * Renders a hot pink background with a white bow — matches the site identity.
 */

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 512, height: 512 }

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '512px',
          height: '512px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF1493 0%, #C2185B 100%)',
          borderRadius: '120px',
        }}
      >
        {/* Bow SVG rendered inline */}
        <div
          style={{
            fontSize: '280px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          🎀
        </div>
      </div>
    ),
    { ...size }
  )
}
