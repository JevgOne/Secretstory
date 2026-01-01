import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

try {
  const plansResult = await client.execute('SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY display_order ASC');
  console.log('\n=== PRICING PLANS ===');
  console.log(JSON.stringify(plansResult.rows, null, 2));
  
  const extrasResult = await client.execute('SELECT * FROM pricing_extras WHERE is_active = 1 ORDER BY display_order ASC');
  console.log('\n=== PRICING EXTRAS ===');
  console.log(JSON.stringify(extrasResult.rows, null, 2));
} catch (error) {
  console.error('Error:', error);
}
