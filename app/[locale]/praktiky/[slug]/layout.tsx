import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-metadata';
import { getServiceById, getServiceName } from '@/lib/services';
import { ServiceSchema, CollectionPageSchema, BreadcrumbListSchema } from '@/components/JsonLd';

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const pagePath = `/${locale}/praktiky/${slug}`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        'cs': `https://www.lovelygirls.cz/cs/praktiky/${slug}`,
        'en': `https://www.lovelygirls.cz/en/praktiky/${slug}`,
        'de': `https://www.lovelygirls.cz/de/praktiky/${slug}`,
        'uk': `https://www.lovelygirls.cz/uk/praktiky/${slug}`
      }
    }
  };
}

export default async function PraktikyLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const serviceName = getServiceName(slug, locale);
  const baseUrl = 'https://www.lovelygirls.cz';

  return (
    <>
      <ServiceSchema
        name={serviceName}
        description={`${serviceName} – escort služby v Praze`}
        url={`${baseUrl}/${locale}/praktiky/${slug}`}
      />
      <CollectionPageSchema
        name={serviceName}
        description={`${serviceName} – escort dívky nabízející tuto službu v Praze`}
        url={`${baseUrl}/${locale}/praktiky/${slug}`}
        numberOfItems={0}
      />
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `${baseUrl}/${locale}` },
        { name: 'Praktiky', url: `${baseUrl}/${locale}/divky` },
        { name: serviceName, url: `${baseUrl}/${locale}/praktiky/${slug}` }
      ]} />
      {children}
    </>
  );
}
