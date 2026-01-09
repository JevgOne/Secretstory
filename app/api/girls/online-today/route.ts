import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Force dynamic rendering (uses searchParams)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/girls/online-today - Get girls working today, sorted by schedule
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const excludeId = searchParams.get('exclude'); // ID of current girl to exclude
    const limit = parseInt(searchParams.get('limit') || '4');

    // Get current time in Prague timezone
    const now = new Date();
    const currentTime = now.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Prague'
    });

    // Get current day of week (0 = Monday, ... 6 = Sunday)
    const jsDay = now.getDay();
    const currentDayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    // Fetch girls with their schedule for today
    const result = await db.execute({
      sql: `
        SELECT DISTINCT
          g.id,
          g.name,
          g.slug,
          g.age,
          g.height,
          g.weight,
          g.bust,
          g.verified,
          g.rating,
          g.reviews_count,
          gs.start_time,
          gs.end_time,
          (SELECT url FROM girl_photos WHERE girl_id = g.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) as primary_photo
        FROM girls g
        INNER JOIN girl_schedules gs ON g.id = gs.girl_id
        WHERE g.status = 'active'
          AND gs.is_active = 1
          AND gs.day_of_week = ?
          ${excludeId ? 'AND g.id != ?' : ''}
        ORDER BY
          CASE
            -- Currently working (within their shift)
            WHEN ? >= gs.start_time AND ? <= gs.end_time THEN 1
            -- Starting later today
            WHEN ? < gs.start_time THEN 2
            -- Already finished for today
            ELSE 3
          END,
          gs.start_time ASC
        LIMIT ?
      `,
      args: excludeId
        ? [currentDayOfWeek, excludeId, currentTime, currentTime, currentTime, limit]
        : [currentDayOfWeek, currentTime, currentTime, currentTime, limit]
    });

    const girls = result.rows.map((girl: any) => ({
      id: girl.id,
      name: girl.name,
      slug: girl.slug,
      age: girl.age,
      height: girl.height,
      weight: girl.weight,
      bust: girl.bust,
      verified: Boolean(girl.verified),
      rating: girl.rating,
      reviews_count: girl.reviews_count,
      primary_photo: girl.primary_photo,
      schedule_from: girl.start_time?.substring(0, 5),
      schedule_to: girl.end_time?.substring(0, 5),
      is_working_now: currentTime >= girl.start_time && currentTime <= girl.end_time
    }));

    return NextResponse.json(
      { success: true, girls },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    );
  } catch (error) {
    console.error('Get online girls error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání online dívek' },
      { status: 500 }
    );
  }
}
