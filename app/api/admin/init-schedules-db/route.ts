import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// POST /api/admin/init-schedules-db - Create schedules tables (Admin only)
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    // Create girl_schedules table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS girl_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        girl_id INTEGER NOT NULL,
        day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
      )
    `);

    // Create schedule_exceptions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS schedule_exceptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        girl_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        exception_type TEXT NOT NULL CHECK(exception_type IN ('unavailable', 'custom_hours')),
        start_time TEXT,
        end_time TEXT,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_girl_schedules_girl_id ON girl_schedules(girl_id)
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_girl_schedules_day ON girl_schedules(day_of_week)
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_girl_date ON schedule_exceptions(girl_id, date)
    `);

    return NextResponse.json({
      success: true,
      message: 'Schedule tables created successfully'
    });
  } catch (error) {
    console.error('Error creating schedule tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create schedule tables' },
      { status: 500 }
    );
  }
}
