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

    // Fetch services for all girls
    const girlsWithServices = await Promise.all(
      result.rows.map(async (row) => {
        const servicesResult = await db.execute({
          sql: `
            SELECT s.id, s.name_cs, s.name_en, s.name_de, s.name_uk, s.category, s.duration
            FROM services s
            INNER JOIN girl_services gs ON s.id = gs.service_id
            WHERE gs.girl_id = ? AND s.is_active = 1
            ORDER BY s.display_order, s.id
          `,
          args: [row.id]
        });

        // Get translated service names
        const services = servicesResult.rows.map(service => ({
          id: service.id,
          name: service[`name_${lang}` as keyof typeof service] || service.name_cs,
          category: service.category,
          duration: service.duration
        }));

        return {
          ...row,
          services,
          verified: Boolean(row.verified),
          online: Boolean(row.online),
          piercing: Boolean(row.piercing)
        };
      })
    );

    return NextResponse.json({
      success: true,
      girls: girlsWithServices
    });
  } catch (error) {
    console.error('Get girls error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání dívek' },
      { status: 500 }
    );
  }
}
