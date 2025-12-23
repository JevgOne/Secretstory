// Review translation utility using client-side caching
// Translates reviews on-demand based on current locale

interface TranslationCache {
  [key: string]: string;
}

// In-memory cache for translated reviews (per session)
const translationCache: TranslationCache = {};

/**
 * Translates review text from Czech to target language
 * Uses cache to avoid re-translating the same text
 *
 * @param text - Original text (usually in Czech)
 * @param targetLang - Target language (en, de, uk)
 * @param sourceLang - Source language (default: cs)
 * @returns Translated text or original if translation fails
 */
export async function translateReviewText(
  text: string,
  targetLang: string,
  sourceLang: string = 'cs'
): Promise<string> {
  // If target is Czech or same as source, return original
  if (targetLang === 'cs' || targetLang === sourceLang) {
    return text;
  }

  // Create cache key
  const cacheKey = `${text}_${sourceLang}_${targetLang}`;

  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang
      })
    });

    const data = await response.json();

    if (data.success && data.translatedText) {
      // Store in cache
      translationCache[cacheKey] = data.translatedText;
      return data.translatedText;
    }

    // Return original if translation failed
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text on error
    return text;
  }
}

/**
 * Translates a complete review object (title + content)
 *
 * @param review - Review object with title and content
 * @param targetLang - Target language
 * @returns Review with translated title and content
 */
export async function translateReview<T extends { title?: string; content: string }>(
  review: T,
  targetLang: string
): Promise<T> {
  // If Czech, return original
  if (targetLang === 'cs') {
    return review;
  }

  const [translatedTitle, translatedContent] = await Promise.all([
    review.title ? translateReviewText(review.title, targetLang) : Promise.resolve(undefined),
    translateReviewText(review.content, targetLang)
  ]);

  return {
    ...review,
    title: translatedTitle || review.title,
    content: translatedContent
  };
}

/**
 * Translates multiple reviews in parallel
 *
 * @param reviews - Array of review objects
 * @param targetLang - Target language
 * @returns Array of translated reviews
 */
export async function translateReviews<T extends { title?: string; content: string }>(
  reviews: T[],
  targetLang: string
): Promise<T[]> {
  // If Czech, return originals
  if (targetLang === 'cs') {
    return reviews;
  }

  // Translate all reviews in parallel
  return Promise.all(
    reviews.map(review => translateReview(review, targetLang))
  );
}
