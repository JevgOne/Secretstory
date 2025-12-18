import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Check if reviews table exists
const result = await db.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="reviews"');
console.log('Reviews table exists:', result.rows.length > 0);

if (result.rows.length > 0) {
  // Get table structure
  const structure = await db.execute('PRAGMA table_info(reviews)');
  console.log('\nTable structure:');
  structure.rows.forEach(row => {
    console.log(`  ${row.name}: ${row.type}`);
  });
}

process.exit(0);
