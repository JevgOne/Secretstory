import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Get Niky's ID and services
const girlResult = await db.execute('SELECT id, name, services FROM girls WHERE name LIKE "%Niky%" LIMIT 1');
const niky = girlResult.rows[0];
console.log('Niky:', niky);
console.log('\nNiky services:', niky.services);
