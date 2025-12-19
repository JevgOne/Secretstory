#!/usr/bin/env node

/**
 * Production Database Migration Script
 * Runs the vibe system migration on production Turso database
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrate() {
  console.log('🚀 Starting production migration...\n');

  try {
    // Check current schema
    console.log('1. Checking current reviews table schema...');
    const info = await db.execute('PRAGMA table_info(reviews)');
    const columns = info.rows.map((r) => r.name);
    console.log(`   Current columns: ${columns.join(', ')}`);

    // Add vibe column if not exists
    if (!columns.includes('vibe')) {
      console.log('\n2. Adding vibe column...');
      await db.execute('ALTER TABLE reviews ADD COLUMN vibe TEXT CHECK(vibe IN ("unforgettable", "magical", "great", "nice", "meh"))');
      console.log('   ✓ vibe column added');
    } else {
      console.log('\n2. vibe column already exists, skipping');
    }

    // Add tags column if not exists
    if (!columns.includes('tags')) {
      console.log('\n3. Adding tags column...');
      await db.execute('ALTER TABLE reviews ADD COLUMN tags TEXT DEFAULT "[]"');
      console.log('   ✓ tags column added');
    } else {
      console.log('\n3. tags column already exists, skipping');
    }

    // Add helpful_count column if not exists
    if (!columns.includes('helpful_count')) {
      console.log('\n4. Adding helpful_count column...');
      await db.execute('ALTER TABLE reviews ADD COLUMN helpful_count INTEGER DEFAULT 0');
      console.log('   ✓ helpful_count column added');
    } else {
      console.log('\n4. helpful_count column already exists, skipping');
    }

    // Check if review_helpful_votes table exists
    console.log('\n5. Creating review_helpful_votes table...');
    const tables = await db.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="review_helpful_votes"');

    if (tables.rows.length === 0) {
      await db.execute(`
        CREATE TABLE review_helpful_votes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          review_id INTEGER NOT NULL,
          voter_fingerprint TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
          UNIQUE(review_id, voter_fingerprint)
        )
      `);
      await db.execute('CREATE INDEX idx_review_helpful_votes_review_id ON review_helpful_votes(review_id)');
      await db.execute('CREATE INDEX idx_review_helpful_votes_fingerprint ON review_helpful_votes(voter_fingerprint)');
      console.log('   ✓ review_helpful_votes table created');
    } else {
      console.log('   review_helpful_votes table already exists, skipping');
    }

    // Migrate existing reviews (rating to vibe)
    console.log('\n6. Migrating existing star ratings to vibes...');
    const result = await db.execute(`
      UPDATE reviews
      SET vibe = CASE
        WHEN rating = 5 THEN 'unforgettable'
        WHEN rating = 4 THEN 'great'
        WHEN rating = 3 THEN 'nice'
        ELSE 'meh'
      END
      WHERE vibe IS NULL AND rating IS NOT NULL
    `);
    console.log(`   ✓ Migrated ${result.rowsAffected} reviews`);

    // Verify migration
    console.log('\n7. Verifying migration...');
    const finalInfo = await db.execute('PRAGMA table_info(reviews)');
    const finalColumns = finalInfo.rows.map((r) => r.name);

    const requiredColumns = ['vibe', 'tags', 'helpful_count'];
    const missing = requiredColumns.filter(col => !finalColumns.includes(col));

    if (missing.length === 0) {
      console.log('   ✓ All required columns present');
    } else {
      console.error(`   ✗ Missing columns: ${missing.join(', ')}`);
      process.exit(1);
    }

    const reviewCount = await db.execute('SELECT COUNT(*) as count FROM reviews WHERE vibe IS NOT NULL');
    console.log(`   ✓ ${reviewCount.rows[0].count} reviews with vibe data`);

    console.log('\n✅ Migration completed successfully!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
