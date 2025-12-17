import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { getHashtagById, getHashtagName } from '@/lib/hashtags';
import GirlCard from '@/components/GirlCard';

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const hashtag = getHashtagById(id);

  if (!hashtag) {
    return {
      title: 'Hashtag nenalezen'
    };
  }

  const hashtagName = getHashtagName(id, locale);

  return {
    title: `#${hashtagName} - Lovely Girls Prague`,
    description: `Prohlédněte si dívky označené jako #${hashtagName}`,
  };
}

export default async function HashtagPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations('profile');

  const hashtag = getHashtagById(id);

  if (!hashtag) {
    notFound();
  }

  const hashtagName = getHashtagName(id, locale);

  // Fetch girls with this hashtag
  const result = await db.execute({
    sql: `
      SELECT
        id, name, slug, age, height, weight, bust, online, languages
      FROM girls
      WHERE status = 'active'
      AND hashtags IS NOT NULL
      AND hashtags LIKE ?
      ORDER BY created_at DESC
    `,
    args: [`%"${id}"%`]
  });

  const girls = result.rows.map((girl: any) => ({
    ...girl,
    online: Boolean(girl.online)
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">#{hashtagName}</h1>
        <p className="page-subtitle">
          {girls.length === 0 && 'Žádné dívky s tímto hashtagem'}
          {girls.length === 1 && '1 dívka'}
          {girls.length > 1 && girls.length < 5 && `${girls.length} dívky`}
          {girls.length >= 5 && `${girls.length} dívek`}
        </p>
      </div>

      {girls.length > 0 && (
        <div className="girls-grid">
          {girls.map((girl: any) => (
            <GirlCard
              key={girl.id}
              girl={girl}
              translations={{
                age_years: t('age_years'),
                bust: t('bust'),
                height_cm: t('height_cm'),
                weight_kg: t('weight_kg'),
                languages_spoken: t('languages_spoken'),
                photo: t('photo'),
                whatsapp: t('whatsapp'),
                call: t('call')
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--wine-light);
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: var(--gray);
        }

        .girls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .girls-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
