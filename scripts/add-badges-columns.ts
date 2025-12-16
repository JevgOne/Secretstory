/**
 * Migration: Add badges columns to girls table
 * Adds: is_new, is_top, is_featured, featured_section, badge_type
 */

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
  console.log('🚀 Starting migration: Add badges columns...\n');

  try {
    // Check if columns already exist
    const tableInfo = await db.execute("PRAGMA table_info(girls);");
    const columns = tableInfo.rows.map((row: any) => row.name);

    console.log('📋 Current columns:', columns);

    // Add columns if they don't exist
    const columnsToAdd = [
      { name: 'is_new', sql: 'ALTER TABLE girls ADD COLUMN is_new BOOLEAN DEFAULT 0;' },
      { name: 'is_top', sql: 'ALTER TABLE girls ADD COLUMN is_top BOOLEAN DEFAULT 0;' },
      { name: 'is_featured', sql: 'ALTER TABLE girls ADD COLUMN is_featured BOOLEAN DEFAULT 0;' },
      { name: 'featured_section', sql: 'ALTER TABLE girls ADD COLUMN featured_section TEXT;' },
      { name: 'badge_type', sql: 'ALTER TABLE girls ADD COLUMN badge_type TEXT;' },
    ];

    for (const col of columnsToAdd) {
      if (!columns.includes(col.name)) {
        console.log(`➕ Adding column: ${col.name}`);
        await db.execute(col.sql);
      } else {
        console.log(`✓ Column ${col.name} already exists`);
      }
    }

    // Create indexes
    console.log('\n📊 Creating indexes...');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_girls_featured ON girls(is_featured);');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_girls_badge_type ON girls(badge_type);');
    console.log('✓ Indexes created');

    // Set initial badge data based on existing logic
    console.log('\n🏷️  Setting initial badge data...');

    // Set girl with id=1 as "new"
    await db.execute({
      sql: "UPDATE girls SET is_new = 1, badge_type = 'new' WHERE id = 1",
      args: []
    });

    // Set girl with id=2 as "top"
    await db.execute({
      sql: "UPDATE girls SET is_top = 1, badge_type = 'top' WHERE id = 2",
      args: []
    });

    // Set girl with id=3 as "recommended"
    await db.execute({
      sql: "UPDATE girls SET badge_type = 'recommended' WHERE id = 3",
      args: []
    });

    console.log('✓ Initial badges set');

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const result = await db.execute({
      sql: 'SELECT id, name, is_new, is_top, is_featured, badge_type, featured_section FROM girls LIMIT 5',
      args: []
    });

    console.log('\n📊 Sample data:');
    console.table(result.rows);

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
