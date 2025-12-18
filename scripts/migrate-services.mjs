import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Mapping from old JSON slugs to new service slugs in database
// Only includes services that actually exist in the services table
const SERVICE_MAPPING = {
  'classic': 'klasicky-sex',
  'blowjob_condom': 'oral-s-ochranou',
  'blowjob_no_condom': 'oral-bez-ochrany',
  'massage': 'eroticka-masaz',
  '69': 'poloha-69',
  'cum_on_body': 'strikani-na-telo',
  'cum_on_face': 'strikani-do-obliceje',
  'cum_in_mouth': 'strikani-do-ust',
  'erotic_massage': 'eroticka-masaz',
  'prostate_massage': 'prostatova-masaz',
  'foot_fetish': 'nohy-fetis',
  'role_play': 'hrani-roli',
  'piss': 'zlaty-dest',
  'piss_passive': 'zlaty-dest',
  'piss_active': 'zlaty-dest',
  'golden_shower': 'zlaty-dest',
  'anal': 'analni-sex',
  'deep_throat': 'hluboky-oral',
  'french_kissing': 'francouzske-libani',
  'kissing': 'francouzske-libani',
  'gfe': 'gfe-zkusenost-pritelkyne',
  'pse': 'pse-pornstar-zkusenost',
  'striptease': 'striptyz',
  'duo': 'duo-service',
  'swallow': 'polyknuti',
  'squirting': 'strikani-divky',
  'bdsm': 'bdsm-lehke',
  'light_bdsm': 'bdsm-lehke',
  'dinner': 'dinner-date',
  'toys': 'eroticke-pomucky',
  'sex_toys': 'eroticke-pomucky'
};

async function migrateServices() {
  console.log('🚀 Starting services migration...\n');

  // Get all girls with services in JSON format
  const girlsResult = await db.execute({
    sql: 'SELECT id, name, services FROM girls WHERE services IS NOT NULL AND services != "[]"',
    args: []
  });

  console.log(`Found ${girlsResult.rows.length} girls with services\n`);

  for (const girl of girlsResult.rows) {
    console.log(`Processing ${girl.name} (ID: ${girl.id})...`);

    try {
      const services = JSON.parse(girl.services);
      console.log(`  Services in JSON: ${services.join(', ')}`);

      for (const oldSlug of services) {
        const newSlug = SERVICE_MAPPING[oldSlug] || oldSlug;

        // Find service ID by slug
        const serviceResult = await db.execute({
          sql: 'SELECT id FROM services WHERE slug = ?',
          args: [newSlug]
        });

        if (serviceResult.rows.length === 0) {
          console.log(`  ⚠️  Service not found in database: ${newSlug} (from ${oldSlug})`);
          continue;
        }

        const serviceId = serviceResult.rows[0].id;

        // Check if already exists
        const existsResult = await db.execute({
          sql: 'SELECT id FROM girl_services WHERE girl_id = ? AND service_id = ?',
          args: [girl.id, serviceId]
        });

        if (existsResult.rows.length > 0) {
          console.log(`  ✓ Already exists: ${newSlug}`);
          continue;
        }

        // Insert into girl_services
        await db.execute({
          sql: 'INSERT INTO girl_services (girl_id, service_id, is_included) VALUES (?, ?, 1)',
          args: [girl.id, serviceId]
        });

        console.log(`  ✅ Migrated: ${oldSlug} → ${newSlug}`);
      }

      console.log('');
    } catch (error) {
      console.error(`  ❌ Error processing ${girl.name}:`, error.message);
    }
  }

  console.log('✅ Migration complete!\n');

  // Show summary
  const summary = await db.execute({
    sql: 'SELECT COUNT(*) as total FROM girl_services',
    args: []
  });

  console.log(`Total services in girl_services table: ${summary.rows[0].total}`);

  process.exit(0);
}

migrateServices().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
