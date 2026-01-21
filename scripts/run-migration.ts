import { config } from 'dotenv';
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local first, then .env
config({ path: '.env.local' });
config({ path: '.env' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function runMigration(filename: string) {
  try {
    const sqlPath = join(process.cwd(), 'migrations', filename);
    const sql = readFileSync(sqlPath, 'utf-8');

    // Remove single-line comments but keep the content
    const cleanedSql = sql
      .split('\n')
      .map(line => {
        // Remove full-line comments
        if (line.trim().startsWith('--')) return '';
        // Remove inline comments
        const commentIndex = line.indexOf('--');
        if (commentIndex > 0) return line.substring(0, commentIndex);
        return line;
      })
      .join('\n');

    // Split by semicolons and filter out empty statements
    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Running migration: ${filename}`);
    console.log(`Found ${statements.length} statements to execute`);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 60)}...`);
      await db.execute(statement);
      console.log('OK');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Get migration file from command line args
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: npx tsx scripts/run-migration.ts <migration-file.sql>');
  process.exit(1);
}

runMigration(migrationFile);
