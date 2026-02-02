import { Metadata } from 'next';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';
import { generatePageMetadata } from '@/lib/seo-metadata';
import DiscountsClient from './DiscountsClient';
import { BreadcrumbListSchema } from '@/components/JsonLd';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/discounts`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/discounts',
        en: 'https://www.lovelygirls.cz/en/discounts',
        de: 'https://www.lovelygirls.cz/de/discounts',
        uk: 'https://www.lovelygirls.cz/uk/discounts',
      },
    },
  };
}

interface Discount {
  id: number;
  icon: string;
  name: string;
  description: string;
  is_featured: boolean;
}

interface LoyaltyTier {
  id: number;
  visits_required: number;
  discount_percentage: number;
  title: string;
  description: string;
}

interface DiscountsData {
  discounts: Discount[];
  featuredDiscount: Discount | null;
  loyaltyTiers: LoyaltyTier[];
}

// Server-side data fetching - directly from database
async function getDiscountsData(lang: string): Promise<DiscountsData> {
  try {
    // Create cache key
    const cacheKey = `discounts-${lang}`;
    const cached = cache.get<DiscountsData>(cacheKey, 3600000); // 1 hour cache
    if (cached) {
      return cached;
    }

    // Get all discounts
    const discountsResult = await db.execute(
      'SELECT * FROM discounts WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const discounts: Discount[] = discountsResult.rows.map((discount: any) => ({
      id: Number(discount.id),
      icon: discount.icon,
      is_featured: Boolean(discount.is_featured),
      name: discount[`name_${lang}`] || discount.name_cs,
      description: discount[`description_${lang}`] || discount.description_cs
    }));

    // Get featured discount (if any)
    const featuredDiscount = discounts.find((d: Discount) => d.is_featured) || null;

    // Get all loyalty tiers
    const loyaltyResult = await db.execute(
      'SELECT * FROM loyalty_tiers ORDER BY display_order ASC'
    );

    const loyaltyTiers: LoyaltyTier[] = loyaltyResult.rows.map((tier: any) => ({
      id: Number(tier.id),
      visits_required: Number(tier.visits_required),
      discount_percentage: Number(tier.discount_percentage),
      title: tier[`title_${lang}`] || tier.title_cs,
      description: tier[`description_${lang}`] || tier.description_cs
    }));

    const responseData = {
      discounts,
      featuredDiscount,
      loyaltyTiers
    };

    // Cache the response
    cache.set(cacheKey, responseData);

    return responseData;
  } catch (error) {
    console.error('Get discounts error:', error);
    // Return empty data on error
    return {
      discounts: [],
      featuredDiscount: null,
      loyaltyTiers: []
    };
  }
}

export default async function DiscountsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch discounts data server-side
  const { discounts, featuredDiscount, loyaltyTiers } = await getDiscountsData(locale);

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        "name": "Slevy a Akce - LovelyGirls Prague",
        "description": "Aktuální slevy a speciální nabídky",
        "itemListElement": discounts.map((discount, index) => ({
          "@type": "Offer",
          "position": index + 1,
          "name": discount.name,
          "description": discount.description,
          "priceCurrency": "CZK",
          "seller": {
            "@type": "LocalBusiness",
            "name": "LovelyGirls Prague"
          }
        }))
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.lovelygirls.cz/#business",
        "name": "LovelyGirls Prague",
        "url": `https://www.lovelygirls.cz/${locale}/discounts`,
        "telephone": "+420734332131",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Prague",
          "addressCountry": "CZ"
        },
        "priceRange": "$$$$"
      },
      {
        "@type": "WebPage",
        "@id": `https://www.lovelygirls.cz/${locale}/discounts#webpage`,
        "url": `https://www.lovelygirls.cz/${locale}/discounts`,
        "name": "Slevy a Akce - LovelyGirls Prague",
        "description": "Aktuální slevy a speciální nabídky",
        "inLanguage": locale,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.lovelygirls.cz/#website",
          "name": "LovelyGirls Prague",
          "url": "https://www.lovelygirls.cz"
        }
      }
    ]
  };

  return (
    <>
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: 'Slevy', url: `https://www.lovelygirls.cz/${locale}/discounts` }
      ]} />

      {/* SEO: Server-rendered discount content for crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>Slevy a Akce - LovelyGirls Prague</h1>
        <p>Aktuální slevy a speciální nabídky</p>
        {discounts.length > 0 && (
          <ul>
            {discounts.map((discount) => (
              <li key={discount.id}>
                <strong>{discount.icon} {discount.name}</strong>: {discount.description}
              </li>
            ))}
          </ul>
        )}
        {loyaltyTiers.length > 0 && (
          <div>
            <h2>Věrnostní program</h2>
            {loyaltyTiers.map((tier) => (
              <p key={tier.id}>
                {tier.visits_required}+ návštěv: {tier.title} — {tier.description}
              </p>
            ))}
          </div>
        )}
      </div>

      <DiscountsClient
        locale={locale}
        discounts={discounts}
        featuredDiscount={featuredDiscount}
        loyaltySteps={loyaltyTiers}
        schemaData={schemaData}
      />
    </>
  );
}
