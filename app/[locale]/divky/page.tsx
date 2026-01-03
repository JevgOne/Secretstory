import DivkyClient from './DivkyClient';
import { db } from '@/lib/db';

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  height: number;
  weight: number;
  bust: string;
  online: boolean;
  status: string;
  color: string;
  languages?: string;
  is_new?: boolean;
  is_top?: boolean;
  is_featured?: boolean;
  badge_type?: string;
  created_at?: string;
  featured_section?: string;
  primary_photo?: string | null;
  thumbnail?: string | null;
  secondary_photo?: string | null;
  schedule_status?: 'working' | 'later' | null;
  schedule_from?: string | null;
  schedule_to?: string | null;
}

// Server-side data fetching - directly from database (not API)
async function getGirlsData() {
  try {
    // Fetch girls directly from database
    const result = await db.execute({
      sql: `
        SELECT
          g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust,
          g.hair, g.eyes, g.color, g.status, g.verified, g.online,
          g.rating, g.reviews_count, g.bookings_count, g.bio,
          g.tattoo_percentage, g.tattoo_description, g.piercing, g.piercing_description,
          g.languages, g.is_new, g.is_top, g.is_featured, g.badge_type,
          g.featured_section, g.location, g.services, g.hashtags,
          g.created_at, g.updated_at
        FROM girls g
        WHERE g.status = 'active'
        ORDER BY g.online DESC, g.rating DESC, g.created_at DESC
      `,
      args: []
    });

    // Get current time and day for schedule status
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

    // Get all girl IDs
    const girlIds = result.rows.map((row: any) => row.id);

    // Fetch photos
    let photoMap = new Map<number, { url: string; thumbnail_url: string }>();
    if (girlIds.length > 0) {
      const placeholders = girlIds.map(() => '?').join(',');
      const photosResult = await db.execute({
        sql: `SELECT girl_id, url, thumbnail_url FROM girl_photos WHERE girl_id IN (${placeholders}) AND is_primary = 1`,
        args: girlIds
      });

      photosResult.rows.forEach((row: any) => {
        photoMap.set(row.girl_id as number, {
          url: row.url as string,
          thumbnail_url: row.thumbnail_url as string
        });
      });
    }

    // Fetch schedules
    let scheduleMap = new Map<number, { start_time: string; end_time: string }>();
    if (girlIds.length > 0) {
      const placeholders = girlIds.map(() => '?').join(',');
      const schedulesResult = await db.execute({
        sql: `SELECT girl_id, start_time, end_time FROM girl_schedules WHERE girl_id IN (${placeholders}) AND day_of_week = ? AND is_active = 1`,
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
    const girls = result.rows.map((row: any) => {
      const primaryPhoto = photoMap.get(row.id as number);
      const schedule = scheduleMap.get(row.id as number);

      const services = row.services ? JSON.parse(row.services as string) : [];
      const hashtags = row.hashtags ? JSON.parse(row.hashtags as string) : [];

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
            scheduleStatus = 'finished';
          }
        }
      }

      // Check if actually new (within 14 days)
      const createdAt = new Date(row.created_at);
      const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const isActuallyNew = row.is_new && daysSinceCreated <= 14;

      return {
        ...row,
        services,
        hashtags,
        verified: Boolean(row.verified),
        online: Boolean(row.online),
        piercing: Boolean(row.piercing),
        is_new: isActuallyNew,
        is_top: Boolean(row.is_top),
        is_featured: Boolean(row.is_featured),
        primary_photo: primaryPhoto?.url || null,
        thumbnail: primaryPhoto?.thumbnail_url || null,
        schedule_status: scheduleStatus,
        schedule_from: scheduleFrom,
        schedule_to: scheduleTo
      };
    });

    // Sort by schedule (same logic as girls API)
    girls.sort((a: any, b: any) => {
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

    return girls;
  } catch (error) {
    console.error('Error fetching girls data:', error);
    return [];
  }
}

export default async function DivkyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch ALL active girls from database
  const girls = await getGirlsData();

  console.log('[DIVKY SERVER] Fetched girls count:', girls.length);

  // Pass ALL girls to client (sorted by schedule - working today first)
  // NO FILTERING - need all girls in HTML for SEO
  return <DivkyClient initialGirls={girls} locale={locale} />;
}
