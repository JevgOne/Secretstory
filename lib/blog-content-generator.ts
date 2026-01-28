import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization to support runtime API key injection
function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

export interface BlogPostIdea {
  title: string;
  category: string; // Any category including legacy ones
  excerpt: string;
  keywords: string[];
  week_type?: number; // Optional for backward compatibility
}

export interface GeneratedBlogPost {
  week_type: number;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  content: string;
  excerpt: string;
  reading_time: number;
}

// Map week type to category
const WEEK_CATEGORIES = {
  1: 'pribehy-spolecnic',
  2: 'rady-a-tipy',
  3: 'novinky',
  4: 'pribehy-spolecnic' // Rotace zpět
} as const;

const BLOG_WRITER_SYSTEM_PROMPT = `Jsi blog writer pro LovelyGirls.cz - luxusní escort agenturu v Praze.

## TVŮJ ÚKOL
Napiš SEO článek. Střídej 3 kategorie podle týdne:

**Týden 1 & 4: PŘÍBĚHY SPOLEČNIC**
- Témata: zážitky společnic, den v životě, zajímavá setkání, motivace proč tuto práci dělají
- Keywords: "escort příběhy", "společnice praha", "zážitky escort"
- Tón: osobní, autentický, elegantní (NIKDY vulgární)

**Týden 2: RADY A TIPY**
- Témata: jak si vybrat společnici, etiketa, první návštěva, kam vzít společnici
- Keywords: "escort praha tipy", "jak vybrat escort", "escort etiketa"
- Tón: informativní, přátelský, profesionální

**Týden 3: NOVINKY**
- Témata: nové společnice, akce, změny v nabídce, trendy v escort světě
- Keywords: "escort praha novinky", "nové společnice praha"
- Tón: aktuální, zajímavý, informativní

## JAK PSÁT

**Tón:** Elegantní, sofistikovaný, jako lifestyle magazín. NIKDY vulgární.

**Struktura:**
- Délka: 600-800 slov
- H1 s keywordem (jako první element)
- 3-4 sekce s H2
- Závěr s CTA → odkaz na /cs/divky nebo /cs/kontakt

**SEO:**
- Keyword v H1, prvním odstavci, 2-3x v textu
- Meta title: do 60 znaků
- Meta description: do 155 znaků
- 1-2 interní odkazy v textu

**ZAKÁZÁNO:**
- Explicitní sexuální popisy
- Vulgarity
- Konkrétní ceny (odkázat na /cs/cenik)
- Generic obsah co nesouvisí s webem

## OUTPUT FORMÁT
Odpověz POUZE validním JSON objektem bez markdown bloků:
{
  "week_type": 1-4,
  "title": "Titulek článku s keywordem",
  "slug": "url-friendly-slug",
  "meta_title": "SEO title do 60 znaků",
  "meta_description": "Meta popis do 155 znaků",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "content": "<h1>...</h1><p>...</p><h2>...</h2><p>...</p>...",
  "excerpt": "Krátký popis 150-200 znaků",
  "reading_time": 3
}`;

/**
 * Get current week type (1-4) based on date
 */
export function getWeekType(date: Date = new Date()): number {
  const weekOfMonth = Math.ceil(date.getDate() / 7);
  return ((weekOfMonth - 1) % 4) + 1;
}

/**
 * Generate a single blog post for the current week
 */
export async function generateWeeklyBlogPost(
  weekType?: number,
  existingTitles: string[] = []
): Promise<GeneratedBlogPost> {
  const currentWeekType = weekType || getWeekType();

  const existingTitlesInfo = existingTitles.length > 0
    ? `\n\nEXISTUJÍCÍ ČLÁNKY (vyhni se podobným tématům):\n${existingTitles.map(t => `- ${t}`).join('\n')}`
    : '';

  const prompt = `Aktuální týden: ${currentWeekType}
Kategorie: ${WEEK_CATEGORIES[currentWeekType as keyof typeof WEEK_CATEGORIES]}
${existingTitlesInfo}

Napiš nový unikátní článek pro tento týden. Vymysli originální téma které ještě nebylo zpracováno.`;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      system: BLOG_WRITER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Clean up response - remove markdown code blocks if present
    let jsonText = content.text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const article = JSON.parse(jsonText) as GeneratedBlogPost;

    // Validate required fields
    if (!article.title || !article.content || !article.slug) {
      throw new Error('Missing required fields in generated article');
    }

    return article;

  } catch (error) {
    console.error('[Blog Generator] Error generating weekly post:', error);
    throw new Error('Failed to generate blog post');
  }
}

/**
 * Generate blog post ideas for a month (4 articles, one per week)
 */
export async function generateBlogIdeasForMonth(): Promise<BlogPostIdea[]> {
  const ideas: BlogPostIdea[] = [];

  const categoryInfo = {
    1: {
      category: 'pribehy-spolecnic',
      topics: ['zážitky společnic', 'den v životě', 'zajímavá setkání'],
      keywords: ['escort příběhy', 'společnice praha', 'zážitky escort']
    },
    2: {
      category: 'rady-a-tipy',
      topics: ['jak vybrat společnici', 'etiketa', 'první návštěva'],
      keywords: ['escort praha tipy', 'jak vybrat escort', 'escort etiketa']
    },
    3: {
      category: 'novinky',
      topics: ['nové společnice', 'akce', 'trendy'],
      keywords: ['escort praha novinky', 'nové společnice praha']
    },
    4: {
      category: 'pribehy-spolecnic',
      topics: ['motivace', 'příběhy z praxe', 'zkušenosti'],
      keywords: ['escort příběhy', 'společnice zážitky']
    }
  };

  for (let week = 1; week <= 4; week++) {
    const info = categoryInfo[week as keyof typeof categoryInfo];
    ideas.push({
      title: `Článek týden ${week} - ${info.category}`,
      category: info.category,
      excerpt: `Téma z kategorie: ${info.topics.join(', ')}`,
      keywords: info.keywords,
      week_type: week
    });
  }

  return ideas;
}

/**
 * Generate full blog post content from an idea
 * Supports both new weekly format and legacy format with direct idea
 */
export async function generateBlogPostContent(idea: BlogPostIdea): Promise<{
  title: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  read_time: number;
}> {
  // If week_type is provided, use the new weekly generator
  if (idea.week_type !== undefined) {
    const article = await generateWeeklyBlogPost(idea.week_type);
    return {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      meta_keywords: article.keywords.join(', '),
      read_time: article.reading_time
    };
  }

  // Legacy mode: generate content directly from the idea
  const prompt = `Napiš blogový článek v češtině na toto téma:

NÁZEV: ${idea.title}
KATEGORIE: ${idea.category}
POPIS: ${idea.excerpt}
KLÍČOVÁ SLOVA: ${idea.keywords.join(', ')}

Pravidla:
- Délka: 600-800 slov
- Elegantní, sofistikovaný tón jako lifestyle magazín
- NIKDY vulgární nebo explicitní
- HTML formátování: <h1>, <h2>, <p>, <strong>, <em>
- H1 s keywordem jako první element
- 3-4 sekce s H2
- Závěr s CTA odkazem na /cs/divky nebo /cs/kontakt
- SEO: keyword v H1, prvním odstavci, 2-3x v textu

Odpověz POUZE validním JSON objektem:
{
  "title": "Finální titulek článku",
  "excerpt": "Popis 150-200 znaků",
  "content": "<h1>...</h1><p>...</p>...",
  "meta_title": "SEO title do 60 znaků",
  "meta_description": "Meta popis do 155 znaků",
  "keywords": ["kw1", "kw2"],
  "reading_time": 3
}`;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      system: 'Jsi copywriter pro luxusní escort agenturu LovelyGirls.cz v Praze. Píšeš elegantní, SEO-optimalizované články.',
      messages: [{ role: 'user', content: prompt }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    let jsonText = content.text.trim();
    if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7);
    else if (jsonText.startsWith('```')) jsonText = jsonText.slice(3);
    if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
    jsonText = jsonText.trim();

    const article = JSON.parse(jsonText);

    return {
      title: article.title || idea.title,
      excerpt: article.excerpt || idea.excerpt,
      content: article.content || '',
      meta_title: article.meta_title || article.title,
      meta_description: article.meta_description || article.excerpt,
      meta_keywords: article.keywords?.join(', ') || idea.keywords.join(', '),
      read_time: article.reading_time || 3
    };

  } catch (error) {
    console.error('[Blog Generator] Error generating legacy content:', error);
    throw new Error('Failed to generate blog content');
  }
}

/**
 * Generate multiple articles for the month
 */
export async function generateMonthlyBlogPosts(
  existingTitles: string[] = []
): Promise<GeneratedBlogPost[]> {
  const posts: GeneratedBlogPost[] = [];
  const errors: string[] = [];

  for (let week = 1; week <= 4; week++) {
    try {
      console.log(`[Blog Generator] Generating article for week ${week}...`);

      const allTitles = [...existingTitles, ...posts.map(p => p.title)];
      const article = await generateWeeklyBlogPost(week, allTitles);
      posts.push(article);

      console.log(`[Blog Generator] ✓ Week ${week}: ${article.title}`);

      // Delay between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`[Blog Generator] ✗ Week ${week} failed:`, error);
      errors.push(`Week ${week}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (posts.length === 0) {
    throw new Error(`All articles failed to generate: ${errors.join('; ')}`);
  }

  return posts;
}
