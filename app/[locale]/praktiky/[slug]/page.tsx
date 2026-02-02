import { db } from '@/lib/db';
import { getServiceById, getServiceName } from '@/lib/services';
import { notFound } from 'next/navigation';
import PraktikyClient from './PraktikyClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-metadata';

// ISR - Revalidate every 15 minutes
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
  status: string;
  color: string;
  location?: string;
  primary_photo?: string | null;
  thumbnail?: string | null;
  schedule_status?: 'working' | 'later' | null;
  schedule_from?: string | null;
  schedule_to?: string | null;
}

/**
 * Generate metadata for this praktiky page
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const pagePath = `/${locale}/praktiky/${slug}`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        'cs': `/cs/praktiky/${slug}`,
        'en': `/en/praktiky/${slug}`,
        'de': `/de/praktiky/${slug}`,
        'uk': `/uk/praktiky/${slug}`
      }
    }
  };
}

/**
 * Fetch girls that offer a specific service, directly from DB (server-side)
 */
async function getGirlsByService(serviceId: string): Promise<Girl[]> {
  try {
    // Services are stored as JSON array in the girls table
    const result = await db.execute({
      sql: `
        SELECT
          g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust,
          g.online, g.status, g.color, g.location, g.services,
          g.is_new, g.badge_type, g.created_at
        FROM girls g
        WHERE g.status = 'active'
          AND g.services LIKE ?
        ORDER BY g.online DESC, g.rating DESC, g.created_at DESC
      `,
      args: [`%"${serviceId}"%`]
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

    // Filter to only include girls that actually have this service in their JSON array
    const girls = result.rows
      .filter((row: any) => {
        try {
          const services = JSON.parse(row.services || '[]');
          return services.includes(serviceId);
        } catch {
          return false;
        }
      })
      .map((row: any) => {
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
              scheduleStatus = null; // finished
            }
          }
        }

        return {
          id: row.id as number,
          name: row.name as string,
          slug: row.slug as string,
          age: row.age as number,
          height: row.height as number,
          weight: row.weight as number,
          bust: row.bust as string,
          online: Boolean(row.online),
          status: row.status as string,
          color: row.color as string,
          location: (row.location as string) || undefined,
          primary_photo: photo?.url || null,
          thumbnail: photo?.thumbnail_url || null,
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
    console.error('Error fetching girls by service:', error);
    return [];
  }
}

export default async function PraktikaDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  const service = getServiceById(slug);
  if (!service) {
    notFound();
  }

  const serviceName = getServiceName(slug, locale);
  const girls = await getGirlsByService(slug);

  console.log(`[PRAKTIKY SERVER] /${locale}/praktiky/${slug} - girls: ${girls.length}`);

  return <PraktikyClient girls={girls} serviceSlug={slug} serviceName={serviceName} />;
}
