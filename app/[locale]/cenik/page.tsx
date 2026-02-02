import { Metadata } from 'next';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';
import { generatePageMetadata } from '@/lib/seo-metadata';
import PricingClient from './PricingClient';
import { BreadcrumbListSchema, ServiceSchema } from '@/components/JsonLd';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

interface PricingPlan {
  id: number;
  duration: number;
  price: number;
  is_popular: boolean;
  title: string;
  features: string[];
}

interface PricingExtra {
  id: number;
  name: string;
  price: number;
}

interface PricingData {
  plans: PricingPlan[];
  extras: PricingExtra[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/cenik`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/cenik',
        en: 'https://www.lovelygirls.cz/en/cenik',
        de: 'https://www.lovelygirls.cz/de/cenik',
        uk: 'https://www.lovelygirls.cz/uk/cenik',
      },
    },
  };
}

// Server-side data fetching - directly from database
async function getPricingData(lang: string): Promise<PricingData> {
  try {
    // Create cache key
    const cacheKey = `pricing-${lang}`;
    const cached = cache.get<PricingData>(cacheKey, 3600000); // 1 hour cache
    if (cached) {
      return cached;
    }

    // Get all pricing plans with their features
    const plansResult = await db.execute(
      'SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const plans: PricingPlan[] = [];
    for (const plan of plansResult.rows) {
      const planData = plan as any;
      const featuresResult = await db.execute({
        sql: 'SELECT * FROM pricing_plan_features WHERE plan_id = ? ORDER BY display_order ASC',
        args: [planData.id]
      });

      // Map to localized format
      plans.push({
        id: Number(planData.id),
        duration: Number(planData.duration),
        price: Number(planData.price),
        is_popular: Boolean(planData.is_popular),
        title: planData[`title_${lang}`] || planData.title_cs,
        features: featuresResult.rows.map((f: any) => f[`feature_${lang}`] || f.feature_cs)
      });
    }

    // Get all extras
    const extrasResult = await db.execute(
      'SELECT * FROM pricing_extras WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const extras: PricingExtra[] = extrasResult.rows.map((extra: any) => ({
      id: Number(extra.id),
      name: extra[`name_${lang}`] || extra.name_cs,
      price: Number(extra.price)
    }));

    const responseData = { plans, extras };

    // Cache the response
    cache.set(cacheKey, responseData);

    return responseData;
  } catch (error) {
    console.error('Get pricing error:', error);
    // Return empty data on error
    return { plans: [], extras: [] };
  }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch pricing data server-side
  const { plans, extras } = await getPricingData(locale);

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Erotic Massage",
    "provider": {
      "@type": "LocalBusiness",
      "name": "LovelyGirls Prague",
      "telephone": "+420734332131"
    },
    "areaServed": {
      "@type": "City",
      "name": "Praha"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Massage Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Quick Relax",
            "description": "30 minut - Erotická masáž, společná sprcha, uvolnění na závěr"
          },
          "price": "1500",
          "priceCurrency": "CZK"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Classic Experience",
            "description": "60 minut - Klasická + erotická masáž, body to body, společná sprcha, líbání"
          },
          "price": "2500",
          "priceCurrency": "CZK"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Pleasure",
            "description": "90 minut - Vše z Classic Experience, tantra elementy, delší relaxace, sklenka sektu"
          },
          "price": "3500",
          "priceCurrency": "CZK"
        }
      ]
    }
  };

  return (
    <>
      <ServiceSchema
        name="Escort služby a ceník - LovelyGirls Prague"
        description="Ceník escort služeb a erotických masáží v Praze. Quick Relax, Classic Experience, Premium Pleasure."
        url={`https://www.lovelygirls.cz/${locale}/cenik`}
      />
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: 'Ceník', url: `https://www.lovelygirls.cz/${locale}/cenik` }
      ]} />
      <PricingClient
        locale={locale}
        plans={plans}
        extras={extras}
        schemaData={schemaData}
      />
    </>
  );
}
