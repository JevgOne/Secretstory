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

async function verifySchedulesTables() {
  try {
    console.log('Checking for schedule tables...\n');

    // Get all tables
    const tablesResult = await db.execute(`
      SELECT name, type FROM sqlite_master
      WHERE type='table'
      ORDER BY name
    `);

    console.log('All tables in database:');
    console.log('═══════════════════════════════════════════');
    tablesResult.rows.forEach(row => {
      const table = row as unknown as {name: string, type: string};
      console.log(`  - ${table.name}`);
    });
    console.log('═══════════════════════════════════════════\n');

    // Check for schedule tables specifically
    const scheduleTableNames = ['girl_schedules', 'schedule_exceptions'];
    const foundTables = tablesResult.rows
      .filter(row => scheduleTableNames.includes((row as any).name))
      .map(row => (row as any).name);

    console.log('Schedule-related tables:');
    if (foundTables.length > 0) {
      foundTables.forEach(name => {
        console.log(`  ✓ ${name}`);
      });
    } else {
      console.log('  ✗ No schedule tables found');
    }

    // Get schema for each schedule table
    if (foundTables.includes('girl_schedules')) {
      console.log('\n--- girl_schedules schema ---');
      const schema = await db.execute(`PRAGMA table_info(girl_schedules)`);
      schema.rows.forEach(col => {
        const column = col as any;
        console.log(`  ${column.name} (${column.type})`);
      });
    }

    if (foundTables.includes('schedule_exceptions')) {
      console.log('\n--- schedule_exceptions schema ---');
      const schema = await db.execute(`PRAGMA table_info(schedule_exceptions)`);
      schema.rows.forEach(col => {
        const column = col as any;
        console.log(`  ${column.name} (${column.type})`);
      });
    }

    // Check indexes
    console.log('\n--- Indexes ---');
    const indexesResult = await db.execute(`
      SELECT name, tbl_name FROM sqlite_master
      WHERE type='index' AND (
        tbl_name='girl_schedules' OR
        tbl_name='schedule_exceptions'
      )
    `);

    if (indexesResult.rows.length > 0) {
      indexesResult.rows.forEach(row => {
        const index = row as unknown as {name: string, tbl_name: string};
        console.log(`  ✓ ${index.name} on ${index.tbl_name}`);
      });
    } else {
      console.log('  ✗ No indexes found for schedule tables');
    }

    console.log('\n✓ Verification complete!');

  } catch (error) {
    console.error('Error verifying schedule tables:', error);
    throw error;
  }
}

verifySchedulesTables()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error);
    process.exit(1);
  });
