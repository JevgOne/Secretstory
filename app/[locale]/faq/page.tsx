import { Metadata } from 'next';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';
import { generatePageMetadata } from '@/lib/seo-metadata';
import FAQClient from './FAQClient';
import { BreadcrumbListSchema, FAQPageSchema } from '@/components/JsonLd';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/faq`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/faq',
        en: 'https://www.lovelygirls.cz/en/faq',
        de: 'https://www.lovelygirls.cz/de/faq',
        uk: 'https://www.lovelygirls.cz/uk/faq',
      },
    },
  };
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// Server-side data fetching - directly from database
async function getFAQData(lang: string): Promise<FAQItem[]> {
  try {
    // Create cache key
    const cacheKey = `faq-${lang}`;
    const cached = cache.get<FAQItem[]>(cacheKey, 3600000); // 1 hour cache
    if (cached) {
      return cached;
    }

    // Fetch from database
    const faqsResult = await db.execute(
      'SELECT * FROM faq_items WHERE is_active = 1 ORDER BY category ASC, display_order ASC'
    );

    // Map to localized format
    const faqs: FAQItem[] = faqsResult.rows.map((faq: any) => ({
      question: faq[`question_${lang}`] || faq.question_cs,
      answer: faq[`answer_${lang}`] || faq.answer_cs,
      category: faq.category
    }));

    // Cache the response
    cache.set(cacheKey, faqs);

    return faqs;
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    // Return empty data on error
    return [];
  }
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch FAQ data server-side
  const faqs = await getFAQData(locale);

  // Schema.org structured data - FAQPage is very important for SEO
  // Only include FAQPage if there are actual FAQs (Google requires mainEntity to be non-empty)
  const schemaGraph: any[] = [];

  if (faqs.length > 0) {
    schemaGraph.push({
      "@type": "FAQPage",
      "name": "FAQ - LovelyGirls Prague",
      "description": "Často kladené otázky o escort službách v Praze",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  schemaGraph.push({
    "@type": "LocalBusiness",
    "@id": "https://www.lovelygirls.cz/#business",
    "name": "LovelyGirls Prague",
    "url": `https://www.lovelygirls.cz/${locale}/faq`,
    "telephone": "+420734332131",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Prague",
      "addressCountry": "CZ"
    }
  });

  schemaGraph.push({
    "@type": "WebPage",
    "@id": `https://www.lovelygirls.cz/${locale}/faq#webpage`,
    "url": `https://www.lovelygirls.cz/${locale}/faq`,
    "name": "FAQ - LovelyGirls Prague",
    "description": "Často kladené otázky o escort službách v Praze",
    "inLanguage": locale,
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.lovelygirls.cz/#website",
      "name": "LovelyGirls Prague",
      "url": "https://www.lovelygirls.cz"
    }
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": schemaGraph
  };

  return (
    <>
      {faqs.length > 0 && (
        <FAQPageSchema faqs={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      )}
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: 'FAQ', url: `https://www.lovelygirls.cz/${locale}/faq` }
      ]} />

      {/* SEO: Server-rendered FAQ content for crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>FAQ - LovelyGirls Prague</h1>
        <p>Často kladené otázky o escort službách v Praze</p>
        {faqs.map((faq, i) => (
          <div key={i}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <FAQClient
        locale={locale}
        faqs={faqs}
        schemaData={schemaData}
      />
    </>
  );
}
