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
          background: '#0A0306',
          borderRadius: '120px',
          border: '8px solid rgba(255, 20, 147, 0.4)',
        }}
      >
        <div
          style={{
            fontSize: '320px',
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontWeight: 'bold',
            color: '#FFF0F5',
            lineHeight: 1,
            marginTop: '-40px',
          }}
        >
          A
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            right: '120px',
            width: '40px',
            height: '40px',
            background: '#FF1493',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
