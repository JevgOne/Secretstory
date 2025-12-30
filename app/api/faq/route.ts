import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';

export const revalidate = 3600; // 1 hour ISR

// GET - Fetch FAQ items for public (localized)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'cs';

    // Check cache first
    const cacheKey = `faq-${lang}`;
    const cached = cache.get(cacheKey, 3600000); // 1 hour cache
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT'
        }
      });
    }

    // Fetch from database
    const faqsResult = await db.execute(
      'SELECT * FROM faq_items WHERE is_active = 1 ORDER BY category ASC, display_order ASC'
    );

    // Map to localized format
    const faqs = faqsResult.rows.map((faq: any) => ({
      id: faq.id,
      category: faq.category,
      display_order: faq.display_order,
      question: faq[`question_${lang}`] || faq.question_cs,
      answer: faq[`answer_${lang}`] || faq.answer_cs
    }));

    const response = {
      success: true,
      faqs
    };

    // Cache the response
    cache.set(cacheKey, response);

    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQ items' },
      { status: 500 }
    );
  }
}
