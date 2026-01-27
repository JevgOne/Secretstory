import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { setRequestLocale } from 'next-intl/server';
import GirlProfileClient from './GirlProfileClient';

// ISR: Revalidate girl profiles every 5 minutes for fresh data
export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Server-side data fetching (FAST - direct DB, no API roundtrip)
async function getGirlData(slug: string) {
  try {
    const result = await db.execute({
      sql: `
        SELECT
          id, name, slug, email, phone, age, nationality,
          height, weight, bust, hair, eyes, color, status, verified,
          online, rating, reviews_count, bookings_count, services,
          hashtags, bio, bio_cs, bio_de, bio_uk,
          subtitle_cs, subtitle_en, subtitle_de, subtitle_uk,
          tattoo_percentage, tattoo_description,
          tattoo_description_cs, tattoo_description_en,
          tattoo_description_de, tattoo_description_uk,
          piercing, piercing_description,
          piercing_description_cs, piercing_description_en,
          piercing_description_de, piercing_description_uk,
          languages, meta_title, meta_description,
          og_title, og_description, og_image,
          created_at, updated_at
        FROM girls
        WHERE slug = ? AND status = 'active'
      `,
      args: [slug]
    });

    if (result.rows.length === 0) return null;

    const girl = result.rows[0];

    // Fetch all related data in PARALLEL for max speed
    const [photosResult, videosResult, scheduleResult, servicesResult] = await Promise.all([
      db.execute({
        sql: `
          SELECT id, url, thumbnail_url, is_primary, display_order,
                 alt_text, alt_text_cs, alt_text_en, alt_text_de, alt_text_uk
          FROM girl_photos
          WHERE girl_id = ?
          ORDER BY display_order ASC, created_at ASC
        `,
        args: [girl.id]
      }),
      db.execute({
        sql: `
          SELECT id, url, thumbnail_url, display_order, duration
          FROM girl_videos
          WHERE girl_id = ?
          ORDER BY display_order ASC, created_at ASC
        `,
        args: [girl.id]
      }),
      db.execute({
        sql: `
          SELECT day_of_week, start_time, end_time
          FROM girl_schedules
          WHERE girl_id = ? AND is_active = 1
          ORDER BY day_of_week
        `,
        args: [girl.id]
      }),
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

    // Get current day for schedule filtering
    const now = new Date();
    const jsDay = now.getDay();
    const currentDayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    const weekSchedule = scheduleResult.rows
      .filter((s: any) => s.day_of_week >= currentDayOfWeek)
      .map((s: any) => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time.substring(0, 5),
        end_time: s.end_time.substring(0, 5)
      }));

    const servicesSlugs = servicesResult.rows.map((row: any) => row.slug);

    return {
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
  } catch (error) {
    console.error('Error fetching girl data:', error);
    return null;
  }
}

// Generate static params for top girls (pre-render at build time)
export async function generateStaticParams() {
  try {
    const result = await db.execute({
      sql: `
        SELECT slug
        FROM girls
        WHERE status = 'active'
        ORDER BY rating DESC, reviews_count DESC
        LIMIT 20
      `,
      args: []
    });

    return result.rows.map((row: any) => ({
      slug: row.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function GirlProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = await getGirlData(slug);

  if (!data) {
    notFound();
  }

  // Pass server-fetched data to client component
  return <GirlProfileClient locale={locale} slug={slug} initialData={data} />;
}
