#!/usr/bin/env node

/**
 * Stories Table Migration Script
 * Ensures all required columns exist and fixes NULL values
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrate() {
  console.log('🚀 Starting stories table migration...\n');

  try {
    // Check current schema
    console.log('1. Checking current stories table schema...');
    const info = await db.execute('PRAGMA table_info(stories)');
    const columns = info.rows.map((r) => r.name);
    console.log(`   Current columns: ${columns.join(', ')}`);

    // Add is_active column if not exists
    if (!columns.includes('is_active')) {
      console.log('\n2. Adding is_active column...');
      await db.execute('ALTER TABLE stories ADD COLUMN is_active INTEGER DEFAULT 1');
      console.log('   ✓ is_active column added');
    } else {
      console.log('\n2. is_active column already exists');
    }

    // Add views_count column if not exists
    if (!columns.includes('views_count')) {
      console.log('\n3. Adding views_count column...');
      await db.execute('ALTER TABLE stories ADD COLUMN views_count INTEGER DEFAULT 0');
      console.log('   ✓ views_count column added');
    } else {
      console.log('\n3. views_count column already exists');
    }

    // Add created_at column if not exists
    if (!columns.includes('created_at')) {
      console.log('\n4. Adding created_at column...');
      await db.execute('ALTER TABLE stories ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
      console.log('   ✓ created_at column added');
    } else {
      console.log('\n4. created_at column already exists');
    }

    // Fix NULL values
    console.log('\n5. Fixing NULL values...');

    const isActiveResult = await db.execute(`UPDATE stories SET is_active = 1 WHERE is_active IS NULL`);
    console.log(`   ✓ Fixed ${isActiveResult.rowsAffected} stories with NULL is_active`);

    const viewsResult = await db.execute(`UPDATE stories SET views_count = 0 WHERE views_count IS NULL`);
    console.log(`   ✓ Fixed ${viewsResult.rowsAffected} stories with NULL views_count`);

    const createdAtResult = await db.execute(`UPDATE stories SET created_at = datetime('now') WHERE created_at IS NULL`);
    console.log(`   ✓ Fixed ${createdAtResult.rowsAffected} stories with NULL created_at`);

    // Verify migration
    console.log('\n6. Verifying migration...');
    const finalInfo = await db.execute('PRAGMA table_info(stories)');
    const finalColumns = finalInfo.rows.map((r) => r.name);

    const requiredColumns = ['is_active', 'views_count', 'created_at'];
    const missing = requiredColumns.filter(col => !finalColumns.includes(col));

    if (missing.length === 0) {
      console.log('   ✓ All required columns present');
    } else {
      console.error(`   ✗ Missing columns: ${missing.join(', ')}`);
      process.exit(1);
    }

    const storyCount = await db.execute('SELECT COUNT(*) as count FROM stories WHERE is_active = 1');
    console.log(`   ✓ ${storyCount.rows[0].count} active stories`);

    console.log('\n✅ Stories migration completed successfully!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
