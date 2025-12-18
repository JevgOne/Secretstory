import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('🚀 Adding test stories...\n');

try {
  // Get first 3 girls
  const girls = await db.execute({
    sql: "SELECT id, name, slug FROM girls WHERE status = 'active' LIMIT 3"
  });

  if (girls.rows.length === 0) {
    console.log('❌ No active girls found');
    process.exit(1);
  }

  let added = 0;

  for (const girl of girls.rows) {
    // Add 2-3 stories per girl
    const storiesCount = Math.floor(Math.random() * 2) + 2; // 2-3 stories

    for (let i = 0; i < storiesCount; i++) {
      const mediaType = i % 2 === 0 ? 'image' : 'video';
      const mediaUrl = mediaType === 'image'
        ? `https://picsum.photos/seed/${girl.id}-${i}/1080/1920`
        : `https://www.w3schools.com/html/mov_bbb.mp4`;

      await db.execute({
        sql: `INSERT INTO stories (
          girl_id, media_url, media_type, thumbnail_url,
          duration, order_index, is_active, views_count,
          expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+24 hours'))`,
        args: [
          girl.id,
          mediaUrl,
          mediaType,
          mediaType === 'video' ? `https://picsum.photos/seed/${girl.id}-${i}-thumb/1080/1920` : mediaUrl,
          mediaType === 'image' ? 5 : 10,
          i,
          1,
          Math.floor(Math.random() * 50),
        ]
      });

      added++;
      console.log(`✅ Added ${mediaType} story for ${girl.name}`);
    }
  }

  console.log(`\n✨ Added ${added} test stories for ${girls.rows.length} girls`);

  // Show summary
  const total = await db.execute('SELECT COUNT(*) as count FROM stories');
  console.log(`\n📊 Total stories in database: ${total.rows[0].count}`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('\n✅ Done!');
process.exit(0);
