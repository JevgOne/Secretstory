import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Revalidate every 60 seconds
export const revalidate = 60;

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
          hashtags,
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

    // Fetch girl's schedule for remaining days of the week
    const scheduleResult = await db.execute({
      sql: `
        SELECT day_of_week, start_time, end_time
        FROM girl_schedules
        WHERE girl_id = ? AND is_active = 1
        ORDER BY day_of_week
      `,
      args: [girl.id]
    });

    // Get current day of week (0 = Monday, ... 6 = Sunday)
    const now = new Date();
    const jsDay = now.getDay();
    const currentDayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    // Filter to only show future days (including today)
    const weekSchedule = scheduleResult.rows
      .filter((s: any) => s.day_of_week >= currentDayOfWeek)
      .map((s: any) => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time.substring(0, 5),
        end_time: s.end_time.substring(0, 5)
      }));

    // Fetch girl's photos
    const photosResult = await db.execute({
      sql: `
        SELECT id, url, thumbnail_url, is_primary, display_order
        FROM girl_photos
        WHERE girl_id = ?
        ORDER BY display_order ASC, created_at ASC
      `,
      args: [girl.id]
    });

    // Fetch girl's videos
    const videosResult = await db.execute({
      sql: `
        SELECT id, url, thumbnail_url, display_order, duration
        FROM girl_videos
        WHERE girl_id = ?
        ORDER BY display_order ASC, created_at ASC
      `,
      args: [girl.id]
    });

    // Fetch girl's services from girl_services table
    const servicesResult = await db.execute({
      sql: `
        SELECT s.slug
        FROM services s
        INNER JOIN girl_services gs ON s.id = gs.service_id
        WHERE gs.girl_id = ? AND s.is_active = 1
        ORDER BY s.display_order, s.id
      `,
      args: [girl.id]
    });

    const servicesSlugs = servicesResult.rows.map((row: any) => row.slug);

    return NextResponse.json(
      {
        success: true,
        girl: {
          ...girl,
          services: servicesSlugs.length > 0 ? servicesSlugs : (girl.services ? JSON.parse(girl.services as string) : []),
          hashtags: girl.hashtags ? JSON.parse(girl.hashtags as string) : [],
          verified: Boolean(girl.verified),
          online: Boolean(girl.online),
          piercing: Boolean(girl.piercing),
          schedule: weekSchedule,
          photos: photosResult.rows,
          videos: videosResult.rows
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    );
  } catch (error) {
    console.error('Get girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání profilu' },
      { status: 500 }
    );
  }
}
