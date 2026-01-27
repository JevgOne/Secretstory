import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization to support runtime API key injection
function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

/**
 * Auto-translate blog post content using Claude
 * Preserves HTML formatting and maintains context
 */
export async function translateBlogPost(
  content: {
    title: string;
    excerpt: string;
    content: string;
    meta_description?: string;
  },
  fromLang: 'cs' | 'en' | 'de' | 'uk',
  toLang: 'cs' | 'en' | 'de' | 'uk'
): Promise<{
  title: string;
  excerpt: string;
  content: string;
  meta_description?: string;
}> {

  const langNames = {
    cs: 'Czech',
    en: 'English',
    de: 'German',
    uk: 'Ukrainian'
  };

  const prompt = `You are a professional translator specializing in adult entertainment content for an escort website.

Translate the following blog post from ${langNames[fromLang]} to ${langNames[toLang]}.

IMPORTANT RULES:
- Maintain the exact HTML formatting (preserve all <p>, <strong>, <em>, <hr>, <blockquote> tags)
- Keep the tone professional yet engaging
- Adapt cultural references appropriately
- Use natural, fluent language (not literal translation)
- Preserve the structure and paragraph breaks
- Keep proper names and brand names unchanged
- Maintain SEO-friendly language

Original content:

TITLE:
${content.title}

EXCERPT:
${content.excerpt}

CONTENT:
${content.content}

${content.meta_description ? `META DESCRIPTION:\n${content.meta_description}` : ''}

Please respond ONLY with a JSON object in this exact format:
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "content": "translated content with HTML",
  "meta_description": "translated meta description"
}`;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      temperature: 0.7,
      system: 'You are a professional translator. Always respond with valid JSON only, no additional text.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseContent = message.content[0];
    if (responseContent.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const translated = JSON.parse(responseContent.text);

    return {
      title: translated.title || content.title,
      excerpt: translated.excerpt || content.excerpt,
      content: translated.content || content.content,
      meta_description: translated.meta_description || content.meta_description
    };

  } catch (error) {
    console.error('[Auto-Translate] Error:', error);
    throw new Error('Translation failed');
  }
}

/**
 * Auto-translate to all 4 languages
 */
export async function translateToAllLanguages(
  content: {
    title: string;
    excerpt: string;
    content: string;
    meta_description?: string;
  },
  sourceLang: 'cs' | 'en' | 'de' | 'uk'
): Promise<Record<string, any>> {

  const languages: Array<'cs' | 'en' | 'de' | 'uk'> = ['cs', 'en', 'de', 'uk'];
  const translations: Record<string, any> = {};

  // Keep source language as-is
  translations[sourceLang] = content;

  // Translate to other languages
  for (const lang of languages) {
    if (lang === sourceLang) continue;

    console.log(`[Auto-Translate] Translating ${sourceLang} → ${lang}...`);

    try {
      translations[lang] = await translateBlogPost(content, sourceLang, lang);
    } catch (error) {
      console.error(`[Auto-Translate] Failed ${sourceLang} → ${lang}:`, error);
      translations[lang] = null;
    }
  }

  return translations;
}
