import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testConnection() {
  console.log('🔄 Testing Turso database connection...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials in .env.local');
    process.exit(1);
  }

  console.log('📍 Database URL:', url);
  console.log('🔑 Auth Token:', authToken.substring(0, 20) + '...\n');

  try {
    const db = createClient({ url, authToken });

    // Test query
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('📊 Test query result:', result.rows);

    // Check existing tables
    const tables = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      ORDER BY name
    `);

    console.log('\n📋 Existing tables:');
    if (tables.rows.length === 0) {
      console.log('   No tables found - database is empty');
    } else {
      tables.rows.forEach((row: any) => {
        console.log('   -', row.name);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
