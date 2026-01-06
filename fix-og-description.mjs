import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3OTU5NzcxMDAsImlhdCI6MTc2NDQ0MTEwMCwiaWQiOiI2NDBlZDFlOS00ZTgzLTQxMzktYTQ5Zi00NDAyYjc1NDlkZmUiLCJyaWQiOiJlNTcxZjM3Yi00ZTFhLTRkOWQtODkxNS0wMWYwOTY5NjZhNDMifQ.rMhHcIbWidGztkJqlc_C6r9NUGXobp8Xxaf547eszsWmFChmWC8db0ZVLVBSUFXy6XyEIRMmiss2ZK2-BrzoAA'
});

console.log('Fixing OG description mismatch...\n');

// Update /cs homepage to have matching OG and meta descriptions
await db.execute({
  sql: `UPDATE seo_metadata
        SET og_description = meta_description
        WHERE page_path = '/cs' AND og_description != meta_description`,
  args: []
});

// Verify
const result = await db.execute({
  sql: 'SELECT page_path, meta_description, og_description FROM seo_metadata WHERE page_path = ?',
  args: ['/cs']
});

if (result.rows.length > 0) {
  const row = result.rows[0];
  console.log('✅ Updated /cs:');
  console.log(`  Meta: ${row.meta_description}`);
  console.log(`  OG:   ${row.og_description}`);
  console.log(`  Match: ${row.meta_description === row.og_description ? '✅' : '❌'}`);
} else {
  console.log('⚠️ No /cs record found');
}

process.exit(0);
