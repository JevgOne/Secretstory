import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LovelyGirls Prague - Premium Escort Services'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0e1f 0%, #2d1b3d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            background: 'radial-gradient(circle at 20% 50%, #c41e3a 0%, transparent 50%), radial-gradient(circle at 80% 50%, #d4af37 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            zIndex: 1,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '72px',
              fontWeight: '300',
              color: '#fff',
              letterSpacing: '0.05em',
              marginBottom: '40px',
            }}
          >
            <span
              style={{
                fontSize: '80px',
                fontWeight: '500',
                marginRight: '10px',
                color: '#d4af37',
              }}
            >
              L
            </span>
            ovely Girls
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '36px',
              color: '#c9b8bd',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: '1.4',
              marginBottom: '30px',
            }}
          >
            Premium Escort Services & Erotic Massage
          </div>

          {/* Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '28px',
              color: '#9a8a8e',
              marginTop: '20px',
            }}
          >
            <span style={{ marginRight: '10px' }}>📍</span>
            Prague, Czech Republic
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '50px',
              fontSize: '20px',
              color: '#c9b8bd',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>✓</span>
              Verified Profiles
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🔒</span>
              Discreet & Safe
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>⭐</span>
              Professional
            </div>
          </div>
        </div>

        {/* Bottom banner */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '80px',
            background: 'rgba(212, 175, 55, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#d4af37',
            borderTop: '2px solid rgba(212, 175, 55, 0.3)',
          }}
        >
          lovelygirls.cz | Available 24/7
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
