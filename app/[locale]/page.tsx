import HomeClient from '@/components/HomeClient';
import { db } from '@/lib/db';

// ISR - Revalidate every 60 seconds for SEO
export const revalidate = 60;

// Server-side data fetching DIRECTLY from database (no API)
async function getHomepageData() {
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

    // Run ALL queries in PARALLEL
    const [
      girlsResult,
      locationsResult,
      storiesResult,
      activitiesResult,
      reviewsResult
    ] = await Promise.all([
      db.execute({
        sql: `
          SELECT
            g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust,
            g.online, g.status, g.color, g.location, g.is_new, g.badge_type,
            g.created_at
          FROM girls g
          WHERE g.status = 'active'
          ORDER BY g.is_new DESC, g.online DESC, g.rating DESC
          LIMIT 20
        `,
        args: []
      }),
      db.execute({
        sql: 'SELECT * FROM locations WHERE is_active = 1 ORDER BY is_primary DESC LIMIT 3',
        args: []
      }),
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
            scheduleStatus = 'finished';
          }
        }
      }

      // Check if girl is new (created within last 14 days)
      const createdAt = new Date(girl.created_at);
      const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const isActuallyNew = girl.is_new && daysSinceCreated <= 14;

      return {
        ...girl,
        online: Boolean(girl.online),
        is_new: isActuallyNew,
        primary_photo: photo?.url || null,
        thumbnail: photo?.thumbnail_url || null,
        schedule_status: scheduleStatus,
        schedule_from: scheduleFrom,
        schedule_to: scheduleTo
      };
    });

    // New girls section
    const newGirls = girlsWithData.filter((g: any) => g.is_new);

    // Filter out girls whose shift has ended
    let activeGirls = girlsWithData.filter((g: any) => g.schedule_status !== 'finished');

    // Sort by priority: working girls first
    activeGirls.sort((a: any, b: any) => {
      const aHasSchedule = a.schedule_status === 'working' || a.schedule_status === 'later';
      const bHasSchedule = b.schedule_status === 'working' || b.schedule_status === 'later';

      if (aHasSchedule && !bHasSchedule) return -1;
      if (!aHasSchedule && bHasSchedule) return 1;

      if (aHasSchedule && bHasSchedule) {
        const aStartTime = a.schedule_from || '';
        const bStartTime = b.schedule_from || '';

        const aMorning = aStartTime < '16:00';
        const bMorning = bStartTime < '16:00';

        if (aMorning && !bMorning) return -1;
        if (!aMorning && bMorning) return 1;

        return aStartTime.localeCompare(bStartTime);
      }

      return 0;
    });

    const featuredGirl = activeGirls.find((g: any) => g.is_new) || newGirls[0] || null;

    return {
      girls: activeGirls.slice(0, 4),
      featuredGirl,
      newGirls,
      locations: locationsResult.rows as any[],
      stories: Object.values(storiesByGirl),
      activities: activitiesResult.rows as any[],
      reviews: reviewsResult.rows as any[]
    };
  } catch (error: any) {
    console.error('Homepage data fetch error:', error);
    return {
      girls: [],
      featuredGirl: null,
      newGirls: [],
      locations: [],
      stories: [],
      activities: [],
      reviews: [],
    };
  }
}

export default async function HomePage() {
  const initialData = await getHomepageData();
  return <HomeClient initialData={initialData} />;
}
