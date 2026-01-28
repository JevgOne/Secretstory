import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization to support runtime API key injection
function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

/**
 * AI Review - check and improve translated content
 * Acts as a copywriter/editor to ensure quality
 */
export async function aiReviewContent(
  content: {
    title: string;
    excerpt: string;
    content: string;
    meta_description?: string;
  },
  language: 'cs' | 'en' | 'de' | 'uk'
): Promise<{
  title: string;
  excerpt: string;
  content: string;
  meta_description?: string;
  review_notes: string;
}> {
  const langNames = {
    cs: 'Czech',
    en: 'English',
    de: 'German',
    uk: 'Ukrainian'
  };

  const prompt = `You are a professional copywriter and editor for a luxury escort agency website (LovelyGirls.cz).

Review and improve the following ${langNames[language]} blog post. Your job is to:

1. **Fix grammar and spelling** errors
2. **Improve fluency** - make it sound natural, not like a translation
3. **Ensure consistent tone** - elegant, sophisticated, like a lifestyle magazine
4. **Check SEO** - ensure keywords are naturally integrated
5. **Verify no vulgar content** - keep it professional

IMPORTANT: Keep the same meaning and structure, just improve the quality.

Content to review:

TITLE:
${content.title}

EXCERPT:
${content.excerpt}

CONTENT:
${content.content}

${content.meta_description ? `META DESCRIPTION:\n${content.meta_description}` : ''}

Respond ONLY with a JSON object:
{
  "title": "improved title",
  "excerpt": "improved excerpt",
  "content": "improved content with HTML preserved",
  "meta_description": "improved meta description",
  "review_notes": "Brief notes on what was changed (1-2 sentences)"
}`;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      temperature: 0.3, // Lower temperature for more consistent editing
      system: 'You are a professional copywriter and editor. Always respond with valid JSON only.',
      messages: [{ role: 'user', content: prompt }]
    });

    const responseContent = message.content[0];
    if (responseContent.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Clean up response
    let jsonText = responseContent.text.trim();
    if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7);
    else if (jsonText.startsWith('```')) jsonText = jsonText.slice(3);
    if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
    jsonText = jsonText.trim();

    const reviewed = JSON.parse(jsonText);

    return {
      title: reviewed.title || content.title,
      excerpt: reviewed.excerpt || content.excerpt,
      content: reviewed.content || content.content,
      meta_description: reviewed.meta_description || content.meta_description,
      review_notes: reviewed.review_notes || 'No changes needed'
    };

  } catch (error) {
    console.error('[AI Review] Error:', error);
    throw new Error('AI Review failed');
  }
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
 * Auto-translate to all 4 languages with AI review
 */
export async function translateToAllLanguages(
  content: {
    title: string;
    excerpt: string;
    content: string;
    meta_description?: string;
  },
  sourceLang: 'cs' | 'en' | 'de' | 'uk',
  enableAiReview: boolean = true
): Promise<Record<string, any>> {

  const languages: Array<'cs' | 'en' | 'de' | 'uk'> = ['cs', 'en', 'de', 'uk'];
  const translations: Record<string, any> = {};

  // Keep source language as-is (but review it too if enabled)
  if (enableAiReview) {
    console.log(`[AI Review] Reviewing source content (${sourceLang})...`);
    try {
      const reviewed = await aiReviewContent(content, sourceLang);
      translations[sourceLang] = {
        ...reviewed,
        reviewed_by: 'AI Copywriter'
      };
      console.log(`[AI Review] ✓ Source reviewed: ${reviewed.review_notes}`);
    } catch (error) {
      console.error(`[AI Review] Failed for source:`, error);
      translations[sourceLang] = content;
    }
  } else {
    translations[sourceLang] = content;
  }

  // Translate to other languages
  for (const lang of languages) {
    if (lang === sourceLang) continue;

    console.log(`[Auto-Translate] Translating ${sourceLang} → ${lang}...`);

    try {
      // Step 1: Translate
      const translated = await translateBlogPost(content, sourceLang, lang);

      // Step 2: AI Review (if enabled)
      if (enableAiReview) {
        console.log(`[AI Review] Reviewing ${lang} translation...`);
        try {
          const reviewed = await aiReviewContent(translated, lang);
          translations[lang] = {
            ...reviewed,
            reviewed_by: 'AI Copywriter'
          };
          console.log(`[AI Review] ✓ ${lang} reviewed: ${reviewed.review_notes}`);
        } catch (reviewError) {
          console.error(`[AI Review] Failed for ${lang}, using raw translation`);
          translations[lang] = translated;
        }
      } else {
        translations[lang] = translated;
      }

    } catch (error) {
      console.error(`[Auto-Translate] Failed ${sourceLang} → ${lang}:`, error);
      translations[lang] = null;
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return translations;
}
