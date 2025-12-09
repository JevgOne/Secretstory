import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// PUT /api/admin/girls/:id/schedule - Update girl's weekly schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin', 'manager']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const { schedule } = await request.json();

    // Validate schedule structure
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (const day of weekDays) {
      if (!schedule[day]) {
        return NextResponse.json(
          { error: `Chybí den: ${day}` },
          { status: 400 }
        );
      }

      const daySchedule = schedule[day];

      if (typeof daySchedule.works !== 'boolean') {
        return NextResponse.json(
          { error: `Neplatná hodnota 'works' pro ${day}` },
          { status: 400 }
        );
      }

      if (daySchedule.works) {
        if (!daySchedule.from || !daySchedule.to) {
          return NextResponse.json(
            { error: `Chybí čas 'from' nebo 'to' pro ${day}` },
            { status: 400 }
          );
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(daySchedule.from) || !timeRegex.test(daySchedule.to)) {
          return NextResponse.json(
            { error: `Neplatný formát času pro ${day}. Použijte HH:MM` },
            { status: 400 }
          );
        }
      }
    }

    // Check if girl exists
    const girlResult = await db.execute({
      sql: 'SELECT id FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    if (girlResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Profil nenalezen' },
        { status: 404 }
      );
    }

    // Update schedule
    await db.execute({
      sql: 'UPDATE girls SET schedule = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [JSON.stringify(schedule), parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      message: 'Rozvrh aktualizován'
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci rozvrhu' },
      { status: 500 }
    );
  }
}

// GET /api/admin/girls/:id/schedule - Get girl's weekly schedule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin', 'manager']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;

    const result = await db.execute({
      sql: 'SELECT schedule FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Profil nenalezen' },
        { status: 404 }
      );
    }

    const schedule = result.rows[0].schedule
      ? JSON.parse(result.rows[0].schedule as string)
      : null;

    return NextResponse.json({
      success: true,
      schedule
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání rozvrhu' },
      { status: 500 }
    );
  }
}
