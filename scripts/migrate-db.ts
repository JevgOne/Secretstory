import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function migrate() {
  console.log('🔄 Running database migration...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials');
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  // Read schema files
  const tablesPath = path.join(process.cwd(), 'schema-tables.sql');
  const indexesPath = path.join(process.cwd(), 'schema-indexes.sql');

  const tablesSQL = fs.readFileSync(tablesPath, 'utf-8');
  const indexesSQL = fs.readFileSync(indexesPath, 'utf-8');

  // Parse table creation statements (split by CREATE TABLE)
  const tableStatements = tablesSQL
    .split(/(?=CREATE TABLE)/g)
    .map(s => s.trim())
    .filter(s => s.startsWith('CREATE TABLE'));

  // Parse index statements
  const indexStatements = indexesSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.startsWith('CREATE INDEX'));

  const allStatements = [...tableStatements, ...indexStatements];
  console.log(`📋 Found ${tableStatements.length} tables and ${indexStatements.length} indexes\n`);

  try {
    for (let i = 0; i < allStatements.length; i++) {
      const stmt = allStatements[i];
      const preview = stmt.substring(0, 60).replace(/\n/g, ' ') + '...';
      console.log(`⚙️  Statement ${i + 1}/${allStatements.length}: ${preview}`);

      try {
        await db.execute(stmt);
        console.log(`   ✅ Success\n`);
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message && error.message.includes('already exists')) {
          console.log(`   ⏭️  Skipped (already exists)\n`);
        } else {
          console.error(`   ❌ Failed on statement:\n${stmt}\n`);
          throw error;
        }
      }
    }

    console.log('✅ Migration completed successfully!\n');

    // Verify tables
    const tables = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    console.log('📊 Created tables:');
    tables.rows.forEach((row: any) => {
      console.log('   -', row.name);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
