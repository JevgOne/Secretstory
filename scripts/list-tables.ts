import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function listTables() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  });

  const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('Existing tables:');
  result.rows.forEach(row => console.log(' -', row.name));
}

listTables();
