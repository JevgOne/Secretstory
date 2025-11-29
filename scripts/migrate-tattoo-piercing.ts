import { db } from '../lib/db';

async function migrate() {
  console.log('Starting migration: Adding tattoo, piercing, and languages fields...');

  try {
    // Add tattoo_percentage
    await db.execute(`
      ALTER TABLE girls ADD COLUMN tattoo_percentage INTEGER DEFAULT 0
    `);
    console.log('✅ Added tattoo_percentage column');

    // Add tattoo_description
    await db.execute(`
      ALTER TABLE girls ADD COLUMN tattoo_description TEXT
    `);
    console.log('✅ Added tattoo_description column');

    // Add piercing
    await db.execute(`
      ALTER TABLE girls ADD COLUMN piercing INTEGER DEFAULT 0
    `);
    console.log('✅ Added piercing column');

    // Add piercing_description
    await db.execute(`
      ALTER TABLE girls ADD COLUMN piercing_description TEXT
    `);
    console.log('✅ Added piercing_description column');

    // Add languages
    await db.execute(`
      ALTER TABLE girls ADD COLUMN languages TEXT
    `);
    console.log('✅ Added languages column');

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
