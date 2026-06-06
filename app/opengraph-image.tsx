import { ImageResponse } from 'next/og'

/**
 * app/opengraph-image.tsx
 * Auto-generated OG image for Discord, Twitter, and social link previews.
 * Renders as a server-side PNG at /opengraph-image
 *
 * Design: AKI wordmark on deep pink, Bodoni-style serif, grain overlay,
 * "aneh, I'm just a girl" tagline, decorative bow unicode.
 */

export const runtime = 'edge'
export const alt = "Aki's World — aneh, I'm just a girl 🎀"
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF1493 0%, #C2185B 60%, #AD1457 100%)',
          padding: '80px 100px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'serif',
        }}
      >
        {/* Subtle vignette overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 80% 50%, rgba(255,105,180,0.25) 0%, transparent 60%)',
          }}
        />

        {/* Large decorative background letter */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '-60px',
            fontSize: '520px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.05)',
            lineHeight: 1,
            letterSpacing: '-0.05em',
            fontStyle: 'italic',
            display: 'flex',
          }}
        >
          A
        </div>

        {/* Section label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              display: 'flex',
            }}
          />
          <span
            style={{
              fontSize: '14px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 400,
              display: 'flex',
            }}
          >
            aki.eclat · personal world
          </span>
        </div>

        {/* AKI wordmark */}
        <div
          style={{
            fontSize: '180px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            marginBottom: '28px',
            fontStyle: 'italic',
            display: 'flex',
          }}
        >
          AKI
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.75)',
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          aneh, I&apos;m just a girl
          <span style={{ fontSize: '28px', display: 'flex' }}>🎀</span>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            left: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {['interior design', '·', 'psychology', '·', 'diamond 1', '·', 'coconut'].map(
            (tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 400,
                  display: 'flex',
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  )
}
