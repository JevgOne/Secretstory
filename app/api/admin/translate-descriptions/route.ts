import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// Common body part translations for tattoo/piercing locations
const translations: Record<string, { en: string; de: string; uk: string }> = {
  // Body parts
  'ruka': { en: 'arm', de: 'Arm', uk: 'рука' },
  'ruky': { en: 'arms', de: 'Arme', uk: 'руки' },
  'ruce': { en: 'arms', de: 'Arme', uk: 'руки' },
  'paže': { en: 'upper arm', de: 'Oberarm', uk: 'плече' },
  'předloktí': { en: 'forearm', de: 'Unterarm', uk: 'передпліччя' },
  'záda': { en: 'back', de: 'Rücken', uk: 'спина' },
  'zádech': { en: 'back', de: 'Rücken', uk: 'спині' },
  'noha': { en: 'leg', de: 'Bein', uk: 'нога' },
  'nohy': { en: 'legs', de: 'Beine', uk: 'ноги' },
  'stehno': { en: 'thigh', de: 'Oberschenkel', uk: 'стегно' },
  'stehna': { en: 'thighs', de: 'Oberschenkel', uk: 'стегна' },
  'lýtko': { en: 'calf', de: 'Wade', uk: 'литка' },
  'kotník': { en: 'ankle', de: 'Knöchel', uk: 'щиколотка' },
  'kotníku': { en: 'ankle', de: 'Knöchel', uk: 'щиколотці' },
  'chodidlo': { en: 'foot', de: 'Fuß', uk: 'ступня' },
  'hrudník': { en: 'chest', de: 'Brust', uk: 'груди' },
  'prsa': { en: 'chest', de: 'Brust', uk: 'груди' },
  'břicho': { en: 'belly', de: 'Bauch', uk: 'живіт' },
  'pupík': { en: 'belly button', de: 'Bauchnabel', uk: 'пупок' },
  'pupek': { en: 'belly button', de: 'Bauchnabel', uk: 'пупок' },
  'bok': { en: 'side', de: 'Seite', uk: 'бік' },
  'boky': { en: 'sides', de: 'Seiten', uk: 'боки' },
  'žebra': { en: 'ribs', de: 'Rippen', uk: 'ребра' },
  'krk': { en: 'neck', de: 'Hals', uk: 'шия' },
  'šíje': { en: 'nape', de: 'Nacken', uk: 'потилиця' },
  'rameno': { en: 'shoulder', de: 'Schulter', uk: 'плече' },
  'ramena': { en: 'shoulders', de: 'Schultern', uk: 'плечі' },
  'lopatka': { en: 'shoulder blade', de: 'Schulterblatt', uk: 'лопатка' },
  'lopatky': { en: 'shoulder blades', de: 'Schulterblätter', uk: 'лопатки' },
  'zápěstí': { en: 'wrist', de: 'Handgelenk', uk: 'зап\'ясток' },
  'dlaň': { en: 'palm', de: 'Handfläche', uk: 'долоня' },
  'prsty': { en: 'fingers', de: 'Finger', uk: 'пальці' },
  'prst': { en: 'finger', de: 'Finger', uk: 'палець' },

  // Face/head
  'obličej': { en: 'face', de: 'Gesicht', uk: 'обличчя' },
  'tvář': { en: 'cheek', de: 'Wange', uk: 'щока' },
  'ucho': { en: 'ear', de: 'Ohr', uk: 'вухо' },
  'uši': { en: 'ears', de: 'Ohren', uk: 'вуха' },
  'nos': { en: 'nose', de: 'Nase', uk: 'ніс' },
  'ret': { en: 'lip', de: 'Lippe', uk: 'губа' },
  'rty': { en: 'lips', de: 'Lippen', uk: 'губи' },
  'obočí': { en: 'eyebrow', de: 'Augenbraue', uk: 'брова' },
  'jazyk': { en: 'tongue', de: 'Zunge', uk: 'язик' },
  'brada': { en: 'chin', de: 'Kinn', uk: 'підборіддя' },
  'čelo': { en: 'forehead', de: 'Stirn', uk: 'чоло' },

  // Intimate areas
  'intimní': { en: 'intimate', de: 'intim', uk: 'інтимний' },
  'intimní partie': { en: 'intimate area', de: 'Intimbereich', uk: 'інтимна зона' },
  'bradavka': { en: 'nipple', de: 'Brustwarze', uk: 'сосок' },
  'bradavky': { en: 'nipples', de: 'Brustwarzen', uk: 'соски' },

  // Common descriptors
  'malé': { en: 'small', de: 'klein', uk: 'мале' },
  'malý': { en: 'small', de: 'klein', uk: 'малий' },
  'velké': { en: 'large', de: 'groß', uk: 'велике' },
  'velký': { en: 'large', de: 'groß', uk: 'великий' },
  'celé': { en: 'full', de: 'ganz', uk: 'повне' },
  'celá': { en: 'full', de: 'ganz', uk: 'повна' },
  'rukáv': { en: 'sleeve', de: 'Ärmel', uk: 'рукав' },
  'květiny': { en: 'flowers', de: 'Blumen', uk: 'квіти' },
  'květy': { en: 'flowers', de: 'Blumen', uk: 'квіти' },
  'motýl': { en: 'butterfly', de: 'Schmetterling', uk: 'метелик' },
  'hvězda': { en: 'star', de: 'Stern', uk: 'зірка' },
  'hvězdy': { en: 'stars', de: 'Sterne', uk: 'зірки' },
  'srdce': { en: 'heart', de: 'Herz', uk: 'серце' },
  'nápis': { en: 'text', de: 'Schrift', uk: 'напис' },
  'text': { en: 'text', de: 'Text', uk: 'текст' },
  'ornament': { en: 'ornament', de: 'Ornament', uk: 'орнамент' },
  'mandala': { en: 'mandala', de: 'Mandala', uk: 'мандала' },
  'geometrické': { en: 'geometric', de: 'geometrisch', uk: 'геометричний' },
  'tribal': { en: 'tribal', de: 'Tribal', uk: 'трайбл' },
  'realistické': { en: 'realistic', de: 'realistisch', uk: 'реалістичне' },
  'barevné': { en: 'colorful', de: 'bunt', uk: 'кольорове' },
  'černobílé': { en: 'black and white', de: 'schwarz-weiß', uk: 'чорно-біле' },

  // Prepositions and connectors
  'na': { en: 'on', de: 'auf', uk: 'на' },
  'a': { en: 'and', de: 'und', uk: 'і' },
  'nebo': { en: 'or', de: 'oder', uk: 'або' },
  'celém': { en: 'entire', de: 'gesamten', uk: 'всьому' },
  'těle': { en: 'body', de: 'Körper', uk: 'тілі' },
};

// Translate a Czech description to target language
function translateDescription(czechText: string, targetLang: 'en' | 'de' | 'uk'): string {
  if (!czechText) return '';

  let result = czechText.toLowerCase();

  // Sort by length descending to match longer phrases first
  const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);

  for (const czech of sortedKeys) {
    const regex = new RegExp(czech.toLowerCase(), 'gi');
    result = result.replace(regex, translations[czech][targetLang]);
  }

  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// POST /api/admin/translate-descriptions - Translate existing tattoo/piercing descriptions
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    // First, run migrations if needed
    const migrations = [
      'ALTER TABLE girls ADD COLUMN tattoo_description_cs TEXT',
      'ALTER TABLE girls ADD COLUMN tattoo_description_en TEXT',
      'ALTER TABLE girls ADD COLUMN tattoo_description_de TEXT',
      'ALTER TABLE girls ADD COLUMN tattoo_description_uk TEXT',
      'ALTER TABLE girls ADD COLUMN piercing_description_cs TEXT',
      'ALTER TABLE girls ADD COLUMN piercing_description_en TEXT',
      'ALTER TABLE girls ADD COLUMN piercing_description_de TEXT',
      'ALTER TABLE girls ADD COLUMN piercing_description_uk TEXT',
    ];

    for (const sql of migrations) {
      try {
        await db.execute(sql);
      } catch (e: any) {
        // Ignore if column already exists
        if (!e.message?.includes('duplicate column')) {
          console.error('Migration error:', e.message);
        }
      }
    }

    // Get all girls with tattoo or piercing descriptions
    const result = await db.execute(`
      SELECT id, name, tattoo_description, piercing_description,
             tattoo_description_cs, tattoo_description_en, tattoo_description_de, tattoo_description_uk,
             piercing_description_cs, piercing_description_en, piercing_description_de, piercing_description_uk
      FROM girls
      WHERE (tattoo_description IS NOT NULL AND tattoo_description != '')
         OR (piercing_description IS NOT NULL AND piercing_description != '')
    `);

    const updates: any[] = [];

    for (const girl of result.rows as any[]) {
      const tattooCs = girl.tattoo_description || '';
      const piercingCs = girl.piercing_description || '';

      // Only translate if we have original description and haven't translated yet
      if (tattooCs && (!girl.tattoo_description_cs || !girl.tattoo_description_en)) {
        const tattooEn = translateDescription(tattooCs, 'en');
        const tattooDe = translateDescription(tattooCs, 'de');
        const tattooUk = translateDescription(tattooCs, 'uk');

        await db.execute({
          sql: `UPDATE girls SET
                tattoo_description_cs = ?,
                tattoo_description_en = ?,
                tattoo_description_de = ?,
                tattoo_description_uk = ?
                WHERE id = ?`,
          args: [tattooCs, tattooEn, tattooDe, tattooUk, girl.id]
        });

        updates.push({
          id: girl.id,
          name: girl.name,
          type: 'tattoo',
          original: tattooCs,
          translations: { en: tattooEn, de: tattooDe, uk: tattooUk }
        });
      }

      if (piercingCs && (!girl.piercing_description_cs || !girl.piercing_description_en)) {
        const piercingEn = translateDescription(piercingCs, 'en');
        const piercingDe = translateDescription(piercingCs, 'de');
        const piercingUk = translateDescription(piercingCs, 'uk');

        await db.execute({
          sql: `UPDATE girls SET
                piercing_description_cs = ?,
                piercing_description_en = ?,
                piercing_description_de = ?,
                piercing_description_uk = ?
                WHERE id = ?`,
          args: [piercingCs, piercingEn, piercingDe, piercingUk, girl.id]
        });

        updates.push({
          id: girl.id,
          name: girl.name,
          type: 'piercing',
          original: piercingCs,
          translations: { en: piercingEn, de: piercingDe, uk: piercingUk }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Translated descriptions for ${updates.length} records`,
      updates
    });

  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Chyba při překladu popisů', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/admin/translate-descriptions - Preview existing descriptions
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const result = await db.execute(`
      SELECT id, name, tattoo_description, piercing_description,
             tattoo_description_cs, tattoo_description_en, tattoo_description_de, tattoo_description_uk,
             piercing_description_cs, piercing_description_en, piercing_description_de, piercing_description_uk
      FROM girls
      WHERE (tattoo_description IS NOT NULL AND tattoo_description != '')
         OR (piercing_description IS NOT NULL AND piercing_description != '')
    `);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      girls: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching descriptions:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání popisů', details: error.message },
      { status: 500 }
    );
  }
}
