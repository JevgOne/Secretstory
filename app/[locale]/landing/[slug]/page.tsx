import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getLandingPage, LANDING_PAGES } from '@/lib/landing-pages-data';
import { BreadcrumbListSchema } from '@/components/JsonLd';
import styles from './landing.module.css';

// ISR - Revalidate every 30 minutes
export const revalidate = 1800;

// Generate static params for all landing pages
export function generateStaticParams() {
  return LANDING_PAGES.map(page => ({
    slug: page.slug,
    locale: page.locale,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getLandingPage(slug);

  if (!page) {
    return { title: 'Not Found' };
  }

  const canonicalUrl = `https://www.lovelygirls.cz/${page.locale}/landing/${page.slug}`;

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'cs': `https://www.lovelygirls.cz/cs/landing/${page.slug}`,
        'en': `https://www.lovelygirls.cz/en/landing/${page.slug}`,
        'de': `https://www.lovelygirls.cz/de/landing/${page.slug}`,
        'uk': `https://www.lovelygirls.cz/uk/landing/${page.slug}`,
      },
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: canonicalUrl,
      siteName: 'LovelyGirls Prague',
      type: 'website',
      images: [
        {
          url: 'https://www.lovelygirls.cz/og-image.jpg',
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Fetch girls from DB for SSR
async function getGirlsForLanding(filter: { field: string; value: string } | null) {
  try {
    let sql = `
      SELECT g.id, g.name, g.slug, g.age, g.height, g.weight, g.bust,
             g.online, g.status, g.color, g.location, g.is_new, g.badge_type, g.rating
      FROM girls g
      WHERE g.status = 'active'
    `;
    const args: any[] = [];

    if (filter) {
      sql += ` AND g.${filter.field} = ?`;
      args.push(filter.value);
    }

    sql += ` ORDER BY g.online DESC, g.rating DESC LIMIT 8`;

    const result = await db.execute({ sql, args });
    const girls = result.rows as any[];

    // Fetch photos
    if (girls.length > 0) {
      const girlIds = girls.map((g: any) => g.id);
      const placeholders = girlIds.map(() => '?').join(',');
      const photosResult = await db.execute({
        sql: `SELECT girl_id, url, thumbnail_url FROM girl_photos WHERE girl_id IN (${placeholders}) AND is_primary = 1`,
        args: girlIds,
      });

      const photoMap = new Map<number, { url: string; thumbnail_url: string }>();
      photosResult.rows.forEach((row: any) => {
        photoMap.set(row.girl_id, { url: row.url, thumbnail_url: row.thumbnail_url });
      });

      return girls.map((girl: any) => {
        const photo = photoMap.get(girl.id);
        return {
          ...girl,
          online: Boolean(girl.online),
          is_new: Boolean(girl.is_new),
          primary_photo: photo?.url || null,
          thumbnail: photo?.thumbnail_url || null,
        };
      });
    }

    return girls;
  } catch (error) {
    console.error('Error fetching girls for landing page:', error);
    return [];
  }
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = getLandingPage(slug);

  if (!page) {
    notFound();
  }

  // Verify locale matches the landing page's locale
  if (page.locale !== locale) {
    notFound();
  }

  const girls = await getGirlsForLanding(page.girlsFilter);

  // CTA labels by locale
  const ctaLabels: Record<string, { whatsapp: string; telegram: string; call: string }> = {
    cs: { whatsapp: 'Napsat na WhatsApp', telegram: 'Napsat na Telegram', call: 'Zavolat' },
    en: { whatsapp: 'Message on WhatsApp', telegram: 'Message on Telegram', call: 'Call Us' },
    de: { whatsapp: 'WhatsApp schreiben', telegram: 'Telegram schreiben', call: 'Anrufen' },
    uk: { whatsapp: 'Написати в WhatsApp', telegram: 'Написати в Telegram', call: 'Зателефонувати' },
  };

  const cta = ctaLabels[locale] || ctaLabels.cs;

  // Schema.org FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // Organization schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LovelyGirls Prague',
    url: 'https://www.lovelygirls.cz',
    logo: 'https://www.lovelygirls.cz/og-image.jpg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420734332131',
      contactType: 'customer service',
      availableLanguage: ['Czech', 'English', 'German', 'Ukrainian'],
    },
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: page.h1, url: `https://www.lovelygirls.cz/${locale}/landing/${slug}` }
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: page.h1, url: `https://www.lovelygirls.cz/${locale}/landing/${slug}` }
      ]} />

      <main className={styles.landingPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.h1}>{page.h1}</h1>
            <p className={styles.lead}>{page.leadText}</p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.h2}>
              {locale === 'cs' ? 'Proč si vybrat LovelyGirls?' :
               locale === 'en' ? 'Why Choose LovelyGirls?' :
               locale === 'de' ? 'Warum LovelyGirls wählen?' :
               'Чому обрати LovelyGirls?'}
            </h2>
            <ul className={styles.benefits}>
              {page.whyChooseUs.map((item, i) => (
                <li key={i} className={styles.benefit}>
                  <span className={styles.benefitIcon}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Girls Grid - SSR */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.h2}>{page.girlsHeading}</h2>
            <div className={styles.girlsGrid}>
              {girls.map((girl: any) => (
                <Link
                  key={girl.id}
                  href={`/${locale}/profily/${girl.slug}`}
                  className={styles.girlCard}
                >
                  <div className={styles.girlImage}>
                    {girl.thumbnail || girl.primary_photo ? (
                      <img
                        src={girl.thumbnail || girl.primary_photo}
                        alt={`${girl.name} - escort Praha`}
                        loading="lazy"
                        width={300}
                        height={400}
                      />
                    ) : (
                      <div className={styles.girlPlaceholder}>FOTO</div>
                    )}
                    {girl.is_new && (
                      <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>
                    )}
                    {girl.online && (
                      <span className={styles.onlineDot} />
                    )}
                  </div>
                  <div className={styles.girlInfo}>
                    <span className={styles.girlName}>{girl.name}</span>
                    <div className={styles.girlStats}>
                      <span>{girl.age} {locale === 'cs' ? 'let' : locale === 'de' ? 'Jahre' : 'y.o.'}</span>
                      <span>·</span>
                      <span>{girl.height} cm</span>
                      <span>·</span>
                      <span>{girl.weight} kg</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className={styles.girlsCta}>
              <Link href={`/${locale}/divky`} className={styles.btnOutline}>
                {locale === 'cs' ? 'Zobrazit všechny dívky →' :
                 locale === 'en' ? 'View All Girls →' :
                 locale === 'de' ? 'Alle Damen anzeigen →' :
                 'Переглянути всіх дівчат →'}
              </Link>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        {page.contentSections.map((section, i) => (
          <section key={i} className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.h2}>{section.heading}</h2>
              <div
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: section.text.replace(/\n/g, '<br/>') }}
              />
            </div>
          </section>
        ))}

        {/* How It Works */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.h2}>
              {locale === 'cs' ? 'Jak to funguje?' :
               locale === 'en' ? 'How It Works' :
               locale === 'de' ? 'So funktioniert es' :
               'Як це працює?'}
            </h2>
            <div className={styles.stepsGrid}>
              {page.howItWorks.map((step, i) => (
                <div key={i} className={styles.step}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <h3 className={styles.stepTitle}>{step.step}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`${styles.section} ${styles.cta}`}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>
              {locale === 'cs' ? 'Připraveni na nezapomenutelný zážitek?' :
               locale === 'en' ? 'Ready for an Unforgettable Experience?' :
               locale === 'de' ? 'Bereit für ein unvergessliches Erlebnis?' :
               'Готові до незабутнього досвіду?'}
            </h2>
            <p className={styles.ctaSubtitle}>
              {locale === 'cs' ? 'Kontaktujte nás a zarezervujte si setkání ještě dnes.' :
               locale === 'en' ? 'Contact us and book your meeting today.' :
               locale === 'de' ? 'Kontaktieren Sie uns und buchen Sie noch heute.' :
               "Зв'яжіться з нами та забронюйте зустріч сьогодні."}
            </p>
            <div className={styles.ctaButtons}>
              <a
                href="https://wa.me/420734332131"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnWhatsapp}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                {cta.whatsapp}
              </a>
              <a
                href="https://t.me/+420734332131"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnTelegram}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                {cta.telegram}
              </a>
              <a
                href="tel:+420734332131"
                className={`${styles.btn} ${styles.btnCall}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {cta.call}
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={`${styles.section} ${styles.faqSection}`}>
          <div className={styles.container}>
            <h2 className={styles.h2}>
              {locale === 'cs' ? 'Často kladené otázky' :
               locale === 'en' ? 'Frequently Asked Questions' :
               locale === 'de' ? 'Häufig gestellte Fragen' :
               'Часті запитання'}
            </h2>
            <div className={styles.faqList}>
              {page.faq.map((item, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{item.question}</summary>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className={styles.section}>
          <div className={styles.container}>
            <nav className={styles.internalLinks}>
              {page.internalLinks.map((link, i) => (
                <Link key={i} href={link.href} className={styles.internalLink}>
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
