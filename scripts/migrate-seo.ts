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

  console.log('🔄 Running SEO metadata migration...\n');

  const sqlFile = path.join(process.cwd(), 'prisma/migrations/007_seo_metadata.sql');
  const sql = fs.readFileSync(sqlFile, 'utf-8');

  // Remove comments and split properly
  const lines = sql.split('\n');
  const cleanedLines: string[] = [];

  for (const line of lines) {
    // Remove inline comments
    const cleanLine = line.replace(/--.*$/, '').trim();
    if (cleanLine) {
      cleanedLines.push(cleanLine);
    }
  }

  const cleanSql = cleanedLines.join('\n');

  // Split by semicolon, handling multi-line statements
  const statements: string[] = [];
  let currentStmt = '';

  for (const part of cleanSql.split(';')) {
    currentStmt += part;
    if (currentStmt.trim()) {
      statements.push(currentStmt.trim());
      currentStmt = '';
    }
  }

  console.log(`📋 Found ${statements.length} statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ') + '...';

    console.log(`⚙️  Statement ${i + 1}/${statements.length}: ${preview}`);

    try {
      await db.execute(stmt);
      console.log('   ✅ Success\n');
      successCount++;
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        console.log('   ⏭️  Skipped (already exists)\n');
        successCount++;
      } else {
        console.error('   ❌ Error:', err.message);
        console.error('   Statement:', stmt.substring(0, 200), '\n');
        errorCount++;
      }
    }
  }

  console.log(`\n✅ SEO metadata migration completed!`);
  console.log(`   Success: ${successCount}, Errors: ${errorCount}\n`);

  // Verify table
  const tables = await db.execute(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name = 'seo_metadata'
  `);

  if (tables.rows.length > 0) {
    console.log('📊 SEO metadata table created successfully!');

    // Count initial records
    const count = await db.execute('SELECT COUNT(*) as count FROM seo_metadata');
    console.log(`   Initial records: ${(count.rows[0] as any).count}\n`);
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

migrate().catch(console.error);
