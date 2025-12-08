import { db } from '../lib/db';

async function seedServices() {
  console.log('Starting services seed...\n');

  const services = [
    // Basic services
    {
      name_cs: "Klasická masáž",
      name_en: "Classic massage",
      name_de: "Klassische Massage",
      name_uk: "Класичний масаж",
      category: "basic"
    },
    {
      name_cs: "Erotická masáž",
      name_en: "Erotic massage",
      name_de: "Erotische Massage",
      name_uk: "Еротичний масаж",
      category: "basic"
    },
    {
      name_cs: "Tantra masáž",
      name_en: "Tantra massage",
      name_de: "Tantra-Massage",
      name_uk: "Тантра масаж",
      category: "basic"
    },
    {
      name_cs: "Nuru masáž",
      name_en: "Nuru massage",
      name_de: "Nuru-Massage",
      name_uk: "Нуру масаж",
      category: "basic"
    },
    {
      name_cs: "Body to body",
      name_en: "Body to body",
      name_de: "Body to body",
      name_uk: "Body to body",
      category: "basic"
    },
    {
      name_cs: "Společná sprcha",
      name_en: "Shared shower",
      name_de: "Gemeinsame Dusche",
      name_uk: "Спільний душ",
      category: "basic"
    },
    {
      name_cs: "Líbání",
      name_en: "Kissing",
      name_de: "Küssen",
      name_uk: "Поцілунки",
      category: "basic"
    },
    {
      name_cs: "Striptýz",
      name_en: "Striptease",
      name_de: "Striptease",
      name_uk: "Стриптиз",
      category: "basic"
    },
    {
      name_cs: "Francouzské líbání",
      name_en: "French kissing",
      name_de: "Französisches Küssen",
      name_uk: "Французькі поцілунки",
      category: "basic"
    },
    {
      name_cs: "Girlfriend experience",
      name_en: "Girlfriend experience",
      name_de: "Girlfriend Experience",
      name_uk: "Досвід подруги",
      category: "basic"
    },
    {
      name_cs: "Hraní rolí",
      name_en: "Roleplay",
      name_de: "Rollenspiel",
      name_uk: "Рольові ігри",
      category: "basic"
    },
    {
      name_cs: "Lehká dominance",
      name_en: "Light domination",
      name_de: "Leichte Dominanz",
      name_uk: "Легке домінування",
      category: "basic"
    },
    // Oral services
    {
      name_cs: "Orál bez kondomu",
      name_en: "Oral without condom",
      name_de: "Oral ohne Kondom",
      name_uk: "Оральний без презерватива",
      category: "oral"
    },
    {
      name_cs: "Deepthroat",
      name_en: "Deepthroat",
      name_de: "Deepthroat",
      name_uk: "Глибока глотка",
      category: "oral"
    },
    {
      name_cs: "COB (cum on body)",
      name_en: "COB (cum on body)",
      name_de: "COB (Cum on Body)",
      name_uk: "COB (на тіло)",
      category: "oral"
    },
    {
      name_cs: "CIM (cum in mouth)",
      name_en: "CIM (cum in mouth)",
      name_de: "CIM (Cum in Mouth)",
      name_uk: "CIM (в рот)",
      category: "oral"
    },
    // Anal services
    {
      name_cs: "Anální sex",
      name_en: "Anal sex",
      name_de: "Analsex",
      name_uk: "Анальний секс",
      category: "anal"
    },
    // Extra services
    {
      name_cs: "Extraball (2x)",
      name_en: "Extraball (2x)",
      name_de: "Extraball (2x)",
      name_uk: "Екстраболл (2x)",
      category: "extra"
    },
    {
      name_cs: "Golden shower (aktivní)",
      name_en: "Golden shower (active)",
      name_de: "Golden Shower (aktiv)",
      name_uk: "Золотий дощ (активний)",
      category: "extra"
    },
    {
      name_cs: "Golden shower (pasivní)",
      name_en: "Golden shower (passive)",
      name_de: "Golden Shower (passiv)",
      name_uk: "Золотий дощ (пасивний)",
      category: "extra"
    },
    {
      name_cs: "Foot fetish",
      name_en: "Foot fetish",
      name_de: "Fußfetisch",
      name_uk: "Фут фетиш",
      category: "extra"
    },
    {
      name_cs: "Hračky",
      name_en: "Toys",
      name_de: "Spielzeug",
      name_uk: "Іграшки",
      category: "extra"
    },
    // Duo services
    {
      name_cs: "Duo (2 dívky)",
      name_en: "Duo (2 girls)",
      name_de: "Duo (2 Mädchen)",
      name_uk: "Дует (2 дівчини)",
      category: "duo"
    }
  ];

  try {
    console.log(`Inserting ${services.length} services...\n`);

    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      // Check if service already exists
      const existing = await db.execute({
        sql: 'SELECT id FROM services WHERE name_cs = ? AND name_en = ?',
        args: [service.name_cs, service.name_en]
      });

      if (existing.rows.length > 0) {
        console.log(`⚠️  Service "${service.name_cs}" already exists, skipping`);
        continue;
      }

      await db.execute({
        sql: `INSERT INTO services (
          name_cs, name_en, name_de, name_uk, category, display_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          service.name_cs,
          service.name_en,
          service.name_de,
          service.name_uk,
          service.category,
          i,
          1
        ]
      });

      console.log(`✅ Inserted: ${service.name_cs} (${service.category})`);
    }

    console.log('\n🎉 Services seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedServices();
