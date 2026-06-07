import { ImageResponse } from 'next/og'

/**
 * app/icon.tsx
 * Dynamic favicon using Next.js App Router icon convention.
 * Rendered using the primary brand colors: pale blush background and hot pink.
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
          background: '#FFF0F5', // Pale blush
          borderRadius: '120px',
          border: '12px solid #FFD6E7', // Soft blush border
        }}
      >
        <div
          style={{
            fontSize: '340px',
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontWeight: 'bold',
            color: '#E91E63', // Hot pink
            lineHeight: 1,
            marginTop: '-40px',
            textShadow: '4px 4px 16px rgba(233, 30, 99, 0.2)',
          }}
        >
          a
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            right: '130px',
            width: '40px',
            height: '40px',
            background: '#C2185B', // Deep pink dot
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
