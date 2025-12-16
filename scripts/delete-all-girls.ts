import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('❌ Missing database credentials');
  process.exit(1);
}

const db = createClient({ url, authToken });

async function deleteAllGirls() {
  try {
    console.log('🗑️  Mazání všech holek z databáze...');

    // Smazat všechny holky
    const result = await db.execute('DELETE FROM girls');

    console.log(`✅ Smazáno ${result.rowsAffected} holek`);
    console.log('✅ Databáze je prázdná a připravená pro nové profily');

  } catch (error) {
    console.error('❌ Chyba při mazání holek:', error);
    throw error;
  }
}

deleteAllGirls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
