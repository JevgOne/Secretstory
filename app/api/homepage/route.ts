import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';

// Edge runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    // Check in-memory cache first (5min TTL)
    const cached = cache.get('homepage-data', 300000);
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
    const now = new Date();
    const pragueTz = 'Europe/Prague';
    const currentTime = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: pragueTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);

    const jsDay = now.getDay();
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    // Run ALL queries in PARALLEL for maximum speed
    const [
      girlsResult,
      locationsResult,
      storiesResult,
      activitiesResult,
      reviewsResult
    ] = await Promise.all([
      // 1. Girls
      db.execute({
        sql: `
          SELECT
            g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust,
            g.online, g.status, g.color, g.location, g.is_new, g.badge_type
          FROM girls g
          WHERE g.status = 'active'
          ORDER BY g.is_new DESC, g.online DESC, g.rating DESC
          LIMIT 5
        `,
        args: []
      }),
      // 2. Locations
      db.execute({
        sql: 'SELECT * FROM locations WHERE is_active = 1 ORDER BY is_primary DESC LIMIT 3',
        args: []
      }),
      // 3. Stories
      db.execute({
        sql: `
          SELECT s.id, s.girl_id, s.media_url, s.media_type, s.thumbnail_url,
                 s.duration, s.views_count, s.created_at,
                 g.name as girl_name, g.slug as girl_slug
          FROM stories s
          JOIN girls g ON s.girl_id = g.id
          WHERE s.is_active = 1
          AND (s.expires_at IS NULL OR s.expires_at > datetime('now'))
          ORDER BY s.created_at DESC
          LIMIT 5
        `,
        args: []
      }),
      // 4. Activities
      db.execute({
        sql: `
          SELECT a.id, a.girl_id, a.activity_type, a.title, a.description,
                 a.created_at, g.name as girl_name, g.slug as girl_slug
          FROM activity_log a
          JOIN girls g ON a.girl_id = g.id
          WHERE a.is_visible = 1
          ORDER BY a.created_at DESC
          LIMIT 5
        `,
        args: []
      }),
      // 5. Reviews
      db.execute({
        sql: `
          SELECT r.id, r.girl_id, r.author_name, r.rating, r.title, r.content, r.created_at,
                 g.name as girl_name, g.slug as girl_slug
          FROM reviews r
          JOIN girls g ON r.girl_id = g.id
          WHERE r.status = 'approved'
          ORDER BY r.created_at DESC
          LIMIT 3
        `,
        args: []
      })
    ]);

    const girls = girlsResult.rows;
    const girlIds = girls.map((g: any) => g.id);

    // Get photos and schedules in PARALLEL
    const [photosResult, schedulesResult] = await Promise.all([
      girlIds.length > 0 ? db.execute({
        sql: `SELECT girl_id, url, thumbnail_url FROM girl_photos
              WHERE girl_id IN (${girlIds.map(() => '?').join(',')}) AND is_primary = 1`,
        args: girlIds
      }) : Promise.resolve({ rows: [] }),
      girlIds.length > 0 ? db.execute({
        sql: `SELECT girl_id, start_time, end_time FROM girl_schedules
              WHERE girl_id IN (${girlIds.map(() => '?').join(',')}) AND day_of_week = ? AND is_active = 1`,
        args: [...girlIds, dayOfWeek]
      }) : Promise.resolve({ rows: [] })
    ]);

    // Map photos and schedules
    const photoMap = new Map();
    photosResult.rows.forEach((row: any) => {
      photoMap.set(row.girl_id, {
        url: row.url,
        thumbnail_url: row.thumbnail_url
      });
    });

    const scheduleMap = new Map();
    schedulesResult.rows.forEach((row: any) => {
      scheduleMap.set(row.girl_id, {
        start_time: row.start_time,
        end_time: row.end_time
      });
    });

    // Group stories by girl (simplified)
    const storiesByGirl: Record<number, any> = {};
    storiesResult.rows.forEach((row: any) => {
      if (!storiesByGirl[row.girl_id]) {
        storiesByGirl[row.girl_id] = {
          girl_id: row.girl_id,
          girl_name: row.girl_name,
          girl_slug: row.girl_slug,
          stories: []
        };
      }
      storiesByGirl[row.girl_id].stories.push({
        id: row.id,
        media_url: row.media_url,
        media_type: row.media_type,
        thumbnail_url: row.thumbnail_url,
        duration: row.duration,
        views_count: row.views_count,
        created_at: row.created_at
      });
    });

    // Map girls with photos and schedules
    const girlsWithData = girls.map((girl: any) => {
      const photo = photoMap.get(girl.id);
      const schedule = scheduleMap.get(girl.id);

      let scheduleStatus = null;
      let scheduleFrom = null;
      let scheduleTo = null;

      if (schedule) {
        scheduleFrom = schedule.start_time?.substring(0, 5);
        scheduleTo = schedule.end_time?.substring(0, 5);

        if (scheduleFrom && scheduleTo) {
          if (currentTime >= scheduleFrom && currentTime <= scheduleTo) {
            scheduleStatus = 'working';
          } else if (currentTime < scheduleFrom) {
            scheduleStatus = 'later';
          } else {
            // currentTime > scheduleTo - shift has ended, don't show this girl
            scheduleStatus = 'finished';
          }
        }
      }

      return {
        ...girl,
        online: Boolean(girl.online),
        is_new: Boolean(girl.is_new),
        primary_photo: photo?.url || null,
        thumbnail: photo?.thumbnail_url || null,
        schedule_status: scheduleStatus,
        schedule_from: scheduleFrom,
        schedule_to: scheduleTo
      };
    });

    // Filter out girls whose shift has ended
    const activeGirls = girlsWithData.filter((g: any) => g.schedule_status !== 'finished');

    // Featured girl (first NEW girl from active girls)
    const featuredGirl = activeGirls.find((g: any) => g.is_new) || null;

    // Prepare response data
    const responseData = {
      success: true,
      girls: activeGirls.slice(0, 4), // Only 4 for grid, excluding finished shifts
      featuredGirl,
      locations: locationsResult.rows,
      stories: Object.values(storiesByGirl),
      activities: activitiesResult.rows,
      reviews: reviewsResult.rows
    };

    // Store in cache for 5 minutes
    cache.set('homepage-data', responseData);

    // Return everything in ONE response
    return NextResponse.json(responseData, {
      headers: {
        // Aggressive caching for performance
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, max-age=120',
        'CDN-Cache-Control': 'public, s-maxage=600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=600',
        'X-Cache': 'MISS',
        'X-Content-Type-Options': 'nosniff'
      }
    });

  } catch (error: any) {
    console.error('Homepage API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
