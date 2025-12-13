import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  const db = createClient({
    url: 'libsql://lovelygirls-zentala.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || ''
  });

  try {
    // Add opening_hours column
    await db.execute('ALTER TABLE locations ADD COLUMN opening_hours TEXT');
    console.log('✓ Added opening_hours column');

    // Update existing Praha 2 location
    await db.execute({
      sql: "UPDATE locations SET opening_hours = ? WHERE name = ?",
      args: ['10:00 — 22:00', 'praha-2']
    });
    console.log('✓ Updated Praha 2 with opening hours');

    console.log('\n✓ Migration completed successfully!');
  } catch (err: any) {
    console.error('✗ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
