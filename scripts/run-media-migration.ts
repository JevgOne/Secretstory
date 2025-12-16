import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function runMigration() {
  console.log('Running girl media migration...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing database credentials');
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  try {
    const sql = fs.readFileSync('prisma/migrations/011_girl_media.sql', 'utf-8');
    const statements = sql
      .split(';')
      .filter(s => s.trim() && !s.trim().startsWith('--') && !s.trim().startsWith('CREATE INDEX'));

    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await db.execute(stmt);
          const preview = stmt.substring(0, 80).replace(/\n/g, ' ');
          console.log('✓ Executed:', preview + '...');
        } catch (err: any) {
          if (err.message?.includes('already exists')) {
            console.log('⚠ Skipped (already exists)');
          } else {
            throw err;
          }
        }
      }
    }

    // Execute indexes separately
    const indexStatements = sql
      .split(';')
      .filter(s => s.trim().startsWith('CREATE INDEX'));

    for (const stmt of indexStatements) {
      if (stmt.trim()) {
        try {
          await db.execute(stmt);
          console.log('✓ Created index');
        } catch (err: any) {
          if (err.message?.includes('already exists')) {
            console.log('⚠ Index already exists');
          } else {
            throw err;
          }
        }
      }
    }

    console.log('\n✅ Migration 011 completed successfully!');
    console.log('   - girl_photos table created');
    console.log('   - girl_videos table created');
    console.log('   - Indexes created');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
