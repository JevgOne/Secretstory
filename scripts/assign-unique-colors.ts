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

const COLOR_PALETTE = [
  'pink', 'blue', 'purple', 'green', 'orange', 'cyan',
  'rose', 'amber', 'teal', 'indigo', 'lime', 'sky',
  'violet', 'fuchsia', 'emerald', 'red'
];

async function assignUniqueColors() {
  try {
    console.log('Assigning unique colors to Rebecca and Lucka...\n');

    // Get all girls
    const girlsResult = await db.execute('SELECT id, name, color FROM girls WHERE status != \'inactive\' ORDER BY id');
    const girls = girlsResult.rows as unknown as Array<{id: number, name: string, color: string | null}>;

    // Find Rebecca and Lucka
    const rebecca = girls.find(g => g.name.toLowerCase().includes('rebecca'));
    const lucka = girls.find(g => g.name.toLowerCase().includes('lucka'));

    if (!rebecca || !lucka) {
      console.log('Could not find Rebecca or Lucka in database');
      return;
    }

    console.log(`Current state:`);
    console.log(`  Rebecca (ID: ${rebecca.id}): ${rebecca.color || 'NULL'}`);
    console.log(`  Lucka (ID: ${lucka.id}): ${lucka.color || 'NULL'}`);

    // Get used colors (excluding Rebecca and Lucka)
    const usedColors = girls
      .filter(g => g.id !== rebecca.id && g.id !== lucka.id)
      .map(g => g.color)
      .filter(c => c !== null && c !== undefined && c !== '');

    console.log(`\nColors used by other girls: ${usedColors.join(', ')}`);

    // Find available colors
    const availableColors = COLOR_PALETTE.filter(c => !usedColors.includes(c));
    console.log(`Available unique colors: ${availableColors.join(', ')}\n`);

    const updates: Array<{girl: string, id: number, oldColor: string | null, newColor: string}> = [];

    // Assign unique color to Rebecca
    if (availableColors.length > 0) {
      const rebeccaNewColor = availableColors[0];
      console.log(`→ Assigning "${rebeccaNewColor}" to Rebecca (ID: ${rebecca.id})`);
      await db.execute({
        sql: 'UPDATE girls SET color = ? WHERE id = ?',
        args: [rebeccaNewColor, rebecca.id]
      });
      updates.push({
        girl: 'Rebecca',
        id: rebecca.id,
        oldColor: rebecca.color,
        newColor: rebeccaNewColor
      });
      availableColors.shift(); // Remove used color
    }

    // Assign unique color to Lucka
    if (availableColors.length > 0) {
      const luckaNewColor = availableColors[0];
      console.log(`→ Assigning "${luckaNewColor}" to Lucka (ID: ${lucka.id})`);
      await db.execute({
        sql: 'UPDATE girls SET color = ? WHERE id = ?',
        args: [luckaNewColor, lucka.id]
      });
      updates.push({
        girl: 'Lucka',
        id: lucka.id,
        oldColor: lucka.color,
        newColor: luckaNewColor
      });
    }

    // Verify updates
    if (updates.length > 0) {
      console.log('\n✓ Colors updated successfully!');
      console.log('\nChanges made:');
      updates.forEach(u => {
        console.log(`  - ${u.girl} (ID: ${u.id}): ${u.oldColor || 'NULL'} → ${u.newColor}`);
      });

      // Verify in database
      console.log('\nVerifying updates in database...');
      for (const update of updates) {
        const result = await db.execute({
          sql: 'SELECT name, color FROM girls WHERE id = ?',
          args: [update.id]
        });
        if (result.rows.length > 0) {
          const girl = result.rows[0] as unknown as {name: string, color: string};
          console.log(`  ✓ ${girl.name}: color = "${girl.color}"`);
        }
      }
    }

  } catch (error) {
    console.error('Error assigning unique colors:', error);
    throw error;
  }
}

assignUniqueColors()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error);
    process.exit(1);
  });
