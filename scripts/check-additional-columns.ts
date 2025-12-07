import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function checkColumns() {
  console.log('🔍 Checking for additional columns in girls table...\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials');
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  try {
    // Get girls table schema
    const schemaResult = await db.execute('PRAGMA table_info(girls)');
    const columns = schemaResult.rows.map((row: any) => row.name);

    console.log('📋 Current columns in girls table:');
    schemaResult.rows.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.name} (${row.type}${row.dflt_value ? `, default: ${row.dflt_value}` : ''})`);
    });

    // Check for additional fields
    const additionalFields = ['tattoo_percentage', 'tattoo_description', 'piercing', 'piercing_description', 'languages'];

    console.log('\n🔎 Additional fields status:');
    let allExist = true;
    additionalFields.forEach(field => {
      const exists = columns.includes(field);
      console.log(`   ${exists ? '✅' : '❌'} ${field}`);
      if (!exists) allExist = false;
    });

    if (allExist) {
      console.log('\n✅ All additional fields exist!');
    } else {
      console.log('\n⚠️  Some additional fields are missing.');
      console.log('💡 Run: npx tsx scripts/migrate-tattoo-piercing.ts');
    }

    process.exit(allExist ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkColumns();
