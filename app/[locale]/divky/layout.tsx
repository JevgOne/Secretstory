import { Metadata } from 'next';
import { generatePageMetadata, getDefaultSEO } from '@/lib/seo-metadata';

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/divky`;

  // Load SEO from database (no fallback - noindex if not in DB)
  const metadata = await generatePageMetadata(pagePath);

  // Add language alternates
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        'cs': '/cs/divky',
        'en': '/en/divky',
        'de': '/de/divky',
        'uk': '/uk/divky'
      }
    }
  };
}

export default function DivkyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
