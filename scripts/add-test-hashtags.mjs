import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Get first girl
const girls = await db.execute('SELECT id, name, slug FROM girls LIMIT 1');
if (girls.rows.length > 0) {
  const girl = girls.rows[0];
  console.log('Found girl:', girl.name, 'slug:', girl.slug);

  // Add test hashtags
  const hashtags = JSON.stringify(['blondynky-praha', 'mlade-holky', 'stihla-postava', 'ceske-holky', 'gfe-praha']);
  await db.execute({
    sql: 'UPDATE girls SET hashtags = ? WHERE id = ?',
    args: [hashtags, girl.id]
  });

  console.log('Added hashtags to', girl.name);
  console.log('Visit: http://localhost:3000/cs/profily/' + girl.slug);
} else {
  console.log('No girls found');
}

process.exit(0);
