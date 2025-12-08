import { db } from '../lib/db';

async function addPhotosColumn() {
  console.log('Starting migration: Add photos column to girls table...\n');

  try {
    // Check if photos column already exists
    const checkResult = await db.execute({
      sql: `SELECT sql FROM sqlite_master WHERE type='table' AND name='girls'`,
      args: []
    });

    if (checkResult.rows.length > 0) {
      const createTableSQL = checkResult.rows[0].sql as string;

      if (createTableSQL.includes('photos')) {
        console.log('✅ Column "photos" already exists in girls table. Skipping migration.');
        return;
      }
    }

    // Add photos column (JSON array of photo URLs)
    console.log('Adding photos column to girls table...');
    await db.execute({
      sql: 'ALTER TABLE girls ADD COLUMN photos TEXT',
      args: []
    });
    console.log('✅ Column "photos" added successfully');

    // Update schema-tables.sql file reference
    console.log('\n📋 Migration completed successfully!');
    console.log('\n⚠️  IMPORTANT: Update schema-tables.sql manually to add:');
    console.log('   photos TEXT, -- JSON array of photo URLs');
    console.log('   (after "location TEXT," on line 40)\n');

  } catch (error: any) {
    if (error.message && error.message.includes('duplicate column name')) {
      console.log('✅ Column "photos" already exists. Migration skipped.');
    } else {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  }
}

addPhotosColumn();
