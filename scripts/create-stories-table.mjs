import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('🚀 Creating stories table...\n');

try {
  // Create stories table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      girl_id INTEGER NOT NULL,
      media_url TEXT NOT NULL,
      media_type TEXT NOT NULL CHECK(media_type IN ('image', 'video')),
      thumbnail_url TEXT,
      duration INTEGER DEFAULT 5,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      views_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Stories table created successfully!');

  // Create indexes for better performance
  await db.execute('CREATE INDEX IF NOT EXISTS idx_stories_girl_id ON stories(girl_id)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_stories_active ON stories(is_active)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_stories_expires ON stories(expires_at)');

  console.log('✅ Indexes created successfully!');

  // Check table structure
  const info = await db.execute('PRAGMA table_info(stories)');
  console.log('\n📋 Stories table structure:');
  info.rows.forEach(col => {
    console.log(`  ${col.name} (${col.type})`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('\n✅ Done!');
process.exit(0);
