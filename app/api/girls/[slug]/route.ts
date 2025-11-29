import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/girls/[slug] - Get girl by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await db.execute({
      sql: `
        SELECT
          id,
          name,
          slug,
          email,
          phone,
          age,
          nationality,
          height,
          weight,
          bust,
          hair,
          eyes,
          color,
          status,
          verified,
          online,
          rating,
          reviews_count,
          bookings_count,
          services,
          bio,
          tattoo_percentage,
          tattoo_description,
          piercing,
          piercing_description,
          languages,
          created_at,
          updated_at
        FROM girls
        WHERE slug = ? AND status = 'active'
      `,
      args: [slug]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dívka nenalezena' },
        { status: 404 }
      );
    }

    const girl = result.rows[0];

    return NextResponse.json({
      success: true,
      girl: {
        ...girl,
        services: girl.services ? JSON.parse(girl.services as string) : [],
        verified: Boolean(girl.verified),
        online: Boolean(girl.online),
        piercing: Boolean(girl.piercing)
      }
    });
  } catch (error) {
    console.error('Get girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání profilu' },
      { status: 500 }
    );
  }
}
