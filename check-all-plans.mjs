import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

try {
  // Všechny plány (i neaktivní)
  const allPlans = await client.execute('SELECT * FROM pricing_plans ORDER BY id ASC');
  console.log('\n=== VŠECHNY PLÁNY (včetně smazaných) ===');
  console.log(JSON.stringify(allPlans.rows, null, 2));
  
  // Aktivní plány
  const activePlans = await client.execute('SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY display_order ASC');
  console.log('\n=== AKTIVNÍ PLÁNY ===');
  console.log(JSON.stringify(activePlans.rows, null, 2));
} catch (error) {
  console.error('Error:', error);
}
