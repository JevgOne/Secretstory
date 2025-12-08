import { db } from '../lib/db';

async function migrate() {
  console.log('Starting migration: Adding schedule, multilingual descriptions, and services tables...\n');

  try {
    // Add schedule column to girls table
    console.log('Adding schedule column...');
    try {
      await db.execute(`
        ALTER TABLE girls ADD COLUMN schedule TEXT
      `);
      console.log('✅ Added schedule column');
    } catch (error: any) {
      if (error.message?.includes('duplicate column')) {
        console.log('⚠️  schedule column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Add description_cs column
    console.log('Adding description_cs column...');
    try {
      await db.execute(`
        ALTER TABLE girls ADD COLUMN description_cs TEXT
      `);
      console.log('✅ Added description_cs column');
    } catch (error: any) {
      if (error.message?.includes('duplicate column')) {
        console.log('⚠️  description_cs column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Add description_en column
    console.log('Adding description_en column...');
    try {
      await db.execute(`
        ALTER TABLE girls ADD COLUMN description_en TEXT
      `);
      console.log('✅ Added description_en column');
    } catch (error: any) {
      if (error.message?.includes('duplicate column')) {
        console.log('⚠️  description_en column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Add description_de column
    console.log('Adding description_de column...');
    try {
      await db.execute(`
        ALTER TABLE girls ADD COLUMN description_de TEXT
      `);
      console.log('✅ Added description_de column');
    } catch (error: any) {
      if (error.message?.includes('duplicate column')) {
        console.log('⚠️  description_de column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Add description_uk column
    console.log('Adding description_uk column...');
    try {
      await db.execute(`
        ALTER TABLE girls ADD COLUMN description_uk TEXT
      `);
      console.log('✅ Added description_uk column');
    } catch (error: any) {
      if (error.message?.includes('duplicate column')) {
        console.log('⚠️  description_uk column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Add location column
    console.log('Adding location column...');
    try {
      await db.execute(`
        ALTER TABLE girls ADD COLUMN location TEXT
      `);
      console.log('✅ Added location column');
    } catch (error: any) {
      if (error.message?.includes('duplicate column')) {
        console.log('⚠️  location column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Create services table
    console.log('\nCreating services table...');
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name_cs TEXT NOT NULL,
          name_en TEXT NOT NULL,
          name_de TEXT NOT NULL,
          name_uk TEXT NOT NULL,
          category TEXT CHECK(category IN ('basic', 'oral', 'anal', 'extra', 'duo')),
          duration INTEGER,
          is_active BOOLEAN DEFAULT 1,
          display_order INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Created services table');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️  services table already exists, skipping');
      } else {
        throw error;
      }
    }

    // Create girl_services junction table
    console.log('Creating girl_services junction table...');
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS girl_services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          girl_id INTEGER NOT NULL,
          service_id INTEGER NOT NULL,
          is_included BOOLEAN DEFAULT 1,
          extra_price INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
          FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
          UNIQUE(girl_id, service_id)
        )
      `);
      console.log('✅ Created girl_services table');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️  girl_services table already exists, skipping');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
