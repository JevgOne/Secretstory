import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/schedule - Get girls available on specified date with their schedule
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lang = searchParams.get('lang') || 'cs';
    const dateParam = searchParams.get('date'); // YYYY-MM-DD format

    // 1. Get current time and target date in Prague timezone
    const now = new Date();
    const pragueTz = 'Europe/Prague';

    // Parse target date or use today
    const targetDate = dateParam ? new Date(dateParam) : now;

    // Format current time as HH:MM (24h format)
    const currentTime = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: pragueTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);

    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Convert to our format: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
    const jsDay = targetDate.getDay();
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    // 2. Fetch all active girls with their schedules for the target day
    const result = await db.execute({
      sql: `SELECT DISTINCT
        g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust, g.location, g.photos,
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

    // 3. Filter by schedule and determine status
    const girls = result.rows
      .map((girl: any) => {
        // If no schedule for this day, skip
        if (!girl.start_time || !girl.end_time) return null;

        const shiftFrom = girl.start_time.substring(0, 5); // HH:MM
        const shiftTo = girl.end_time.substring(0, 5);     // HH:MM

        // Determine status (only for today)
        let status = 'later'; // Default: not working yet

        const isToday = targetDate.toDateString() === now.toDateString();

        if (isToday) {
          if (currentTime >= shiftFrom && currentTime <= shiftTo) {
            status = 'working'; // Currently working
          }
          // Don't filter out girls whose shift ended - show all girls with schedule
        }

        // Parse photos
        let photos = [];
        try {
          const parsedPhotos = girl.photos ? JSON.parse(girl.photos as string) : [];
          // Photos may be stored as [{data: "url"}] or as ["url"]
          photos = parsedPhotos.map((p: any) =>
            typeof p === 'string' ? p : (p.data || p.url || '')
          ).filter(Boolean);
        } catch (e) {
          console.error(`Failed to parse photos for girl ${girl.id}:`, e);
        }

        // Get description in requested language
        const descriptionKey = `description_${lang}` as keyof typeof girl;
        const description = girl[descriptionKey] as string || girl.bio as string || '';

        return {
          id: girl.id,
          name: girl.name,
          slug: girl.slug,
          status,
          shift: {
            from: shiftFrom,
            to: shiftTo
          },
          location: girl.location || 'Praha 2',
          photos,
          age: girl.age,
          height: girl.height,
          weight: girl.weight,
          bust: girl.bust,
          description,
          online: girl.online,
          badge_type: girl.badge_type
        };
      })
      .filter(Boolean); // Remove nulls

    // 4. Sort by status: working first, then later
    girls.sort((a, b) => {
      if (a!.status === 'working' && b!.status !== 'working') return -1;
      if (a!.status !== 'working' && b!.status === 'working') return 1;
      return 0;
    });

    // Day name for response
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayName = dayNames[dayOfWeek];

    return NextResponse.json({
      success: true,
      current_time: currentTime,
      day: dayName,
      timezone: pragueTz,
      girls
    });
  } catch (error) {
    console.error('Schedule API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch schedule'
      },
      { status: 500 }
    );
  }
}
