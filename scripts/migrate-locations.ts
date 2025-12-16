import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const db = createClient({
  url: 'libsql://lovelygirls-zentala.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || ''
});

async function migrate() {
  const sql = readFileSync('./migrations/002_create_locations_table.sql', 'utf-8');
  const statements = sql
    .split(';')
    .filter(s => {
      const trimmed = s.trim();
      return trimmed.length > 0 && !trimmed.startsWith('--');
    });

  for (const stmt of statements) {
    if (stmt.trim()) {
      try {
        await db.execute(stmt.trim());
        const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
        console.log('✓ Executed:', preview + '...');
      } catch (err: any) {
        console.error('✗ Error:', err.message);
      }
    }
  }

  console.log('\n✓ Migration completed!');
}

migrate();
