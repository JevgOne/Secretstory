import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Edge runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
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

    // 1. Get ONLY first 4-5 girls (not all!)
    const girlsResult = await db.execute({
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
    });

    const girls = girlsResult.rows;
    const girlIds = girls.map((g: any) => g.id);

    // 2. Get photos for these girls ONLY
    let photoMap = new Map();
    if (girlIds.length > 0) {
      const placeholders = girlIds.map(() => '?').join(',');
      const photosResult = await db.execute({
        sql: `SELECT girl_id, url, thumbnail_url FROM girl_photos
              WHERE girl_id IN (${placeholders}) AND is_primary = 1`,
        args: girlIds
      });
      photosResult.rows.forEach((row: any) => {
        photoMap.set(row.girl_id, {
          url: row.url,
          thumbnail_url: row.thumbnail_url
        });
      });
    }

    // 3. Get schedules for these girls ONLY
    let scheduleMap = new Map();
    if (girlIds.length > 0) {
      const placeholders = girlIds.map(() => '?').join(',');
      const schedulesResult = await db.execute({
        sql: `SELECT girl_id, start_time, end_time FROM girl_schedules
              WHERE girl_id IN (${placeholders}) AND day_of_week = ? AND is_active = 1`,
        args: [...girlIds, dayOfWeek]
      });
      schedulesResult.rows.forEach((row: any) => {
        scheduleMap.set(row.girl_id, {
          start_time: row.start_time,
          end_time: row.end_time
        });
      });
    }

    // 4. Get locations
    const locationsResult = await db.execute({
      sql: 'SELECT * FROM locations WHERE is_active = 1 ORDER BY is_primary DESC',
      args: []
    });

    // 5. Get stories (for Stories component)
    const storiesResult = await db.execute({
      sql: `
        SELECT s.*, g.name as girl_name, g.slug as girl_slug
        FROM stories s
        JOIN girls g ON s.girl_id = g.id
        WHERE s.is_active = 1
        AND (s.expires_at IS NULL OR s.expires_at > datetime('now'))
        ORDER BY s.created_at DESC
        LIMIT 20
      `,
      args: []
    });

    // Group stories by girl
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

    // 6. Get recent activities (for Activity Timeline)
    const activitiesResult = await db.execute({
      sql: `
        SELECT a.*, g.name as girl_name, g.slug as girl_slug
        FROM activity_log a
        JOIN girls g ON a.girl_id = g.id
        WHERE a.is_visible = 1
        ORDER BY a.created_at DESC
        LIMIT 50
      `,
      args: []
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
          } else {
            scheduleStatus = 'later';
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

    // Featured girl (first NEW girl)
    const featuredGirl = girlsWithData.find((g: any) => g.is_new) || null;

    // Return everything in ONE response
    return NextResponse.json(
      {
        success: true,
        girls: girlsWithData.slice(0, 4), // Only 4 for grid
        featuredGirl,
        locations: locationsResult.rows,
        stories: Object.values(storiesByGirl),
        activities: activitiesResult.rows
      },
      {
        headers: {
          // Aggressive caching for performance
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'CDN-Cache-Control': 'public, s-maxage=60',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
        }
      }
    );

  } catch (error: any) {
    console.error('Homepage API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
