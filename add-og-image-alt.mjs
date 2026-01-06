import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3OTU5NzcxMDAsImlhdCI6MTc2NDQ0MTEwMCwiaWQiOiI2NDBlZDFlOS00ZTgzLTQxMzktYTQ5Zi00NDAyYjc1NDlkZmUiLCJyaWQiOiJlNTcxZjM3Yi00ZTFhLTRkOWQtODkxNS0wMWYwOTY5NjZhNDMifQ.rMhHcIbWidGztkJqlc_C6r9NUGXobp8Xxaf547eszsWmFChmWC8db0ZVLVBSUFXy6XyEIRMmiss2ZK2-BrzoAA'
});

console.log('Adding og_image_alt column to seo_metadata table...\n');

try {
  // Check if column already exists
  const tableInfo = await db.execute({
    sql: 'PRAGMA table_info(seo_metadata)',
    args: []
  });

  const hasOgImageAlt = tableInfo.rows.some(row => row.name === 'og_image_alt');

  if (hasOgImageAlt) {
    console.log('✅ Column og_image_alt already exists');
  } else {
    // Add the column
    await db.execute({
      sql: 'ALTER TABLE seo_metadata ADD COLUMN og_image_alt TEXT DEFAULT NULL',
      args: []
    });
    console.log('✅ Successfully added og_image_alt column');
  }

  // Verify
  const verifyInfo = await db.execute({
    sql: 'PRAGMA table_info(seo_metadata)',
    args: []
  });

  const ogImageAltField = verifyInfo.rows.find(row => row.name === 'og_image_alt');
  if (ogImageAltField) {
    console.log('\n✅ Verification passed:');
    console.log(`  Column: ${ogImageAltField.name}`);
    console.log(`  Type: ${ogImageAltField.type}`);
    console.log(`  Default: ${ogImageAltField.dflt_value || 'NULL'}`);
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

process.exit(0);
