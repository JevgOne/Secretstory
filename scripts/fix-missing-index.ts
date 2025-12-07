import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function fixMissingIndex() {
  console.log('🔧 Fixing missing index...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials in .env.local');
    process.exit(1);
  }

  try {
    const db = createClient({ url, authToken });

    // Create the missing index
    console.log('Creating idx_users_email...');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    console.log('✅ Index created successfully!');

    // Verify
    const indexesResult = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='index' AND name='idx_users_email'
    `);

    if (indexesResult.rows.length > 0) {
      console.log('✅ Verification: idx_users_email exists');
    } else {
      console.log('⚠️  Warning: Could not verify index creation');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create index:', error);
    process.exit(1);
  }
}

fixMissingIndex();
