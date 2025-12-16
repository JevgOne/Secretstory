import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@libsql/client';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Create DB client directly
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined');
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initSchedulesDb() {
  try {
    console.log('Creating girl_schedules table...');
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

    console.log('Creating schedule_exceptions table...');
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

    console.log('Creating indexes...');
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_girl_schedules_girl_id ON girl_schedules(girl_id)
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_girl_schedules_day ON girl_schedules(day_of_week)
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_girl_date ON schedule_exceptions(girl_id, date)
    `);

    console.log('✓ Schedule tables created successfully!');

    // Verify tables exist
    const tables = await db.execute(`
      SELECT name FROM sqlite_master WHERE type='table' AND (name='girl_schedules' OR name='schedule_exceptions')
    `);
    console.log('\nVerified tables:', tables.rows);

  } catch (error) {
    console.error('Error creating schedule tables:', error);
    throw error;
  }
}

initSchedulesDb()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error);
    process.exit(1);
  });
