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

async function fixGirlColors() {
  try {
    // Get all girls
    console.log('Fetching all girls...');
    const girlsResult = await db.execute('SELECT id, name, color FROM girls WHERE status != \'inactive\'');
    const girls = girlsResult.rows as unknown as Array<{id: number, name: string, color: string | null}>;

    console.log(`\nFound ${girls.length} active girls`);

    // Find Rebecca and Lucka
    const rebecca = girls.find(g => g.name.toLowerCase().includes('rebecca'));
    const lucka = girls.find(g => g.name.toLowerCase().includes('lucka') || g.name.toLowerCase().includes('lůčka'));

    if (!rebecca) {
      console.log('⚠ Rebecca not found in database');
    } else {
      console.log(`\nRebecca: ID=${rebecca.id}, Current Color=${rebecca.color || 'NULL'}`);
    }

    if (!lucka) {
      console.log('⚠ Lucka not found in database');
    } else {
      console.log(`Lucka: ID=${lucka.id}, Current Color=${lucka.color || 'NULL'}`);
    }

    // Get used colors
    const usedColors = girls
      .map(g => g.color)
      .filter(c => c !== null && c !== undefined && c !== '');

    console.log('\nUsed colors:', usedColors);

    // Find available colors
    const availableColors = COLOR_PALETTE.filter(c => !usedColors.includes(c));
    console.log('Available colors:', availableColors);

    // Assign colors
    const updates: Array<{girl: string, id: number, color: string}> = [];

    if (rebecca && (!rebecca.color || rebecca.color === '')) {
      const rebeccaColor = availableColors[0] || 'pink';
      console.log(`\n→ Assigning "${rebeccaColor}" to Rebecca (ID: ${rebecca.id})`);
      await db.execute({
        sql: 'UPDATE girls SET color = ? WHERE id = ?',
        args: [rebeccaColor, rebecca.id]
      });
      updates.push({girl: 'Rebecca', id: rebecca.id, color: rebeccaColor});
      availableColors.shift(); // Remove used color
    }

    if (lucka && (!lucka.color || lucka.color === '')) {
      const luckaColor = availableColors[0] || 'blue';
      console.log(`→ Assigning "${luckaColor}" to Lucka (ID: ${lucka.id})`);
      await db.execute({
        sql: 'UPDATE girls SET color = ? WHERE id = ?',
        args: [luckaColor, lucka.id]
      });
      updates.push({girl: 'Lucka', id: lucka.id, color: luckaColor});
    }

    // Verify updates
    if (updates.length > 0) {
      console.log('\n✓ Colors assigned successfully!');
      console.log('\nUpdates made:');
      updates.forEach(u => {
        console.log(`  - ${u.girl} (ID: ${u.id}): ${u.color}`);
      });

      // Verify in database
      console.log('\nVerifying updates...');
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
    } else {
      console.log('\n✓ No updates needed - all girls already have colors assigned');
    }

  } catch (error) {
    console.error('Error fixing girl colors:', error);
    throw error;
  }
}

fixGirlColors()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error);
    process.exit(1);
  });
