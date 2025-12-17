import { createClient } from '@libsql/client';

async function main() {
  const db = createClient({
    url: process.env.DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const result = await db.execute('SELECT id, name, slug, is_new, status FROM girls WHERE status = \'active\' ORDER BY created_at DESC');
  console.log(JSON.stringify(result.rows, null, 2));
}

main().catch(console.error);
