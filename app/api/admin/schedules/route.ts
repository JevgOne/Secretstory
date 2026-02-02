import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// GET /api/admin/schedules - Get all schedules or schedules for a specific girl
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const girlId = searchParams.get('girl_id');

    let sql = `
      SELECT
        s.*,
        g.name as girl_name,
        g.color as girl_color,
        (SELECT url FROM girl_photos WHERE girl_id = g.id AND is_primary = 1 LIMIT 1) as girl_photo
      FROM girl_schedules s
      LEFT JOIN girls g ON s.girl_id = g.id
      WHERE s.is_active = 1
    `;
    const args: any[] = [];

    if (girlId) {
      sql += ' AND s.girl_id = ?';
      args.push(girlId);
    }

    sql += ' ORDER BY s.girl_id, s.day_of_week, s.start_time';

    const result = await db.execute({ sql, args });

    // Group by girl_id
    const schedulesByGirl: Record<number, any> = {};

    result.rows.forEach((row: any) => {
      if (!schedulesByGirl[row.girl_id]) {
        schedulesByGirl[row.girl_id] = {
          girl_id: row.girl_id,
          girl_name: row.girl_name,
          girl_color: row.girl_color,
          girl_photo: row.girl_photo,
          schedules: []
        };
      }
      schedulesByGirl[row.girl_id].schedules.push({
        id: row.id,
        day_of_week: row.day_of_week,
        start_time: row.start_time,
        end_time: row.end_time
      });
    });

    return NextResponse.json({
      success: true,
      schedules: Object.values(schedulesByGirl)
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST /api/admin/schedules - Create new schedule
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { girl_id, day_of_week, start_time, end_time } = body;

    // Validation
    if (!girl_id || day_of_week === undefined || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (day_of_week < 0 || day_of_week > 6) {
      return NextResponse.json(
        { error: 'Invalid day_of_week (must be 0-6)' },
        { status: 400 }
      );
    }

    // Check if EXACT same schedule already exists (same day, same times)
    const exactMatch = await db.execute({
      sql: `
        SELECT id FROM girl_schedules
        WHERE girl_id = ?
        AND day_of_week = ?
        AND start_time = ?
        AND end_time = ?
        AND is_active = 1
      `,
      args: [girl_id, day_of_week, start_time, end_time]
    });

    // If exact same schedule exists, return success (idempotent)
    if (exactMatch.rows.length > 0) {
      return NextResponse.json({
        success: true,
        schedule_id: (exactMatch.rows[0] as any).id,
        message: 'Rozvrh již existuje',
        exists: true
      }, { status: 200 });
    }

    // Check for overlapping schedules (different times on same day)
    const overlapCheck = await db.execute({
      sql: `
        SELECT id, start_time, end_time FROM girl_schedules
        WHERE girl_id = ?
        AND day_of_week = ?
        AND is_active = 1
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
      `,
      args: [girl_id, day_of_week, start_time, start_time, end_time, end_time, start_time, end_time]
    });

    if (overlapCheck.rows.length > 0) {
      const existing = overlapCheck.rows[0] as any;
      return NextResponse.json(
        { error: `Rozvrh se překrývá s existujícím rozvrhem (${existing.start_time}-${existing.end_time})` },
        { status: 409 }
      );
    }

    const result = await db.execute({
      sql: `
        INSERT INTO girl_schedules (girl_id, day_of_week, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `,
      args: [girl_id, day_of_week, start_time, end_time]
    });

    return NextResponse.json({
      success: true,
      schedule_id: Number(result.lastInsertRowid),
      message: 'Rozvrh vytvořen'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/schedules - Delete schedule or all schedules
export async function DELETE(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    // Delete all schedules if id=all
    if (scheduleId === 'all') {
      const result = await db.execute({
        sql: 'DELETE FROM girl_schedules',
        args: []
      });

      return NextResponse.json({
        success: true,
        message: 'Všechny rozvrhy smazány',
        deleted: result.rowsAffected
      });
    }

    await db.execute({
      sql: 'DELETE FROM girl_schedules WHERE id = ?',
      args: [scheduleId]
    });

    return NextResponse.json({
      success: true,
      message: 'Rozvrh smazán'
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
