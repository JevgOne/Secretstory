import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/girls - Get all girls (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'active';
    const online = searchParams.get('online');
    const lang = searchParams.get('lang') || 'cs';

    let sql = `
      SELECT
        g.id,
        g.name,
        g.slug,
        g.email,
        g.phone,
        g.age,
        g.nationality,
        g.height,
        g.weight,
        g.bust,
        g.hair,
        g.eyes,
        g.color,
        g.status,
        g.verified,
        g.online,
        g.rating,
        g.reviews_count,
        g.bookings_count,
        g.bio,
        g.tattoo_percentage,
        g.tattoo_description,
        g.piercing,
        g.piercing_description,
        g.languages,
        g.is_new,
        g.is_top,
        g.is_featured,
        g.badge_type,
        g.featured_section,
        g.location,
        g.services,
        g.created_at,
        g.updated_at
      FROM girls g
      WHERE 1=1
    `;
    const args: any[] = [];

    if (status) {
      sql += ' AND g.status = ?';
      args.push(status);
    }

    if (online !== null && online !== undefined) {
      sql += ' AND g.online = ?';
      args.push(online === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY g.online DESC, g.rating DESC, g.created_at DESC';

    const result = await db.execute({ sql, args });

    // For each girl, fetch their primary photo
    const girlsWithPhotos = await Promise.all(
      result.rows.map(async (row) => {
        const photoResult = await db.execute({
          sql: `
            SELECT url, thumbnail_url
            FROM girl_photos
            WHERE girl_id = ? AND is_primary = 1
            LIMIT 1
          `,
          args: [row.id]
        });

        const primaryPhoto = photoResult.rows[0];
        const services = row.services ? JSON.parse(row.services as string) : [];

        return {
          ...row,
          services,
          verified: Boolean(row.verified),
          online: Boolean(row.online),
          piercing: Boolean(row.piercing),
          is_new: Boolean(row.is_new),
          is_top: Boolean(row.is_top),
          is_featured: Boolean(row.is_featured),
          primary_photo: primaryPhoto?.url || null,
          thumbnail: primaryPhoto?.thumbnail_url || null
        };
      })
    );

    return NextResponse.json({
      success: true,
      girls: girlsWithPhotos
    });
  } catch (error) {
    console.error('Get girls error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání dívek' },
      { status: 500 }
    );
  }
}
