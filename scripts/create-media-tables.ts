import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function createMediaTables() {
  console.log('Creating girl_photos and girl_videos tables...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  });

  try {
    // Create girl_photos table
    console.log('Creating girl_photos table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS girl_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        girl_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        display_order INTEGER DEFAULT 0,
        is_primary BOOLEAN DEFAULT 0,
        width INTEGER,
        height INTEGER,
        file_size INTEGER,
        mime_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ girl_photos table created');

    // Create girl_videos table
    console.log('Creating girl_videos table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS girl_videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        girl_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        display_order INTEGER DEFAULT 0,
        duration INTEGER,
        width INTEGER,
        height INTEGER,
        file_size INTEGER,
        mime_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ girl_videos table created');

    // Create indexes
    console.log('Creating indexes...');

    await db.execute('CREATE INDEX IF NOT EXISTS idx_girl_photos_girl_id ON girl_photos(girl_id)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_girl_photos_is_primary ON girl_photos(is_primary)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_girl_photos_display_order ON girl_photos(display_order)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_girl_videos_girl_id ON girl_videos(girl_id)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_girl_videos_display_order ON girl_videos(display_order)');

    console.log('✓ Indexes created');

    console.log('\n✅ Media tables created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createMediaTables();
