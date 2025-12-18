import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('🚀 Adding test activities...\n');

try {
  // Get first 5 girls
  const girls = await db.execute({
    sql: "SELECT id, name, slug, primary_photo FROM girls WHERE status = 'active' LIMIT 5"
  });

  if (girls.rows.length === 0) {
    console.log('❌ No active girls found');
    process.exit(1);
  }

  const activityTypes = [
    { type: 'photo_added', title: 'Nové fotky', description: 'Přidala nové fotky do galerie' },
    { type: 'video_added', title: 'Nové video', description: 'Přidala nové video' },
    { type: 'story_added', title: 'Nová story', description: 'Přidala novou story' },
    { type: 'service_changed', title: 'Změna služeb', description: 'Aktualizovala seznam služeb' },
    { type: 'profile_updated', title: 'Aktualizace profilu', description: 'Aktualizovala svůj profil' }
  ];

  let added = 0;

  for (const girl of girls.rows) {
    // Add 2-4 activities per girl
    const activitiesCount = Math.floor(Math.random() * 3) + 2; // 2-4 activities

    for (let i = 0; i < activitiesCount; i++) {
      const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];

      // Random date in last 7 days
      const daysAgo = Math.floor(Math.random() * 7);

      await db.execute({
        sql: `INSERT INTO activity_log (
          girl_id, activity_type, title, description,
          media_url, is_visible,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-${daysAgo} days'))`,
        args: [
          girl.id,
          activity.type,
          activity.title,
          `${girl.name} ${activity.description.toLowerCase()}`,
          girl.primary_photo || null,
          1
        ]
      });

      added++;
      console.log(`✅ Added ${activity.type} for ${girl.name}`);
    }
  }

  console.log(`\n✨ Added ${added} test activities for ${girls.rows.length} girls`);

  // Show summary
  const total = await db.execute('SELECT COUNT(*) as count FROM activity_log');
  console.log(`\n📊 Total activities in database: ${total.rows[0].count}`);

  // Show recent activities
  const recent = await db.execute({
    sql: `SELECT a.*, g.name as girl_name
          FROM activity_log a
          JOIN girls g ON a.girl_id = g.id
          ORDER BY a.created_at DESC
          LIMIT 5`
  });

  console.log('\n📋 Recent activities:');
  recent.rows.forEach(act => {
    console.log(`  ${act.girl_name} - ${act.title} (${act.activity_type})`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('\n✅ Done!');
process.exit(0);
