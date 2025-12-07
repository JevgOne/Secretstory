import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function verifySchema() {
  console.log('🔍 Verifying Turso database schema...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials in .env.local');
    process.exit(1);
  }

  try {
    const db = createClient({ url, authToken });

    // Expected tables
    const expectedTables = ['users', 'girls', 'bookings', 'reviews', 'notifications'];

    // Expected indexes
    const expectedIndexes = [
      'idx_users_email',
      'idx_users_role',
      'idx_girls_status',
      'idx_girls_slug',
      'idx_bookings_girl_id',
      'idx_bookings_date',
      'idx_bookings_status',
      'idx_reviews_girl_id',
      'idx_reviews_status',
      'idx_notifications_user_id',
      'idx_notifications_read'
    ];

    // Check tables
    const tablesResult = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    const existingTables = tablesResult.rows.map((row: any) => row.name);

    console.log('📋 Tables Status:');
    let allTablesExist = true;
    expectedTables.forEach(table => {
      const exists = existingTables.includes(table);
      console.log(`   ${exists ? '✅' : '❌'} ${table}`);
      if (!exists) allTablesExist = false;
    });

    // Check indexes
    const indexesResult = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='index' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    const existingIndexes = indexesResult.rows.map((row: any) => row.name);

    console.log('\n🔍 Indexes Status:');
    let allIndexesExist = true;
    expectedIndexes.forEach(index => {
      const exists = existingIndexes.includes(index);
      console.log(`   ${exists ? '✅' : '❌'} ${index}`);
      if (!exists) allIndexesExist = false;
    });

    // Check table schemas - verify key columns exist
    console.log('\n🏗️  Table Structure Verification:');

    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        const schemaResult = await db.execute(`PRAGMA table_info(${table})`);
        const columns = schemaResult.rows.map((row: any) => row.name);
        console.log(`   ✅ ${table}: ${columns.length} columns (${columns.join(', ')})`);
      }
    }

    // Count records in each table
    console.log('\n📊 Data Summary:');
    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        const countResult = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const count = countResult.rows[0].count;
        console.log(`   ${table}: ${count} records`);
      }
    }

    // Final verdict
    console.log('\n' + '='.repeat(60));
    if (allTablesExist && allIndexesExist) {
      console.log('✅ Schema verification PASSED - Database is fully set up!');
      process.exit(0);
    } else {
      console.log('⚠️  Schema verification INCOMPLETE:');
      if (!allTablesExist) console.log('   - Some tables are missing');
      if (!allIndexesExist) console.log('   - Some indexes are missing');
      console.log('\n💡 Run migration script to complete setup: npm run migrate-db');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifySchema();
