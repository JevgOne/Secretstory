import { Metadata } from 'next';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';
import { generatePageMetadata } from '@/lib/seo-metadata';
import ScheduleClient from './ScheduleClient';
import { BreadcrumbListSchema } from '@/components/JsonLd';

// ISR - Revalidate every second for real-time updates
export const revalidate = 1;

interface Girl {
  id: number;
  name: string;
  slug: string;
  status: "working" | "later";
  shift: {
    from: string;
    to: string;
  };
  location: string;
  photos: string[];
  age: number;
  height: number;
  weight: number;
  bust: number;
  description: string;
  online: boolean;
  badge_type: string | null;
}

interface ScheduleData {
  girls: Girl[];
  currentTime: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/schedule`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/schedule',
        en: 'https://www.lovelygirls.cz/en/schedule',
        de: 'https://www.lovelygirls.cz/de/schedule',
        uk: 'https://www.lovelygirls.cz/uk/schedule',
      },
    },
  };
}

// Server-side data fetching - directly from database
// Fetches TODAY's schedule for initial page load
async function getScheduleData(lang: string): Promise<ScheduleData> {
  try {
    // Create cache key
    const cacheKey = `schedule-today-${lang}`;
    const cached = cache.get<ScheduleData>(cacheKey, 60000); // 60s cache
    if (cached) {
      return cached;
    }

    // 1. Get current time in Prague timezone
    const now = new Date();
    const pragueTz = 'Europe/Prague';

    // Format current time as HH:MM (24h format)
    const currentTime = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: pragueTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);

    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Convert to our format: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
    const jsDay = now.getDay();
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    // 2. Fetch all active girls with their schedules for today
    const result = await db.execute({
      sql: `SELECT DISTINCT
        g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust, g.location,
        g.description_cs, g.description_en, g.description_de, g.description_uk,
        g.bio, g.online, g.badge_type,
        gs.start_time, gs.end_time
      FROM girls g
      LEFT JOIN girl_schedules gs ON g.id = gs.girl_id
        AND gs.day_of_week = ?
        AND gs.is_active = 1
      WHERE g.status = 'active'
      ORDER BY g.name`,
      args: [dayOfWeek]
    });

    // Get all girl IDs that have schedules
    const girlIds = result.rows
      .filter((girl: any) => girl.start_time && girl.end_time)
      .map((girl: any) => girl.id);

    // Fetch ALL primary photos in one query (much faster!)
    let photoMap = new Map<number, string>();
    if (girlIds.length > 0) {
      const placeholders = girlIds.map(() => '?').join(',');
      const photosResult = await db.execute({
        sql: `
          SELECT girl_id, url
          FROM girl_photos
          WHERE girl_id IN (${placeholders}) AND is_primary = 1
        `,
        args: girlIds
      });

      photosResult.rows.forEach((row: any) => {
        photoMap.set(row.girl_id as number, row.url as string);
      });
    }

    // 3. Filter by schedule and determine status
    const girls = result.rows
      .map((girl: any) => {
        // If no schedule for this day, skip
        if (!girl.start_time || !girl.end_time) return null;

        const shiftFrom = girl.start_time.substring(0, 5); // HH:MM
        const shiftTo = girl.end_time.substring(0, 5);     // HH:MM

        // Determine status (for today)
        let status: "working" | "later" = 'later'; // Default: not working yet

        if (currentTime >= shiftFrom && currentTime <= shiftTo) {
          status = 'working'; // Currently working
        } else if (currentTime > shiftTo) {
          // Shift has ended - skip this girl
          return null;
        }

        // Get photo from pre-fetched map
        const photoUrl = photoMap.get(girl.id as number);
        const photos = photoUrl ? [photoUrl] : [];

        // Get description in requested language
        const descriptionKey = `description_${lang}` as keyof typeof girl;
        const description = girl[descriptionKey] as string || girl.bio as string || '';

        return {
          id: Number(girl.id),
          name: girl.name,
          slug: girl.slug,
          status,
          shift: {
            from: shiftFrom,
            to: shiftTo
          },
          location: girl.location || 'Praha 2',
          photos,
          age: Number(girl.age),
          height: Number(girl.height),
          weight: Number(girl.weight),
          bust: Number(girl.bust),
          description,
          online: Boolean(girl.online),
          badge_type: girl.badge_type
        };
      })
      .filter((girl): girl is Girl => girl !== null);

    // 4. Sort by status: working first, then later
    girls.sort((a, b) => {
      if (a.status === 'working' && b.status !== 'working') return -1;
      if (a.status !== 'working' && b.status === 'working') return 1;
      return 0;
    });

    const responseData = {
      girls,
      currentTime
    };

    // Cache the response
    cache.set(cacheKey, responseData);

    return responseData;
  } catch (error) {
    console.error('Schedule API error:', error);
    // Return empty data on error
    return {
      girls: [],
      currentTime: ''
    };
  }
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch schedule data server-side (today's schedule)
  const { girls, currentTime } = await getScheduleData(locale);

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Schedule",
        "name": "Rozvrh - LovelyGirls Prague",
        "description": "Aktuální rozvrh dostupnosti společnic",
        "eventSchedule": {
          "@type": "Schedule",
          "byDay": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "startTime": "10:00",
          "endTime": "04:00"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.lovelygirls.cz/#business",
        "name": "LovelyGirls Prague",
        "url": `https://www.lovelygirls.cz/${locale}/schedule`,
        "telephone": "+420734332131",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Prague",
          "addressCountry": "CZ"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "04:00"
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://www.lovelygirls.cz/${locale}/schedule#webpage`,
        "url": `https://www.lovelygirls.cz/${locale}/schedule`,
        "name": "Rozvrh - LovelyGirls Prague",
        "description": "Aktuální rozvrh dostupnosti společnic",
        "inLanguage": locale,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.lovelygirls.cz/#website",
          "name": "LovelyGirls Prague",
          "url": "https://www.lovelygirls.cz"
        }
      }
    ]
  };

  return (
    <>
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: 'Rozvrh', url: `https://www.lovelygirls.cz/${locale}/schedule` }
      ]} />
      <ScheduleClient
        locale={locale}
        initialGirls={girls}
        initialCurrentTime={currentTime}
        schemaData={schemaData}
      />
    </>
  );
}
