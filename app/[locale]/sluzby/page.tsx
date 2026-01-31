import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo-metadata';
import { SERVICES, SERVICE_CATEGORIES } from '@/lib/services-data';
import SluzbyClient from './SluzbyClient';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/sluzby`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/sluzby',
        en: 'https://www.lovelygirls.cz/en/sluzby',
        de: 'https://www.lovelygirls.cz/de/sluzby',
        uk: 'https://www.lovelygirls.cz/uk/sluzby',
      },
    },
  };
}

export default async function SluzbyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  // Server-rendered content visible to crawlers (before JS hydration)
  const servicesByCategory = SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof SERVICES>);

  return (
    <>
      {/* SEO: Server-rendered content for crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>{t('page_title')}</h1>
        <p>{t('page_subtitle')}</p>
        {Object.entries(servicesByCategory).map(([category, services]) => (
          <div key={category}>
            <h2>
              {SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES]?.[locale as 'cs'] || category}
            </h2>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <strong>{service.name[locale as keyof typeof service.name] || service.name.cs}</strong>
                  {' — '}
                  {service.description[locale as keyof typeof service.description] || service.description.cs}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SluzbyClient />
    </>
  );
}
