import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

try {
  // Nejprve deaktivuj všechny plány
  await client.execute('UPDATE pricing_plans SET is_active = 0');
  console.log('✓ Všechny plány deaktivovány');
  
  // Reaktivuj původní 3 plány
  await client.execute('UPDATE pricing_plans SET is_active = 1 WHERE id IN (1, 2, 3)');
  console.log('✓ Plány 1, 2, 3 reaktivovány');
  
  // Zkontroluj výsledek
  const result = await client.execute('SELECT id, title_cs, duration, price, is_popular, display_order, is_active FROM pricing_plans WHERE is_active = 1 ORDER BY display_order ASC');
  console.log('\n=== AKTIVNÍ PLÁNY PO REAKTIVACI ===');
  console.table(result.rows);
} catch (error) {
  console.error('Error:', error);
}
