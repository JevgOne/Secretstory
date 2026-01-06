import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LovelyGirls Prague - Luxusní Escort Služby'
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
          padding: '60px',
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

        {/* Logo and brand */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1,
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '90px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-2px',
            }}
          >
            <span style={{ color: '#d4af37', marginRight: '12px', fontSize: '100px' }}>L</span>
            ovely<span style={{ color: '#c41e3a', marginLeft: '12px' }}>Girls</span>
          </div>

          <div
            style={{
              fontSize: '32px',
              color: '#9a8a8e',
              marginBottom: '20px',
              letterSpacing: '2px',
            }}
          >
            PRAGUE
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '36px',
            color: '#c9b8bd',
            textAlign: 'center',
            zIndex: 1,
            marginBottom: '40px',
            maxWidth: '900px',
            lineHeight: 1.3,
          }}
        >
          Luxusní Escort Služby v Praze
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '60px',
            zIndex: 1,
            marginBottom: '50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '48px', marginBottom: '10px' }}>✓</span>
            <span style={{ fontSize: '20px', color: '#9a8a8e' }}>Ověřené Profily</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '48px', marginBottom: '10px' }}>🔒</span>
            <span style={{ fontSize: '20px', color: '#9a8a8e' }}>100% Diskrétní</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '48px', marginBottom: '10px' }}>⏰</span>
            <span style={{ fontSize: '20px', color: '#9a8a8e' }}>Dostupné 24/7</span>
          </div>
        </div>

        {/* Contact */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: '28px',
              color: '#d4af37',
              fontWeight: 'bold',
            }}
          >
            lovelygirls.cz
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#9a8a8e',
            }}
          >
            WhatsApp: +420 734 332 131
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '8px',
            background: 'linear-gradient(90deg, #c41e3a 0%, #d4af37 50%, #c41e3a 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
