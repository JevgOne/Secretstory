import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function migrate() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials');
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  console.log('🚀 Creating performance indexes...\n');

  const sqlFile = path.join(process.cwd(), 'prisma/migrations/010_performance_indexes.sql');
  const sql = fs.readFileSync(sqlFile, 'utf-8');

  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));

  let successCount = 0;
  let skipCount = 0;

  for (const stmt of statements) {
    if (stmt.trim()) {
      const indexName = stmt.match(/idx_\w+/)?.[0] || 'index';

      try {
        await db.execute(stmt);
        console.log('✅', indexName);
        successCount++;
      } catch (err: any) {
        if (err.message && err.message.includes('already exists')) {
          console.log('⏭️ ', indexName, '(already exists)');
          skipCount++;
        } else {
          console.error('❌', indexName, ':', err.message);
        }
      }
    }
  }

  console.log(`\n✨ Performance optimization completed!`);
  console.log(`   Created: ${successCount}, Skipped: ${skipCount}\n`);

  process.exit(0);
}

migrate().catch(console.error);
