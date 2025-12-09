import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local BEFORE importing db
config({ path: resolve(process.cwd(), '.env.local') });

const girlsData = [
  {
    name: 'Lucka',
    age: 24,
    height: 172,
    weight: 55,
    bust: '85-C',
    hair: 'Blond',
    eyes: 'Modré',
    nationality: 'Česká',
    bio: 'Vysoká blondýnka s jiskřivou osobností. Miluji hluboké konverzace a smyslné okamžiky.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'erotic_massage', 'body_to_body'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Luna',
    age: 19,
    height: 167,
    weight: 50,
    bust: '85-C',
    hair: 'Hnědé',
    eyes: 'Hnědé',
    nationality: 'Česká',
    bio: 'Hravá bruneta, která miluje zábavu a nové zážitky. Jsem tu, abych splnila tvé fantazie.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'striptease', 'lap_dance'],
    tattoo_percentage: 5,
    piercing: true,
    piercing_description: 'Piercing v nose'
  },
  {
    name: 'Klara',
    age: 25,
    height: 160,
    weight: 50,
    bust: '75-B',
    hair: 'Hnědé',
    eyes: 'Zelené',
    nationality: 'Česká',
    bio: 'Hravá nováčka se živou osobností. Miluji nové zkušenosti a spontánnost.',
    languages: ['cs'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Elizabeth',
    age: 22,
    height: 170,
    weight: 61,
    bust: '85-B',
    hair: 'Hnědé',
    eyes: 'Modré',
    nationality: 'Česká',
    bio: 'Mladá, jemná dívka s přesným okrajem. Ráda poslouchám a plním přání.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'role_play', 'light_bdsm'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Lilly',
    age: 21,
    height: 165,
    weight: 52,
    bust: '80-B',
    hair: 'Blond',
    eyes: 'Modré',
    nationality: 'Česká',
    bio: 'Naslouchající sub s divokým okrajem. Ráda zkouším nové věci.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'role_play'],
    tattoo_percentage: 10,
    tattoo_description: 'Malé tetování na rameni',
    piercing: false
  },
  {
    name: 'Nelly',
    age: 23,
    height: 168,
    weight: 54,
    bust: '80-B',
    hair: 'Hnědé',
    eyes: 'Zelené',
    nationality: 'Česká',
    bio: 'Bruneta se zelenýma očima a kočičí osobností. Jsem smyslná a mysterózní.',
    languages: ['cs', 'en', 'de'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'erotic_massage', 'tantra_massage'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Sara',
    age: 20,
    height: 158,
    weight: 48,
    bust: '75-B',
    hair: 'Hnědé',
    eyes: 'Hnědé',
    nationality: 'Česká',
    bio: 'Drobná, štíhlá kráska s ďábelskou jiskrou. Miluji hravost a intimitu.',
    languages: ['cs'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together'],
    tattoo_percentage: 0,
    piercing: true,
    piercing_description: 'Piercing v pupíku'
  },
  {
    name: 'Marie',
    age: 22,
    height: 168,
    weight: 55,
    bust: '80-B',
    hair: 'Hnědé',
    eyes: 'Hnědé',
    nationality: 'Česká',
    bio: 'Mladá, přirozeně smyslná. Jsem tu, abych ti poskytla nezapomenutelný zážitek.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'erotic_massage'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Ema',
    age: 24,
    height: 170,
    weight: 65,
    bust: '90-C',
    hair: 'Hnědé',
    eyes: 'Hnědé',
    nationality: 'Česká',
    bio: 'Nový přírůstek do našeho týmu. Jsem temperamentní a vášnivá.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'striptease'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Katy',
    age: 20,
    height: 155,
    weight: 47,
    bust: '75-B',
    hair: 'Blond',
    eyes: 'Modré',
    nationality: 'Česká',
    bio: 'Drobná kráska s velký srdcem. Miluji romantiku a něžnost.',
    languages: ['cs'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Emily',
    age: 20,
    height: 176,
    weight: 60,
    bust: '85-B',
    hair: 'Blond',
    eyes: 'Modré',
    nationality: 'Česká',
    bio: 'Vysoká blondýnka s modelkovým vzezřením. Elegantní a smyslná.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'erotic_massage', 'body_to_body'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Daniela',
    age: 25,
    height: 163,
    weight: 48,
    bust: '85-C',
    hair: 'Hnědé',
    eyes: 'Hnědé',
    nationality: 'Česká',
    bio: 'Nová tvář v našem týmu. Jsem příjemná a vstřícná.',
    languages: ['cs', 'en'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Rebecca',
    age: 30,
    height: 176,
    weight: 63,
    bust: '85-B',
    hair: 'Hnědé',
    eyes: 'Hnědé',
    nationality: 'Česká',
    bio: 'Zkušená společnice, která ví, co muži potřebují. Profesionální a diskrétní.',
    languages: ['cs', 'en', 'de'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'erotic_massage', 'tantra_massage', 'role_play'],
    tattoo_percentage: 0,
    piercing: false
  },
  {
    name: 'Nika',
    age: 28,
    height: 162,
    weight: 50,
    bust: '80-B',
    hair: 'Hnědé',
    eyes: 'Zelené',
    nationality: 'Česká',
    bio: 'Top hodnocená společnice s letitými zkušenostmi. Ví, jak potěšit.',
    languages: ['cs', 'en', 'ru'],
    services: ['classic', 'blowjob_with_condom', 'massage', 'cuddling', 'licking', 'sixtynine', 'cum_on_body', 'shower_together', 'erotic_massage', 'tantra_massage', 'nuru_massage', 'body_to_body', 'role_play'],
    tattoo_percentage: 5,
    tattoo_description: 'Malé tetování na zádech',
    piercing: false
  }
];

const colors = ['rose', 'purple', 'blue', 'green', 'orange', 'red'];

async function importGirls() {
  console.log('🚀 Starting import of girls from lovelygirls.cz...\n');

  // Dynamically import db after dotenv is loaded
  const { db } = await import('../lib/db.js');

  for (let i = 0; i < girlsData.length; i++) {
    const girl = girlsData[i];
    const color = colors[i % colors.length];

    // Generate slug
    const slug = girl.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    try {
      // Check if girl already exists
      const existing = await db.execute({
        sql: 'SELECT id FROM girls WHERE slug = ?',
        args: [slug]
      });

      if (existing.rows.length > 0) {
        console.log(`⏭️  Skipping ${girl.name} - already exists`);
        continue;
      }

      // Insert girl
      await db.execute({
        sql: `
          INSERT INTO girls (
            name, slug, phone, age, nationality, height, weight,
            bust, hair, eyes, color, status, services, bio,
            tattoo_percentage, tattoo_description, piercing, piercing_description, languages,
            verified, online
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          girl.name,
          slug,
          '+420734332131',
          girl.age,
          girl.nationality,
          girl.height,
          girl.weight,
          girl.bust,
          girl.hair,
          girl.eyes,
          color,
          'active', // Set all as active
          JSON.stringify(girl.services),
          girl.bio,
          girl.tattoo_percentage || 0,
          girl.tattoo_description || null,
          girl.piercing ? 1 : 0,
          girl.piercing_description || null,
          JSON.stringify(girl.languages),
          1, // verified
          i < 5 ? 1 : 0 // First 5 girls are online
        ]
      });

      console.log(`✅ Imported ${girl.name} (${slug})`);
    } catch (error) {
      console.error(`❌ Error importing ${girl.name}:`, error);
    }
  }

  console.log('\n✨ Import completed!');
}

importGirls().catch(console.error);
