import { ImageResponse } from 'next/og'
import { db } from '@/lib/db'

export const runtime = 'edge'
export const alt = 'Girl Profile - LovelyGirls Prague'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string; locale?: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  console.log('[OG IMAGE] Generating for slug:', slug)

  // Fetch girl data WITH PRIMARY PHOTO
  let girl: any = null
  let photoUrl: string | null = null

  try {
    const result = await db.execute({
      sql: `
        SELECT
          g.name, g.age, g.height, g.weight, g.nationality,
          (SELECT url FROM girl_photos WHERE girl_id = g.id AND is_primary = 1 LIMIT 1) as photo_url
        FROM girls g
        WHERE g.slug = ? AND g.status = 'active'
      `,
      args: [slug]
    })
    girl = result.rows[0]
    photoUrl = girl?.photo_url as string | null
    console.log('[OG IMAGE] Girl found:', girl?.name || 'none', 'Photo:', photoUrl ? 'YES' : 'NO')
  } catch (error) {
    console.error('[OG IMAGE] Error fetching girl:', error)
  }

  if (!girl) {
    console.log('[OG IMAGE] No girl found, using defaults')
    girl = {
      name: 'Profile',
      age: 0,
      height: 0,
      weight: 0,
      nationality: ''
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0e1f 0%, #2d1b3d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px 80px',
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

        {/* Left side - Profile info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 1,
            flex: 1,
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: '28px',
              color: '#9a8a8e',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#d4af37', marginRight: '8px', fontSize: '32px' }}>L</span>
            ovely Girls Prague
          </div>

          {/* Girl name */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '20px',
              lineHeight: 1,
            }}
          >
            {girl.name}
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '32px',
              color: '#c9b8bd',
              marginTop: '30px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37' }}>
                {girl.age}
              </span>
              <span style={{ fontSize: '20px', color: '#9a8a8e' }}>years</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37' }}>
                {girl.height}
              </span>
              <span style={{ fontSize: '20px', color: '#9a8a8e' }}>cm</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37' }}>
                {girl.weight}
              </span>
              <span style={{ fontSize: '20px', color: '#9a8a8e' }}>kg</span>
            </div>
          </div>

          {/* Nationality */}
          {girl.nationality && (
            <div
              style={{
                fontSize: '24px',
                color: '#c9b8bd',
                marginTop: '30px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ marginRight: '10px' }}>🌍</span>
              {girl.nationality}
            </div>
          )}

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
              fontSize: '18px',
              color: '#c9b8bd',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '6px' }}>✓</span>
              Verified
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '6px' }}>🔒</span>
              Discreet
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '6px' }}>⭐</span>
              Professional
            </div>
          </div>
        </div>

        {/* Right side - Girl Photo */}
        <div
          style={{
            width: '400px',
            height: '500px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid rgba(212, 175, 55, 0.3)',
            zIndex: 1,
            overflow: 'hidden',
            background: photoUrl ? 'transparent' : 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(196, 30, 58, 0.2) 100%)',
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={girl.name}
              width="400"
              height="500"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <span style={{ fontSize: '40px', color: '#9a8a8e' }}>PHOTO</span>
          )}
        </div>

        {/* Bottom banner */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '60px',
            background: 'rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#d4af37',
            borderTop: '2px solid rgba(212, 175, 55, 0.3)',
          }}
        >
          lovelygirls.cz | Book via WhatsApp: +420 734 332 131
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
