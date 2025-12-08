import { db } from '../lib/db';

async function seedServices() {
  console.log('Starting services seed with STANDARD + OPTIONAL services...\n');

  // STANDARD SERVICES (always included in price)
  const standardServices = [
    {
      name_cs: "Basic",
      name_en: "Basic",
      name_de: "Basic",
      name_uk: "Базовий",
      category: "basic",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "Classic",
      name_en: "Classic",
      name_de: "Klassisch",
      name_uk: "Класичний",
      category: "basic",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "Kouření s kondomem",
      name_en: "Blowjob with condom",
      name_de: "Blowjob mit Kondom",
      name_uk: "Мінет з презервативом",
      category: "oral",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "Masáž",
      name_en: "Massage",
      name_de: "Massage",
      name_uk: "Масаж",
      category: "basic",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "Mazlení",
      name_en: "Cuddling",
      name_de: "Kuscheln",
      name_uk: "Обійми",
      category: "basic",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "Lízání",
      name_en: "Licking",
      name_de: "Lecken",
      name_uk: "Лизання",
      category: "oral",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "69",
      name_en: "69",
      name_de: "69",
      name_uk: "69",
      category: "oral",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "Výstřik na tělo",
      name_en: "Cum on body",
      name_de: "Abspritzen auf den Körper",
      name_uk: "Закінчення на тіло",
      category: "oral",
      duration: null,
      is_standard: true
    },
    {
      name_cs: "Společná sprcha",
      name_en: "Shared shower",
      name_de: "Gemeinsame Dusche",
      name_uk: "Спільний душ",
      category: "basic",
      is_standard: true
    }
  ];

  // OPTIONAL SERVICES (extra charge)
  const optionalServices = [
    {
      name_cs: "Erotická masáž",
      name_en: "Erotic massage",
      name_de: "Erotische Massage",
      name_uk: "Еротичний масаж",
      category: "basic",
      duration: 60,
      is_standard: false
    },
    {
      name_cs: "Masáž prostaty",
      name_en: "Prostate massage",
      name_de: "Prostatamassage",
      name_uk: "Масаж простати",
      category: "basic",
      duration: 45,
      is_standard: false
    },
    {
      name_cs: "Tvrdý sex",
      name_en: "Hard sex",
      name_de: "Harter Sex",
      name_uk: "Жорсткий секс",
      category: "basic",
      duration: 60,
      is_standard: false
    },
    {
      name_cs: "Lehké SM",
      name_en: "Light SM",
      name_de: "Leichtes SM",
      name_uk: "Легке СМ",
      category: "extra",
      duration: 60,
      is_standard: false
    },
    {
      name_cs: "Facesitting",
      name_en: "Facesitting",
      name_de: "Facesitting",
      name_uk: "Фейсситинг",
      category: "extra",
      duration: 30,
      is_standard: false
    },
    {
      name_cs: "Foot fetish",
      name_en: "Foot fetish",
      name_de: "Fußfetisch",
      name_uk: "Фетиш ніг",
      category: "extra",
      duration: 30,
      is_standard: false
    },
    {
      name_cs: "BDSM",
      name_en: "BDSM",
      name_de: "BDSM",
      name_uk: "БДСМ",
      category: "extra",
      duration: 90,
      is_standard: false
    },
    {
      name_cs: "Lesbi show",
      name_en: "Lesbian show",
      name_de: "Lesbenshow",
      name_uk: "Лесбі-шоу",
      category: "extra",
      duration: 60,
      is_standard: false
    },
    {
      name_cs: "Role-play",
      name_en: "Role-play",
      name_de: "Rollenspiel",
      name_uk: "Рольові ігри",
      category: "extra",
      duration: 60,
      is_standard: false
    },
    {
      name_cs: "Svazování",
      name_en: "Bondage",
      name_de: "Fesselspiele",
      name_uk: "Бондаж",
      category: "extra",
      duration: 60,
      is_standard: false
    },
    {
      name_cs: "Bi trojka (MŽŽ)",
      name_en: "Bi threesome (MFF)",
      name_de: "Bi-Dreier (MFF)",
      name_uk: "Бі-тріо (ЧЖЖ)",
      category: "extra",
      duration: 90,
      is_standard: false
    },
    {
      name_cs: "Trojka (MŽM)",
      name_en: "Threesome (MMF)",
      name_de: "Dreier (MMF)",
      name_uk: "Тріо (ЧЧЖ)",
      category: "extra",
      duration: 90,
      is_standard: false
    },
    {
      name_cs: "Líbání",
      name_en: "Kissing",
      name_de: "Küssen",
      name_uk: "Поцілунки",
      category: "basic",
      duration: null,
      is_standard: false
    },
    {
      name_cs: "Orál bez kondomu",
      name_en: "Oral without condom (OWO)",
      name_de: "Oralsex ohne Kondom",
      name_uk: "Оральний секс без презерватива",
      category: "oral",
      duration: 30,
      is_standard: false
    },
    {
      name_cs: "Hluboký orál",
      name_en: "Deepthroat",
      name_de: "Deepthroat",
      name_uk: "Глибокий оральний секс",
      category: "oral",
      duration: 30,
      is_standard: false
    },
    {
      name_cs: "Výstřik na obličej",
      name_en: "Facial (COF)",
      name_de: "Gesichtsbesamung",
      name_uk: "Закінчення на обличчя",
      category: "oral",
      duration: null,
      is_standard: false
    },
    {
      name_cs: "Výstřik do pusy",
      name_en: "Cum in mouth (CIM)",
      name_de: "Abspritzen im Mund",
      name_uk: "Закінчення в рот",
      category: "oral",
      duration: null,
      is_standard: false
    },
    {
      name_cs: "Polykání",
      name_en: "Swallowing",
      name_de: "Schlucken",
      name_uk: "Ковтання",
      category: "oral",
      duration: null,
      is_standard: false
    },
    {
      name_cs: "Dámský anál",
      name_en: "Female anal",
      name_de: "Damen-Analsex",
      name_uk: "Жіночий анальний секс",
      category: "anal",
      duration: 45,
      is_standard: false
    },
    {
      name_cs: "Pánský anál",
      name_en: "Male anal (pegging)",
      name_de: "Herren-Analsex (Pegging)",
      name_uk: "Чоловічий анальний секс (пегінг)",
      category: "anal",
      duration: 45,
      is_standard: false
    },
    {
      name_cs: "Rimming active",
      name_en: "Rimming (giving)",
      name_de: "Rimming (aktiv)",
      name_uk: "Римінг (активний)",
      category: "anal",
      duration: 30,
      is_standard: false
    },
    {
      name_cs: "Rimming passive",
      name_en: "Rimming (receiving)",
      name_de: "Rimming (passiv)",
      name_uk: "Римінг (пасивний)",
      category: "anal",
      duration: 30,
      is_standard: false
    },
    {
      name_cs: "Natáčení s obličejem",
      name_en: "Recording with face",
      name_de: "Aufnahme mit Gesicht",
      name_uk: "Зйомка з обличчям",
      category: "extra",
      duration: null,
      is_standard: false
    },
    {
      name_cs: "Natáčení bez obličeje",
      name_en: "Recording without face",
      name_de: "Aufnahme ohne Gesicht",
      name_uk: "Зйомка без обличчя",
      category: "extra",
      duration: null,
      is_standard: false
    },
    {
      name_cs: "Piss active",
      name_en: "Golden shower (giving)",
      name_de: "Natursekt (aktiv)",
      name_uk: "Золотий дощ (активний)",
      category: "extra",
      duration: 30,
      is_standard: false
    },
    {
      name_cs: "Piss passive",
      name_en: "Golden shower (receiving)",
      name_de: "Natursekt (passiv)",
      name_uk: "Золотий дощ (пасивний)",
      category: "extra",
      duration: 30,
      is_standard: false
    }
  ];

  const allServices = [...standardServices, ...optionalServices];

  try {
    console.log(`🔸 STANDARD services: ${standardServices.length}`);
    console.log(`🔸 OPTIONAL services: ${optionalServices.length}`);
    console.log(`📊 TOTAL: ${allServices.length} services\n`);

    for (let i = 0; i < allServices.length; i++) {
      const service = allServices[i];

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
          name_cs, name_en, name_de, name_uk, category, duration, display_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          service.name_cs,
          service.name_en,
          service.name_de,
          service.name_uk,
          service.category,
          service.duration || null,
          i,
          1
        ]
      });

      const icon = service.is_standard ? '✅' : '🔹';
      console.log(`${icon} ${service.name_cs} (${service.category})`);
    }

    console.log('\n🎉 Services seed completed successfully!');
    console.log(`✅ ${standardServices.length} standard services (always included)`);
    console.log(`🔹 ${optionalServices.length} optional services (extra charge)`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedServices();
