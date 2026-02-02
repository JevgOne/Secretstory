import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-metadata';
import PodminkyClient from './PodminkyClient';
import { BreadcrumbListSchema } from '@/components/JsonLd';

// ISR - Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/podminky`;

  const metadata = await generatePageMetadata(pagePath);

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        cs: 'https://www.lovelygirls.cz/cs/podminky',
        en: 'https://www.lovelygirls.cz/en/podminky',
        de: 'https://www.lovelygirls.cz/de/podminky',
        uk: 'https://www.lovelygirls.cz/uk/podminky',
      },
    },
  };
}

export default async function PodminkyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: 'Obchodní podmínky', url: `https://www.lovelygirls.cz/${locale}/podminky` }
      ]} />

      {/* SEO: Server-rendered legal content for crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>Obchodní podmínky</h1>
        <p>Podmínky používání služeb LovelyGirls Prague</p>
        <h2>Úvodní ustanovení</h2>
        <p>Tyto obchodní podmínky upravují vztah mezi provozovatelem služeb LovelyGirls Prague a klientem.</p>
        <h2>Věkové omezení</h2>
        <p>Naše služby jsou určeny výhradně pro osoby starší 18 let.</p>
        <h2>Rezervace a objednávky</h2>
        <p>Rezervace lze provést telefonicky, přes WhatsApp nebo Telegram.</p>
        <h2>Platební podmínky</h2>
        <p>Platba je splatná vždy na začátku návštěvy. Přijímáme hotovost a platební karty.</p>
        <h2>Storno podmínky</h2>
        <p>Rezervaci lze zrušit bez poplatku nejpozději 2 hodiny před termínem.</p>
        <h2>Diskrétnost</h2>
        <p>Zachováváme naprostou diskrétnost ohledně identity klientů.</p>
        <h2>Kontakt</h2>
        <p>Email: info@lovelygirls.cz</p>
      </div>

      <PodminkyClient />
    </>
  );
}
