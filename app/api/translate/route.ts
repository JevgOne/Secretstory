import { NextRequest, NextResponse } from 'next/server';

// Translation API endpoint using DeepL
export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang = 'cs' } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { success: false, error: 'Missing text or targetLang parameter' },
        { status: 400 }
      );
    }

    // DeepL API endpoint
    const deeplApiKey = process.env.DEEPL_API_KEY;

    if (!deeplApiKey) {
      // Fallback: simple dictionary-based translation for common terms
      const translations = await fallbackTranslate(text, targetLang);
      return NextResponse.json({
        success: true,
        translatedText: translations,
        provider: 'fallback'
      });
    }

    // Call DeepL API
    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        source_lang: sourceLang.toUpperCase(),
        target_lang: targetLang.toUpperCase(),
        preserve_formatting: true,
      }),
    });

    if (!deeplResponse.ok) {
      throw new Error(`DeepL API error: ${deeplResponse.statusText}`);
    }

    const deeplData = await deeplResponse.json();
    const translatedText = deeplData.translations[0].text;

    return NextResponse.json({
      success: true,
      translatedText,
      provider: 'deepl'
    });

  } catch (error: any) {
    console.error('Translation error:', error);

    // Try fallback translation
    try {
      const { text, targetLang } = await request.json();
      const fallbackText = await fallbackTranslate(text, targetLang);
      return NextResponse.json({
        success: true,
        translatedText: fallbackText,
        provider: 'fallback'
      });
    } catch {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
}

// Fallback translation using simple dictionary for common escort terms
async function fallbackTranslate(text: string, targetLang: string): Promise<string> {
  // Common escort industry terms dictionary
  const dictionary: Record<string, Record<string, string>> = {
    // Czech -> English
    en: {
      'tetování': 'tattoo',
      'piercing': 'piercing',
      'zkušená': 'experienced',
      'escort': 'escort',
      'masáž': 'massage',
      'doprovod': 'companionship',
      'dívka': 'girl',
      'žena': 'woman',
      'krásná': 'beautiful',
      'sexy': 'sexy',
      'elegantní': 'elegant',
      'diskrétní': 'discreet',
      'profesionální': 'professional',
    },
    // Czech -> German
    de: {
      'tetování': 'Tätowierung',
      'piercing': 'Piercing',
      'zkušená': 'erfahren',
      'escort': 'Escort',
      'masáž': 'Massage',
      'doprovod': 'Begleitung',
      'dívka': 'Mädchen',
      'žena': 'Frau',
      'krásná': 'schön',
      'sexy': 'sexy',
      'elegantní': 'elegant',
      'diskrétní': 'diskret',
      'profesionální': 'professionell',
    },
    // Czech -> Ukrainian
    uk: {
      'tetování': 'татуювання',
      'piercing': 'пірсинг',
      'zkušená': 'досвідчена',
      'escort': 'ескорт',
      'masáž': 'масаж',
      'doprovod': 'супровід',
      'dívka': 'дівчина',
      'žena': 'жінка',
      'krásná': 'красива',
      'sexy': 'сексуальна',
      'elegantní': 'елегантна',
      'diskrétní': 'дискретна',
      'profesionální': 'професійна',
    },
  };

  let translatedText = text;
  const langDict = dictionary[targetLang.toLowerCase()] || {};

  // Replace known terms
  Object.entries(langDict).forEach(([czech, translation]) => {
    const regex = new RegExp(`\\b${czech}\\b`, 'gi');
    translatedText = translatedText.replace(regex, translation);
  });

  return translatedText;
}
