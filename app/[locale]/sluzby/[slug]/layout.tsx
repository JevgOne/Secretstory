import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-metadata';
import { ServiceSchema, BreadcrumbListSchema } from '@/components/JsonLd';

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const pagePath = `/${locale}/sluzby/${slug}`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        'cs': `https://www.lovelygirls.cz/cs/sluzby/${slug}`,
        'en': `https://www.lovelygirls.cz/en/sluzby/${slug}`,
        'de': `https://www.lovelygirls.cz/de/sluzby/${slug}`,
        'uk': `https://www.lovelygirls.cz/uk/sluzby/${slug}`
      }
    }
  };
}

export default async function SluzbyDetailLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const baseUrl = 'https://www.lovelygirls.cz';
  // Use slug as readable name (will be overridden by page's own breadcrumbs visually)
  const readableName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <ServiceSchema
        name={readableName}
        description={`${readableName} – escort služby v Praze`}
        url={`${baseUrl}/${locale}/sluzby/${slug}`}
      />
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `${baseUrl}/${locale}` },
        { name: 'Služby', url: `${baseUrl}/${locale}/sluzby` },
        { name: readableName, url: `${baseUrl}/${locale}/sluzby/${slug}` }
      ]} />
      {children}
    </>
  );
}
