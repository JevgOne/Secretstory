import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('🚀 Creating activity_log table...\n');

try {
  // Create activity_log table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      girl_id INTEGER NOT NULL,
      activity_type TEXT NOT NULL CHECK(activity_type IN ('photo_added', 'video_added', 'story_added', 'service_changed', 'profile_updated', 'status_changed')),
      title TEXT NOT NULL,
      description TEXT,
      metadata TEXT,
      media_url TEXT,
      is_visible INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Activity_log table created successfully!');

  // Create indexes for better performance
  await db.execute('CREATE INDEX IF NOT EXISTS idx_activity_girl_id ON activity_log(girl_id)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_activity_type ON activity_log(activity_type)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_activity_visible ON activity_log(is_visible)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC)');

  console.log('✅ Indexes created successfully!');

  // Check table structure
  const info = await db.execute('PRAGMA table_info(activity_log)');
  console.log('\n📋 Activity_log table structure:');
  info.rows.forEach(col => {
    console.log(`  ${col.name} (${col.type})`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('\n✅ Done!');
process.exit(0);
