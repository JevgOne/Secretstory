import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

try {
  const featuresResult = await client.execute('SELECT * FROM pricing_plan_features ORDER BY plan_id, display_order ASC');
  console.log('\n=== PLAN FEATURES ===');
  console.log(JSON.stringify(featuresResult.rows, null, 2));
  
  console.log('\n=== Features by plan ===');
  for (const row of featuresResult.rows) {
    console.log(`Plan ${row.plan_id}: ${row.feature_cs}`);
  }
} catch (error) {
  console.error('Error:', error);
}
