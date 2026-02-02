import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo-metadata'
import { getHashtagById, getHashtagName } from '@/lib/hashtags'
import { CollectionPageSchema, BreadcrumbListSchema } from '@/components/JsonLd'

// ISR - Revalidate every 60 seconds for SEO updates
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params
  const pagePath = `/${locale}/hashtag/${id}`

  // Load SEO from database (no fallback - noindex if not in DB)
  const metadata = await generatePageMetadata(pagePath)

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        'cs': `https://www.lovelygirls.cz/cs/hashtag/${id}`,
        'en': `https://www.lovelygirls.cz/en/hashtag/${id}`,
        'de': `https://www.lovelygirls.cz/de/hashtag/${id}`,
        'uk': `https://www.lovelygirls.cz/uk/hashtag/${id}`
      }
    }
  }
}

export default async function HashtagLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const hashtagName = getHashtagName(id, locale);
  const baseUrl = 'https://www.lovelygirls.cz';

  return (
    <>
      <CollectionPageSchema
        name={hashtagName}
        description={`${hashtagName} – escort společnice v Praze`}
        url={`${baseUrl}/${locale}/hashtag/${id}`}
        numberOfItems={0}
      />
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `${baseUrl}/${locale}` },
        { name: 'Hashtags', url: `${baseUrl}/${locale}/divky` },
        { name: hashtagName, url: `${baseUrl}/${locale}/hashtag/${id}` }
      ]} />
      {children}
    </>
  );
}
