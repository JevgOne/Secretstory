import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@libsql/client';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Create DB client directly
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined');
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkGirlColors() {
  try {
    // Get all girls with their colors
    console.log('Fetching all girls with colors...\n');
    const girlsResult = await db.execute('SELECT id, name, color, status FROM girls ORDER BY name');
    const girls = girlsResult.rows as unknown as Array<{id: number, name: string, color: string | null, status: string}>;

    console.log('All girls in database:');
    console.log('═══════════════════════════════════════════');

    girls.forEach(girl => {
      const colorDisplay = girl.color || 'NULL';
      const statusDisplay = girl.status || 'unknown';
      console.log(`ID: ${String(girl.id).padStart(2)} | ${girl.name.padEnd(20)} | Color: ${colorDisplay.padEnd(10)} | Status: ${statusDisplay}`);
    });

    console.log('═══════════════════════════════════════════\n');

    // Find girls without colors
    const girlsWithoutColors = girls.filter(g => !g.color || g.color === '' || g.color === 'NULL');

    if (girlsWithoutColors.length > 0) {
      console.log('Girls WITHOUT colors assigned:');
      girlsWithoutColors.forEach(girl => {
        console.log(`  - ${girl.name} (ID: ${girl.id}, Status: ${girl.status})`);
      });
    } else {
      console.log('✓ All girls have colors assigned');
    }

    // Check for Rebecca and Lucka specifically
    console.log('\n--- Checking Rebecca and Lucka specifically ---');
    const rebecca = girls.find(g => g.name.toLowerCase().includes('rebecca'));
    const lucka = girls.find(g => g.name.toLowerCase().includes('lucka') || g.name.toLowerCase().includes('lůčka'));

    if (rebecca) {
      console.log(`Rebecca (ID: ${rebecca.id}): color = "${rebecca.color || 'NULL'}"`);
    } else {
      console.log('Rebecca NOT FOUND in database');
    }

    if (lucka) {
      console.log(`Lucka (ID: ${lucka.id}): color = "${lucka.color || 'NULL'}"`);
    } else {
      console.log('Lucka NOT FOUND in database');
    }

  } catch (error) {
    console.error('Error checking girl colors:', error);
    throw error;
  }
}

checkGirlColors()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error);
    process.exit(1);
  });
