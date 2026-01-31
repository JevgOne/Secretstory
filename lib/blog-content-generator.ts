import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization to support runtime API key injection
function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

export interface BlogPostIdea {
  title: string;
  category: 'sex-prace' | 'pribehy-z-bordelu' | 'rady-a-tipy' | 'novinky' | 'ostatni';
  excerpt: string;
  keywords: string[];
}

/**
 * Generate blog post ideas for a month
 */
export async function generateBlogIdeasForMonth(): Promise<BlogPostIdea[]> {

  const prompt = `You are a content strategist for an escort website in Prague (LovelyGirls.cz).

Generate 30 blog post ideas (one per day for a month) that would be valuable for:
- Potential clients looking for escorts in Prague
- Women interested in becoming escorts
- General information about the escort industry

Categories to cover:
- sex-prace (Sex work) - guides, tips, safety
- pribehy-z-bordelu (Stories from brothels) - real experiences, testimonials
- rady-a-tipy (Tips & advice) - client etiquette, booking tips
- novinky (News) - industry updates, events
- ostatni (Other) - general topics

Each article should be:
- SEO-friendly
- Professional yet engaging
- Informative and valuable
- Relevant to Prague escort scene

Respond with a JSON array of 30 blog post ideas in this format:
[
  {
    "title": "Article title in Czech",
    "category": "sex-prace",
    "excerpt": "Short description (100-150 chars)",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
]`;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.8,
      system: 'You are a content strategist. Always respond with valid JSON only.',
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

    const response = JSON.parse(content.text);
    return response.ideas || response.articles || [];

  } catch (error) {
    console.error('[Content Generator] Error generating ideas:', error);
    throw new Error('Failed to generate blog ideas');
  }
}

/**
 * Generate full blog post content from an idea
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

  const prompt = `You are a professional content writer for an escort website.

Write a complete, high-quality blog post in Czech based on this idea:

TITLE: ${idea.title}
CATEGORY: ${idea.category}
EXCERPT: ${idea.excerpt}
KEYWORDS: ${idea.keywords.join(', ')}

Requirements:
- Write in Czech language
- Length: 800-1200 words
- Use proper HTML formatting: <p>, <strong>, <em>, <hr class="scene-break" />, <blockquote>
- Include 4-6 well-structured sections
- Professional yet conversational tone
- SEO-optimized content
- Include practical tips and advice
- Add real-world examples where appropriate
- End with a clear call-to-action

Respond ONLY with a JSON object:
{
  "title": "Final article title",
  "excerpt": "Engaging 150-200 char excerpt",
  "content": "Full HTML content with paragraphs",
  "meta_title": "SEO title (50-60 chars)",
  "meta_description": "SEO description (120-160 chars)",
  "meta_keywords": "keyword1, keyword2, keyword3",
  "read_time": 5
}`;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0.7,
      system: 'You are a professional content writer. CRITICAL RULES: 1) Always respond with valid JSON only using DOUBLE QUOTES for all keys and string values. 2) Inside text content, use apostrophes (not quotes) or escape quotes as \\". 3) Properly escape all special characters (\\n, \\t, etc).',
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

    // Fix common JSON issues before parsing
    let jsonText = content.text;
    // Remove any text before first { and after last }
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }

    const article = JSON.parse(jsonText);

    return {
      title: article.title || idea.title,
      excerpt: article.excerpt || idea.excerpt,
      content: article.content || '',
      meta_title: article.meta_title || article.title,
      meta_description: article.meta_description || article.excerpt,
      meta_keywords: article.meta_keywords || idea.keywords.join(', '),
      read_time: article.read_time || 5
    };

  } catch (error) {
    console.error('[Content Generator] Error generating content:', error);
    throw new Error('Failed to generate blog content');
  }
}
