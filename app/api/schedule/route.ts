import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/schedule - Get girls available today with their schedule
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lang = searchParams.get('lang') || 'cs';

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

    // Get current day of week in English lowercase (monday, tuesday, etc.)
    const dayOfWeek = new Intl.DateTimeFormat('en-US', {
      timeZone: pragueTz,
      weekday: 'long'
    }).format(now).toLowerCase();

    // 2. Fetch all active girls with schedule
    const result = await db.execute({
      sql: `SELECT
        id, name, slug, age, location, schedule, photos,
        description_cs, description_en, description_de, description_uk,
        bio, online
      FROM girls
      WHERE status = 'active'`,
      args: []
    });

    // 3. Filter by schedule and determine status
    const girls = result.rows
      .map(girl => {
        // Parse schedule JSON
        let schedule = null;
        try {
          schedule = girl.schedule ? JSON.parse(girl.schedule as string) : null;
        } catch (e) {
          console.error(`Failed to parse schedule for girl ${girl.id}:`, e);
          return null;
        }

        // If no schedule, skip
        if (!schedule) return null;

        // Get today's schedule
        const todaySchedule = schedule[dayOfWeek];

        // If girl doesn't work today, skip
        if (!todaySchedule || !todaySchedule.works) return null;

        const shiftFrom = todaySchedule.from; // e.g., "10:00"
        const shiftTo = todaySchedule.to;     // e.g., "20:00"

        // Determine status
        let status = 'later'; // Default: not working yet

        if (currentTime >= shiftFrom && currentTime <= shiftTo) {
          status = 'working'; // Currently working
        } else if (currentTime > shiftTo) {
          // Shift already ended today - don't show this girl
          return null;
        }

        // Parse photos
        let photos = [];
        try {
          photos = girl.photos ? JSON.parse(girl.photos as string) : [];
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
          location: girl.location || 'Praha',
          photos,
          age: girl.age,
          description,
          online: girl.online
        };
      })
      .filter(Boolean); // Remove nulls

    // 4. Sort by status: working first, then later
    girls.sort((a, b) => {
      if (a!.status === 'working' && b!.status !== 'working') return -1;
      if (a!.status !== 'working' && b!.status === 'working') return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      current_time: currentTime,
      day: dayOfWeek,
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
