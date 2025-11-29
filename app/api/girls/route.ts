import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/girls - Get all girls (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'active';
    const online = searchParams.get('online');

    let sql = `
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
        created_at,
        updated_at
      FROM girls
      WHERE 1=1
    `;
    const args: any[] = [];

    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }

    if (online !== null && online !== undefined) {
      sql += ' AND online = ?';
      args.push(online === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY online DESC, rating DESC, created_at DESC';

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      girls: result.rows.map(row => ({
        ...row,
        services: row.services ? JSON.parse(row.services as string) : [],
        verified: Boolean(row.verified),
        online: Boolean(row.online)
      }))
    });
  } catch (error) {
    console.error('Get girls error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání dívek' },
      { status: 500 }
    );
  }
}
