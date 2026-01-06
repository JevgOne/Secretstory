#!/usr/bin/env node
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://lg-jevgone.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3OTU5NzcxMDAsImlhdCI6MTc2NDQ0MTEwMCwiaWQiOiI2NDBlZDFlOS00ZTgzLTQxMzktYTQ5Zi00NDAyYjc1NDlkZmUiLCJyaWQiOiJlNTcxZjM3Yi00ZTFhLTRkOWQtODkxNS0wMWYwOTY5NjZhNDMifQ.rMhHcIbWidGztkJqlc_C6r9NUGXobp8Xxaf547eszsWmFChmWC8db0ZVLVBSUFXy6XyEIRMmiss2ZK2-BrzoAA'
});

const SITE_URL = 'https://www.lovelygirls.cz';

// Test stránky
const testPages = [
  '/cs',
  '/cs/divky',
  '/cs/cenik',
  '/cs/schedule',
  '/cs/discounts',
  '/cs/faq',
  '/en',
  '/en/divky',
  '/de',
  '/de/divky',
];

console.log('═══════════════════════════════════════════════════');
console.log('SEO & ISR & Schema.org Test');
console.log('═══════════════════════════════════════════════════\n');

// 1. Check database SEO
console.log('📊 SEO METADATA IN DATABASE:\n');
const result = await db.execute({
  sql: 'SELECT page_path, meta_title, meta_description, schema_type, schema_data FROM seo_metadata WHERE page_path LIKE ? ORDER BY page_path',
  args: ['/cs%']
});

const dbPaths = new Set();
result.rows.forEach((row) => {
  dbPaths.add(row.page_path);
  const hasSchema = row.schema_type || row.schema_data;
  console.log(`${row.page_path}`);
  console.log(`  Title: ${row.meta_title ? '✅' : '❌'} ${row.meta_title || 'MISSING'}`);
  console.log(`  Description: ${row.meta_description ? '✅' : '❌'} ${row.meta_description || 'MISSING'}`);
  console.log(`  Schema: ${hasSchema ? '✅' : '⚠️'} ${row.schema_type || 'none'}`);
  console.log('');
});

// 2. Check missing pages
console.log('\n⚠️ PAGES WITHOUT SEO IN DATABASE:\n');
const csPages = testPages.filter(p => p.startsWith('/cs'));
csPages.forEach(page => {
  if (!dbPaths.has(page)) {
    console.log(`❌ ${page} - NOT IN DATABASE`);
  }
});

// 3. Fetch production pages and check meta
console.log('\n\n🌐 PRODUCTION PAGE CHECK:\n');

async function checkPage(path) {
  try {
    const url = `${SITE_URL}${path}`;
    const response = await fetch(url);
    const html = await response.text();

    // Extract meta tags
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
    const ogDescMatch = html.match(/<meta property="og:description" content="(.*?)"/);
    const schemaMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);

    const title = titleMatch?.[1];
    const desc = descMatch?.[1];
    const ogTitle = ogTitleMatch?.[1];
    const ogDesc = ogDescMatch?.[1];
    const hasSchema = !!schemaMatch;

    console.log(`${path}`);
    console.log(`  Title: ${title ? '✅' : '❌'} ${title || 'MISSING'}`);
    console.log(`  Description: ${desc ? '✅' : '❌'} ${desc || 'MISSING'}`);
    console.log(`  OG Title: ${ogTitle ? '✅' : '❌'} ${ogTitle || 'MISSING'}`);
    console.log(`  OG Desc: ${ogDesc ? '✅' : '❌'} ${ogDesc || 'MISSING'}`);
    console.log(`  Schema.org: ${hasSchema ? '✅' : '❌'}`);

    // Compare with DB
    const dbRow = result.rows.find(r => r.page_path === path);
    if (dbRow) {
      const titleMatch = title === dbRow.meta_title;
      const descMatch = desc === dbRow.meta_description;
      console.log(`  DB Match: Title ${titleMatch ? '✅' : '❌'} | Desc ${descMatch ? '✅' : '❌'}`);
      if (!titleMatch && title && dbRow.meta_title) {
        console.log(`    Expected: "${dbRow.meta_title}"`);
        console.log(`    Got: "${title}"`);
      }
      if (!descMatch && desc && dbRow.meta_description) {
        console.log(`    Expected: "${dbRow.meta_description.substring(0, 80)}..."`);
        console.log(`    Got: "${desc.substring(0, 80)}..."`);
      }
    }
    console.log('');

  } catch (error) {
    console.log(`${path} - ❌ ERROR: ${error.message}\n`);
  }
}

// Test first 3 pages
for (const page of testPages.slice(0, 3)) {
  await checkPage(page);
  await new Promise(resolve => setTimeout(resolve, 500));
}

console.log('\n═══════════════════════════════════════════════════');
console.log('ISR CACHE INFO:');
console.log('═══════════════════════════════════════════════════');
console.log('Revalidate time: 60 seconds');
console.log('');
console.log('How to test ISR:');
console.log('1. Change SEO in admin panel');
console.log('2. Wait 60 seconds');
console.log('3. Refresh page TWICE (1st = trigger, 2nd = see new)');
console.log('');
console.log('Or force rebuild: push to .vercel-trigger');
console.log('═══════════════════════════════════════════════════\n');
