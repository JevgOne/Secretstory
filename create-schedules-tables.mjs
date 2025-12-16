import { createClient } from '@libsql/client';
import fs from 'fs';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || ''
});

const sql = fs.readFileSync('./schema-schedules.sql', 'utf-8');
const statements = sql.split(';').filter(s => s.trim());

for (const stmt of statements) {
  if (stmt.trim()) {
    try {
      await db.execute(stmt);
      console.log('✓ Executed:', stmt.substring(0, 60).replace(/\n/g, ' ') + '...');
    } catch (error) {
      console.error('✗ Error:', error.message);
    }
  }
}

console.log('\n✓ Done!');
