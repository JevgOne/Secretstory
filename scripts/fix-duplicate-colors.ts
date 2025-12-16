import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || ''
});

// Available colors (16 unique colors for calendar)
const AVAILABLE_COLORS = [
  'pink', 'blue', 'purple', 'green', 'orange', 'red', 'cyan', 'amber',
  'rose', 'indigo', 'teal', 'lime', 'yellow', 'violet', 'fuchsia', 'emerald'
];

async function fixDuplicateColors() {
  console.log('🔍 Checking for duplicate colors...\n');

  // Get all active girls with their colors
  const result = await db.execute('SELECT id, name, color FROM girls WHERE status = "active" ORDER BY id');

  const girls = result.rows as unknown as Array<{ id: number; name: string; color: string | null }>;
  const usedColors = new Set<string>();
  const updates: Array<{ id: number; name: string; newColor: string }> = [];

  for (const girl of girls) {
    if (!girl.color || usedColors.has(girl.color)) {
      // Find first available color
      const availableColor = AVAILABLE_COLORS.find(c => !usedColors.has(c));
      if (availableColor) {
        updates.push({ id: girl.id, name: girl.name, newColor: availableColor });
        usedColors.add(availableColor);
        console.log(`❌ ${girl.name} (ID: ${girl.id}): ${girl.color || 'MISSING'} → ${availableColor}`);
      }
    } else {
      usedColors.add(girl.color);
      console.log(`✅ ${girl.name} (ID: ${girl.id}): ${girl.color}`);
    }
  }

  if (updates.length === 0) {
    console.log('\n✨ All colors are unique!');
    return;
  }

  console.log(`\n🔧 Updating ${updates.length} girls...\n`);

  for (const update of updates) {
    await db.execute({
      sql: 'UPDATE girls SET color = ? WHERE id = ?',
      args: [update.newColor, update.id]
    });
    console.log(`✓ Updated ${update.name} to ${update.newColor}`);
  }

  console.log('\n✅ Done!');
}

fixDuplicateColors().catch(console.error);
