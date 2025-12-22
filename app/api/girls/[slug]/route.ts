import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';

// Revalidate every 5 minutes
export const revalidate = 300;

// GET /api/girls/[slug] - Get girl by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check cache first
    const cacheKey = `girl-profile-${slug}`;
    const cached = cache.get(cacheKey, 300000); // 5min cache
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, max-age=120',
          'CDN-Cache-Control': 'public, s-maxage=600',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=600',
          'X-Cache': 'HIT',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }

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
          bio_cs,
          bio_de,
          bio_uk,
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

    // Run ALL queries in PARALLEL for maximum speed
    const [scheduleResult, photosResult, videosResult, servicesResult] = await Promise.all([
      // Schedule
      db.execute({
        sql: `
          SELECT day_of_week, start_time, end_time
          FROM girl_schedules
          WHERE girl_id = ? AND is_active = 1
          ORDER BY day_of_week
        `,
        args: [girl.id]
      }),
      // Photos
      db.execute({
        sql: `
          SELECT id, url, thumbnail_url, is_primary, display_order
          FROM girl_photos
          WHERE girl_id = ?
          ORDER BY display_order ASC, created_at ASC
        `,
        args: [girl.id]
      }),
      // Videos
      db.execute({
        sql: `
          SELECT id, url, thumbnail_url, display_order, duration
          FROM girl_videos
          WHERE girl_id = ?
          ORDER BY display_order ASC, created_at ASC
        `,
        args: [girl.id]
      }),
      // Services
      db.execute({
        sql: `
          SELECT s.slug
          FROM services s
          INNER JOIN girl_services gs ON s.id = gs.service_id
          WHERE gs.girl_id = ?
          ORDER BY s.id
        `,
        args: [girl.id]
      })
    ]);

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

    const servicesSlugs = servicesResult.rows.map((row: any) => row.slug);

    const responseData = {
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
    };

    // Cache the response
    cache.set(cacheKey, responseData);

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, max-age=120',
        'CDN-Cache-Control': 'public, s-maxage=600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=600',
        'X-Cache': 'MISS',
        'X-Content-Type-Options': 'nosniff'
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
