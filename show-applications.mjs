import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const result = await db.execute('SELECT * FROM applications ORDER BY created_at DESC');

console.log('\n========================================');
console.log('VŠECHNY ŽÁDOSTI O PROFIL');
console.log('========================================\n');

result.rows.forEach((app, i) => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`${i + 1}. ${app.name} (ID: ${app.id})`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  console.log('📋 ZÁKLADNÍ ÚDAJE:');
  console.log(`   Věk: ${app.age} let`);
  console.log(`   Výška: ${app.height || '?'}cm`);
  console.log(`   Váha: ${app.weight || '?'}kg`);
  console.log(`   Míry: ${app.bust || '?'}-${app.waist || '?'}-${app.hips || '?'}`);

  console.log('\n💇 VZHLED:');
  console.log(`   Vlasy: ${app.hair || 'N/A'}`);
  console.log(`   Oči: ${app.eyes || 'N/A'}`);
  console.log(`   Tetování: ${app.tattoo ? 'Ano' : 'Ne'}`);
  if (app.tattoo && app.tattoo_description) {
    console.log(`   Popis tetování: ${app.tattoo_description}`);
  }
  console.log(`   Piercing: ${app.piercing ? 'Ano' : 'Ne'}`);

  console.log('\n📞 KONTAKT:');
  console.log(`   Telefon: ${app.phone}`);
  console.log(`   Email: ${app.email || 'N/A'}`);
  console.log(`   Telegram: ${app.telegram || 'N/A'}`);

  console.log('\n💼 PROFESNÍ INFO:');
  console.log(`   Zkušenosti: ${app.experience}`);
  try {
    const langs = JSON.parse(app.languages);
    console.log(`   Jazyky: ${Array.isArray(langs) ? langs.join(', ') : app.languages}`);
  } catch {
    console.log(`   Jazyky: ${app.languages}`);
  }
  try {
    const avail = JSON.parse(app.availability);
    console.log(`   Dostupnost: ${Array.isArray(avail) ? avail.join(', ') : app.availability}`);
  } catch {
    console.log(`   Dostupnost: ${app.availability}`);
  }

  if (app.bio_cs) {
    console.log('\n📝 BIO (CZ):');
    console.log(`   ${app.bio_cs}`);
  }

  if (app.bio_en) {
    console.log('\n📝 BIO (EN):');
    console.log(`   ${app.bio_en}`);
  }

  console.log(`\n⏱️  STATUS: ${app.status.toUpperCase()}`);
  if (app.notes) {
    console.log(`📝 Poznámky: ${app.notes}`);
  }
  if (app.rejection_reason) {
    console.log(`❌ Důvod zamítnutí: ${app.rejection_reason}`);
  }
  console.log(`📅 Podáno: ${new Date(app.created_at).toLocaleString('cs-CZ')}`);
});

console.log('\n========================================');
console.log(`CELKEM: ${result.rows.length} žádostí`);
console.log('========================================\n');

process.exit(0);
