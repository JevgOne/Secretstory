import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';

// Revalidate every 5 minutes (ISR)
export const revalidate = 300;

// GET /api/girls - Get all girls (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Create cache key from query params
    const cacheKey = `girls-${searchParams.toString() || 'all'}`;
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
    const status = searchParams.get('status') || 'active';
    const online = searchParams.get('online');
    const lang = searchParams.get('lang') || 'cs';
    const service = searchParams.get('service'); // Filter by service ID
    const hashtag = searchParams.get('hashtag'); // Filter by hashtag ID

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
        g.hashtags,
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

    if (hashtag) {
      sql += ' AND g.hashtags LIKE ?';
      args.push(`%"${hashtag}"%`);
    }

    sql += ' ORDER BY g.online DESC, g.rating DESC, g.created_at DESC';

    const result = await db.execute({ sql, args });

    // Get current time and day for schedule status
    const now = new Date();
    const pragueTz = 'Europe/Prague';
    const currentTime = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: pragueTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);

    // Get day of week (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
    const jsDay = now.getDay();
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    // Get all girl IDs
    const girlIds = result.rows.map((row: any) => row.id);

    // Fetch ALL photos in one query (much faster!)
    let photoMap = new Map<number, { url: string; thumbnail_url: string }>();
    let secondaryPhotoMap = new Map<number, { url: string; thumbnail_url: string }>();

    if (girlIds.length > 0) {
      const placeholders = girlIds.map(() => '?').join(',');

      // Get primary photos
      const photosResult = await db.execute({
        sql: `
          SELECT girl_id, url, thumbnail_url
          FROM girl_photos
          WHERE girl_id IN (${placeholders}) AND is_primary = 1
        `,
        args: girlIds
      });

      photosResult.rows.forEach((row: any) => {
        photoMap.set(row.girl_id as number, {
          url: row.url as string,
          thumbnail_url: row.thumbnail_url as string
        });
      });

      // Get secondary photos (first non-primary photo for flip effect)
      const secondaryPhotosResult = await db.execute({
        sql: `
          SELECT girl_id, url, thumbnail_url
          FROM girl_photos
          WHERE girl_id IN (${placeholders}) AND is_primary = 0
          ORDER BY display_order ASC
        `,
        args: girlIds
      });

      // Take only the first secondary photo for each girl
      const processedGirls = new Set<number>();
      secondaryPhotosResult.rows.forEach((row: any) => {
        const girlId = row.girl_id as number;
        if (!processedGirls.has(girlId)) {
          secondaryPhotoMap.set(girlId, {
            url: row.url as string,
            thumbnail_url: row.thumbnail_url as string
          });
          processedGirls.add(girlId);
        }
      });
    }

    // Fetch ALL schedules in one query (much faster!)
    let scheduleMap = new Map<number, { start_time: string; end_time: string }>();
    if (girlIds.length > 0) {
      const placeholders = girlIds.map(() => '?').join(',');
      const schedulesResult = await db.execute({
        sql: `
          SELECT girl_id, start_time, end_time
          FROM girl_schedules
          WHERE girl_id IN (${placeholders}) AND day_of_week = ? AND is_active = 1
        `,
        args: [...girlIds, dayOfWeek]
      });

      schedulesResult.rows.forEach((row: any) => {
        scheduleMap.set(row.girl_id as number, {
          start_time: row.start_time as string,
          end_time: row.end_time as string
        });
      });
    }

    // Map girls with their photos and schedules
    let girlsWithPhotos = result.rows.map((row: any) => {
      const primaryPhoto = photoMap.get(row.id as number);
      const secondaryPhoto = secondaryPhotoMap.get(row.id as number);
      const schedule = scheduleMap.get(row.id as number);

      const services = row.services ? JSON.parse(row.services as string) : [];
      const hashtags = row.hashtags ? JSON.parse(row.hashtags as string) : [];

      // Determine schedule status
      let scheduleStatus = null;
      let scheduleFrom = null;
      let scheduleTo = null;

      if (schedule) {
        scheduleFrom = schedule.start_time ? schedule.start_time.substring(0, 5) : null;
        scheduleTo = schedule.end_time ? schedule.end_time.substring(0, 5) : null;

        if (scheduleFrom && scheduleTo) {
          if (currentTime >= scheduleFrom && currentTime <= scheduleTo) {
            scheduleStatus = 'working';
          } else if (currentTime < scheduleFrom) {
            scheduleStatus = 'later';
          } else {
            // currentTime > scheduleTo - shift has ended
            scheduleStatus = 'finished';
          }
        }
      }

      return {
        ...row,
        services,
        hashtags,
        verified: Boolean(row.verified),
        online: Boolean(row.online),
        piercing: Boolean(row.piercing),
        is_new: Boolean(row.is_new),
        is_top: Boolean(row.is_top),
        is_featured: Boolean(row.is_featured),
        primary_photo: primaryPhoto?.url || null,
        secondary_photo: secondaryPhoto?.url || null,
        thumbnail: primaryPhoto?.thumbnail_url || null,
        schedule_status: scheduleStatus,
        schedule_from: scheduleFrom,
        schedule_to: scheduleTo
      };
    });

    // Filter by service if specified (client-side filtering since services is JSON)
    if (service) {
      girlsWithPhotos = girlsWithPhotos.filter(girl =>
        girl.services && girl.services.includes(service)
      );
    }

    // Filter out girls whose shift has ended (keep only non-finished)
    girlsWithPhotos = girlsWithPhotos.filter(girl => girl.schedule_status === null || girl.schedule_status === 'working' || girl.schedule_status === 'later');

    // Sort girls by priority (same logic as homepage):
    // 1. Girls working today (schedule_status = 'working' or 'later')
    // 2. Within working girls, prioritize by time slots:
    //    - Morning shift (10:00-16:00) comes first
    //    - Evening shift (16:30-22:30) comes second
    // 3. Girls without schedule come last
    girlsWithPhotos.sort((a: any, b: any) => {
      // Priority 1: Has schedule today vs no schedule
      const aHasSchedule = a.schedule_status === 'working' || a.schedule_status === 'later';
      const bHasSchedule = b.schedule_status === 'working' || b.schedule_status === 'later';

      if (aHasSchedule && !bHasSchedule) return -1;
      if (!aHasSchedule && bHasSchedule) return 1;

      // Priority 2: If both have schedule, sort by time slot
      if (aHasSchedule && bHasSchedule) {
        const aStartTime = a.schedule_from || '';
        const bStartTime = b.schedule_from || '';

        // Morning shift (before 16:00) comes before evening shift (after 16:00)
        const aMorning = aStartTime < '16:00';
        const bMorning = bStartTime < '16:00';

        if (aMorning && !bMorning) return -1;
        if (!aMorning && bMorning) return 1;

        // Within same time slot, sort by start time (earlier first)
        return aStartTime.localeCompare(bStartTime);
      }

      // Both without schedule - keep original order (online, rating)
      return 0;
    });

    const responseData = {
      success: true,
      girls: girlsWithPhotos
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
    console.error('Get girls error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání dívek' },
      { status: 500 }
    );
  }
}
