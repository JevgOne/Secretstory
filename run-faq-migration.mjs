import { createClient } from '@libsql/client';
import fs from 'fs';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3OTU5NzcxMDAsImlhdCI6MTc2NDQ0MTEwMCwiaWQiOiI2NDBlZDFlOS00ZTgzLTQxMzktYTQ5Zi00NDAyYjc1NDlkZmUiLCJyaWQiOiJlNTcxZjM3Yi00ZTFhLTRkOWQtODkxNS0wMWYwOTY5NjZhNDMifQ.rMhHcIbWidGztkJqlc_C6r9NUGXobp8Xxaf547eszsWmFChmWC8db0ZVLVBSUFXy6XyEIRMmiss2ZK2-BrzoAA'
});

const sql = fs.readFileSync('./migrations/create_faq.sql', 'utf-8');
const statements = sql.split(';').filter(s => s.trim());

for (const stmt of statements) {
  if (stmt.trim()) {
    try {
      await db.execute(stmt);
      console.log('✓ Executed:', stmt.substring(0, 60).replace(/\n/g, ' ') + '...');
    } catch (error) {
      console.error('✗ Error:', error.message);
    }
  }
}

console.log('\n✓ Done!');
