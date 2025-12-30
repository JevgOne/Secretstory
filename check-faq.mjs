import { createClient } from '@libsql/client';

// Direct connection to Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3OTU5NzcxMDAsImlhdCI6MTc2NDQ0MTEwMCwiaWQiOiI2NDBlZDFlOS00ZTgzLTQxMzktYTQ5Zi00NDAyYjc1NDlkZmUiLCJyaWQiOiJlNTcxZjM3Yi00ZTFhLTRkOWQtODkxNS0wMWYwOTY5NjZhNDMifQ.rMhHcIbWidGztkJqlc_C6r9NUGXobp8Xxaf547eszsWmFChmWC8db0ZVLVBSUFXy6XyEIRMmiss2ZK2-BrzoAA',
});

async function check() {
  try {
    console.log('Checking FAQ items...');

    const result = await db.execute('SELECT COUNT(*) as count FROM faq_items');
    console.log(`Total FAQ items: ${result.rows[0].count}`);

    const faqs = await db.execute('SELECT id, category, question_cs FROM faq_items LIMIT 5');
    console.log('\nFirst 5 FAQ items:');
    faqs.rows.forEach(row => {
      console.log(`- [${row.category}] ${row.question_cs}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

check();
