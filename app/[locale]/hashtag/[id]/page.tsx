import { db } from '@/lib/db';
import { getHashtagById, getHashtagName } from '@/lib/hashtags';
import { notFound } from 'next/navigation';
import HashtagClient from './HashtagClient';

// ISR - Revalidate every 15 minutes (900 seconds)
export const revalidate = 900;

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  height: number;
  weight: number;
  bust: string;
  online: boolean;
  badge_type?: 'new' | 'top' | 'asian' | 'recommended' | null;
  primary_photo?: string | null;
  secondary_photo?: string | null;
  thumbnail?: string | null;
  location?: string;
  schedule_status?: 'working' | 'later' | null;
  schedule_from?: string | null;
  schedule_to?: string | null;
}

/**
 * Fetch girls matching a hashtag directly from the database (server-side)
 */
async function getGirlsByHashtag(hashtagId: string): Promise<Girl[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT
          g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust,
          g.online, g.status, g.color, g.location, g.is_new,
          g.badge_type, g.hashtags, g.created_at
        FROM girls g
        WHERE g.status = 'active'
          AND g.hashtags LIKE ?
        ORDER BY g.online DESC, g.rating DESC, g.created_at DESC
      `,
      args: [`%"${hashtagId}"%`]
    });

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

    const girlIds = result.rows.map((row: any) => row.id);

    // Fetch photos and schedules in parallel
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

    const photoMap = new Map<number, { url: string; thumbnail_url: string }>();
    photosResult.rows.forEach((row: any) => {
      photoMap.set(row.girl_id, { url: row.url, thumbnail_url: row.thumbnail_url });
    });

    const scheduleMap = new Map<number, { start_time: string; end_time: string }>();
    schedulesResult.rows.forEach((row: any) => {
      scheduleMap.set(row.girl_id, { start_time: row.start_time, end_time: row.end_time });
    });

    const girls = result.rows.map((row: any) => {
      const photo = photoMap.get(row.id);
      const schedule = scheduleMap.get(row.id);

      let scheduleStatus: 'working' | 'later' | null = null;
      let scheduleFrom: string | null = null;
      let scheduleTo: string | null = null;

      if (schedule) {
        scheduleFrom = schedule.start_time?.substring(0, 5) || null;
        scheduleTo = schedule.end_time?.substring(0, 5) || null;
        if (scheduleFrom && scheduleTo) {
          if (currentTime >= scheduleFrom && currentTime <= scheduleTo) {
            scheduleStatus = 'working';
          } else if (currentTime < scheduleFrom) {
            scheduleStatus = 'later';
          } else {
            scheduleStatus = null; // finished - treat as no schedule
          }
        }
      }

      const createdAt = new Date(row.created_at);
      const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const isActuallyNew = row.is_new && daysSinceCreated <= 14;

      return {
        id: row.id as number,
        name: row.name as string,
        slug: row.slug as string,
        age: row.age as number,
        height: row.height as number,
        weight: row.weight as number,
        bust: row.bust as string,
        online: Boolean(row.online),
        badge_type: (isActuallyNew ? 'new' : (row.badge_type || null)) as Girl['badge_type'],
        primary_photo: photo?.url || null,
        thumbnail: photo?.thumbnail_url || null,
        location: (row.location as string) || undefined,
        schedule_status: scheduleStatus,
        schedule_from: scheduleFrom,
        schedule_to: scheduleTo
      };
    });

    // Sort: working/later first
    girls.sort((a, b) => {
      const aHas = a.schedule_status === 'working' || a.schedule_status === 'later';
      const bHas = b.schedule_status === 'working' || b.schedule_status === 'later';
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });

    return girls;
  } catch (error) {
    console.error('Error fetching girls by hashtag:', error);
    return [];
  }
}

/**
 * Fetch SEO content for this hashtag page from database
 */
async function getSeoContent(pagePath: string) {
  try {
    const result = await db.execute({
      sql: 'SELECT h1_title, h2_subtitle, page_content FROM seo_metadata WHERE page_path = ? LIMIT 1',
      args: [pagePath]
    });
    if (result.rows.length > 0) {
      return result.rows[0] as { h1_title?: string; h2_subtitle?: string; page_content?: string };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function HashtagPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;

  const hashtag = getHashtagById(id);
  if (!hashtag) {
    notFound();
  }

  const hashtagName = getHashtagName(id, locale);

  // Fetch girls and SEO data in parallel — directly from DB (not API)
  const [girls, seoData] = await Promise.all([
    getGirlsByHashtag(id),
    getSeoContent(`/${locale}/hashtag/${id}`)
  ]);

  console.log(`[HASHTAG SERVER] /${locale}/hashtag/${id} - girls: ${girls.length}`);

  return <HashtagClient girls={girls} hashtagName={hashtagName} seoData={seoData} />;
}
