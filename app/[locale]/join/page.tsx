import { Metadata } from 'next';
import JoinClient from './JoinClient';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

// Join page is noindex (blocked in robots.txt)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Přidej se k nám | LovelyGirls Prague',
    description: 'Staň se součástí LovelyGirls Prague. Vyplň jednoduchý formulář a my se ti brzy ozveme.',
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/join',
        en: 'https://www.lovelygirls.cz/en/join',
        de: 'https://www.lovelygirls.cz/de/join',
        uk: 'https://www.lovelygirls.cz/uk/join',
      },
    },
  };
}

export default async function JoinPage() {
  return (
    <>
      {/* SEO: Server-rendered content (noindex page, minimal) */}
      <div className="sr-only" aria-hidden="false">
        <h1>Staň se součástí LovelyGirls</h1>
        <p>Vyplň jednoduchý formulář a my se ti brzy ozveme.</p>
      </div>

      <JoinClient />
    </>
  );
}
