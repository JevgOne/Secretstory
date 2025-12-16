import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function verify() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  });

  const result = await db.execute(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name LIKE 'blog%'
    ORDER BY name
  `);

  console.log('Blog tables:', result.rows);
}

verify().catch(console.error);
