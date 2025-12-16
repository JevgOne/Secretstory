import 'dotenv/config';
import { db } from '../lib/db';

async function migrateGirlsTable() {
  console.log('Starting migration for girls table...');

  const migrations = [
    // Tattoo and piercing fields
    {
      sql: 'ALTER TABLE girls ADD COLUMN tattoo_percentage INTEGER DEFAULT 0',
      name: 'tattoo_percentage'
    },
    {
      sql: 'ALTER TABLE girls ADD COLUMN tattoo_description TEXT',
      name: 'tattoo_description'
    },
    {
      sql: 'ALTER TABLE girls ADD COLUMN piercing BOOLEAN DEFAULT 0',
      name: 'piercing'
    },
    {
      sql: 'ALTER TABLE girls ADD COLUMN piercing_description TEXT',
      name: 'piercing_description'
    },
    // Language support
    {
      sql: 'ALTER TABLE girls ADD COLUMN languages TEXT',
      name: 'languages'
    },
    // Badge and featured fields
    {
      sql: 'ALTER TABLE girls ADD COLUMN is_new BOOLEAN DEFAULT 0',
      name: 'is_new'
    },
    {
      sql: 'ALTER TABLE girls ADD COLUMN is_top BOOLEAN DEFAULT 0',
      name: 'is_top'
    },
    {
      sql: 'ALTER TABLE girls ADD COLUMN is_featured BOOLEAN DEFAULT 0',
      name: 'is_featured'
    },
    {
      sql: 'ALTER TABLE girls ADD COLUMN featured_section TEXT',
      name: 'featured_section'
    },
    {
      sql: 'ALTER TABLE girls ADD COLUMN badge_type TEXT',
      name: 'badge_type'
    }
  ];

  for (const migration of migrations) {
    try {
      await db.execute(migration.sql);
      console.log(`✅ Added column: ${migration.name}`);
    } catch (error: any) {
      if (error.message?.includes('duplicate column name')) {
        console.log(`⏭️  Column already exists: ${migration.name}`);
      } else {
        console.error(`❌ Error adding column ${migration.name}:`, error.message);
      }
    }
  }

  console.log('\nMigration completed!');

  // Verify table structure
  console.log('\nVerifying table structure...');
  const result = await db.execute('PRAGMA table_info(girls)');
  console.log('\nGirls table columns:');
  result.rows.forEach((row: any) => {
    console.log(`- ${row.name} (${row.type})`);
  });
}

migrateGirlsTable().catch(console.error);
