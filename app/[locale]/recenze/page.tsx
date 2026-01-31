import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo-metadata';
import { db } from '@/lib/db';
import RecenzeClient from './RecenzeClient';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/recenze`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/recenze',
        en: 'https://www.lovelygirls.cz/en/recenze',
        de: 'https://www.lovelygirls.cz/de/recenze',
        uk: 'https://www.lovelygirls.cz/uk/recenze',
      },
    },
  };
}

// Server-side: fetch initial reviews for SSR
async function getInitialReviews() {
  try {
    const result = await db.execute({
      sql: `
        SELECT r.id, r.girl_id, r.author_name, r.rating, r.title, r.content,
               r.created_at, r.status, r.vibe, r.tags, r.helpful_count,
               g.name as girl_name, g.slug as girl_slug,
               p.url as girl_photo
        FROM reviews r
        JOIN girls g ON r.girl_id = g.id
        LEFT JOIN girl_photos p ON g.id = p.girl_id AND p.is_primary = 1
        WHERE r.status = 'approved'
        ORDER BY r.created_at DESC
        LIMIT 20
      `,
      args: [],
    });
    return result.rows as any[];
  } catch (error) {
    console.error('Error fetching initial reviews:', error);
    return [];
  }
}

export default async function RecenzePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const reviews = await getInitialReviews();

  return (
    <>
      {/* SEO: Server-rendered review content for crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>{t('reviews_title')}</h1>
        <p>{t('reviews_subtitle')}</p>
        {reviews.length > 0 && (
          <div>
            <p>{reviews.length} ověřených recenzí</p>
            {reviews.slice(0, 10).map((review: any) => (
              <article key={review.id}>
                <h3>{review.title || `Recenze od ${review.author_name}`}</h3>
                <p>Hodnocení: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                {review.girl_name && <p>Pro: {review.girl_name}</p>}
                <p>{review.content}</p>
                <time>{review.created_at}</time>
              </article>
            ))}
          </div>
        )}
      </div>

      <RecenzeClient />
    </>
  );
}
