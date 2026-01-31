import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-metadata';
import SoukromiClient from './SoukromiClient';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/soukromi`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/soukromi',
        en: 'https://www.lovelygirls.cz/en/soukromi',
        de: 'https://www.lovelygirls.cz/de/soukromi',
        uk: 'https://www.lovelygirls.cz/uk/soukromi',
      },
    },
  };
}

export default async function SoukromiPage() {
  return (
    <>
      {/* SEO: Server-rendered legal content for crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>Ochrana osobních údajů</h1>
        <p>Zásady zpracování osobních údajů dle GDPR — LovelyGirls Prague</p>
        <h2>Správce osobních údajů</h2>
        <p>Provozovatel: LovelyGirls Prague, kontaktní email: info@lovelygirls.cz</p>
        <h2>Jaké osobní údaje zpracováváme</h2>
        <p>Kontaktní údaje, rezervační údaje, platební údaje, technické údaje.</p>
        <h2>Účel zpracování</h2>
        <p>Realizace rezervace, komunikace, platby, zlepšení služeb, zákonné povinnosti.</p>
        <h2>Vaše práva dle GDPR</h2>
        <p>Právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost, námitku, odvolání souhlasu.</p>
        <h2>Kontakt</h2>
        <p>Email: info@lovelygirls.cz</p>
      </div>

      <SoukromiClient />
    </>
  );
}
