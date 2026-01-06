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

  // Fetch girl's PRIMARY PHOTO
  let photoUrl: string | null = null
  let girlName = 'LovelyGirls Prague'

  try {
    const result = await db.execute({
      sql: `
        SELECT g.name,
               (SELECT url FROM girl_photos WHERE girl_id = g.id AND is_primary = 1 LIMIT 1) as photo_url
        FROM girls g
        WHERE g.slug = ? AND g.status = 'active'
      `,
      args: [slug]
    })

    if (result.rows[0]) {
      photoUrl = result.rows[0].photo_url as string | null
      girlName = result.rows[0].name as string
      console.log('[OG IMAGE] Girl:', girlName, 'Photo:', photoUrl ? 'YES' : 'NO')
    }
  } catch (error) {
    console.error('[OG IMAGE] Error fetching photo:', error)
  }

  // If no photo found, return placeholder
  if (!photoUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #1a0e1f 0%, #2d1b3d 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: '#d4af37',
          }}
        >
          LovelyGirls Prague
        </div>
      ),
      { ...size }
    )
  }

  // Return JUST THE PHOTO
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}
      >
        <img
          src={photoUrl}
          alt={girlName}
          width="1200"
          height="630"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
