import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/girls - Get all girls (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'active';
    const online = searchParams.get('online');
    const lang = searchParams.get('lang') || 'cs';
    const service = searchParams.get('service'); // Filter by service ID
    const hashtag = searchParams.get('hashtag'); // Filter by hashtag ID

    let sql = `
      SELECT
        g.id,
        g.name,
        g.slug,
        g.email,
        g.phone,
        g.age,
        g.nationality,
        g.height,
        g.weight,
        g.bust,
        g.hair,
        g.eyes,
        g.color,
        g.status,
        g.verified,
        g.online,
        g.rating,
        g.reviews_count,
        g.bookings_count,
        g.bio,
        g.tattoo_percentage,
        g.tattoo_description,
        g.piercing,
        g.piercing_description,
        g.languages,
        g.is_new,
        g.is_top,
        g.is_featured,
        g.badge_type,
        g.featured_section,
        g.location,
        g.services,
        g.hashtags,
        g.created_at,
        g.updated_at
      FROM girls g
      WHERE 1=1
    `;
    const args: any[] = [];

    if (status) {
      sql += ' AND g.status = ?';
      args.push(status);
    }

    if (online !== null && online !== undefined) {
      sql += ' AND g.online = ?';
      args.push(online === 'true' ? 1 : 0);
    }

    if (hashtag) {
      sql += ' AND g.hashtags LIKE ?';
      args.push(`%"${hashtag}"%`);
    }

    sql += ' ORDER BY g.online DESC, g.rating DESC, g.created_at DESC';

    const result = await db.execute({ sql, args });

    // Get current time and day for schedule status
    const now = new Date();
    const pragueTz = 'Europe/Prague';
    const currentTime = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: pragueTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);

    // Get day of week (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
    const jsDay = now.getDay();
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    // For each girl, fetch their primary photo and today's schedule
    let girlsWithPhotos = await Promise.all(
      result.rows.map(async (row) => {
        const photoResult = await db.execute({
          sql: `
            SELECT url, thumbnail_url
            FROM girl_photos
            WHERE girl_id = ? AND is_primary = 1
            LIMIT 1
          `,
          args: [row.id]
        });

        // Get today's schedule for this girl
        const scheduleResult = await db.execute({
          sql: `
            SELECT start_time, end_time
            FROM girl_schedules
            WHERE girl_id = ? AND day_of_week = ? AND is_active = 1
            LIMIT 1
          `,
          args: [row.id, dayOfWeek]
        });

        const primaryPhoto = photoResult.rows[0];
        const services = row.services ? JSON.parse(row.services as string) : [];
        const hashtags = row.hashtags ? JSON.parse(row.hashtags as string) : [];

        // Determine schedule status
        let scheduleStatus = null;
        let scheduleFrom = null;
        let scheduleTo = null;

        if (scheduleResult.rows.length > 0) {
          const schedule = scheduleResult.rows[0];
          scheduleFrom = schedule.start_time ? (schedule.start_time as string).substring(0, 5) : null;
          scheduleTo = schedule.end_time ? (schedule.end_time as string).substring(0, 5) : null;

          if (scheduleFrom && scheduleTo) {
            if (currentTime >= scheduleFrom && currentTime <= scheduleTo) {
              scheduleStatus = 'working';
            } else {
              scheduleStatus = 'later';
            }
          }
        }

        return {
          ...row,
          services,
          hashtags,
          verified: Boolean(row.verified),
          online: Boolean(row.online),
          piercing: Boolean(row.piercing),
          is_new: Boolean(row.is_new),
          is_top: Boolean(row.is_top),
          is_featured: Boolean(row.is_featured),
          primary_photo: primaryPhoto?.url || null,
          thumbnail: primaryPhoto?.thumbnail_url || null,
          schedule_status: scheduleStatus,
          schedule_from: scheduleFrom,
          schedule_to: scheduleTo
        };
      })
    );

    // Filter by service if specified (client-side filtering since services is JSON)
    if (service) {
      girlsWithPhotos = girlsWithPhotos.filter(girl =>
        girl.services && girl.services.includes(service)
      );
    }

    return NextResponse.json({
      success: true,
      girls: girlsWithPhotos
    });
  } catch (error) {
    console.error('Get girls error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání dívek' },
      { status: 500 }
    );
  }
}
