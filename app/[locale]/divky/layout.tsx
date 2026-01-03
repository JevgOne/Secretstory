import { Metadata } from 'next';
import { generatePageMetadata, getDefaultSEO } from '@/lib/seo-metadata';

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const pagePath = `/${locale}/divky`;

  // Fallback SEO values if database has no data
  const defaults = {
    cs: {
      title: 'Naše Dívky - Ověřené Profily | LovelyGirls Prague',
      description: 'Prohlédněte si profily našich ověřených společnic v Praze. Profesionální escort služby, erotická masáž, VIP doprovod. Skutečné fotky, diskrétnost garantována.',
      keywords: 'escort praha, erotická masáž praha, VIP escort prague, verified escorts, luxury companions prague, tantra massage'
    },
    en: {
      title: 'Our Girls - Verified Profiles | LovelyGirls Prague',
      description: 'Browse verified companion profiles in Prague. Professional escort services, erotic massage, VIP companionship. Real photos, discretion guaranteed.',
      keywords: 'escort prague, verified escorts, luxury companions, erotic massage prague'
    },
    de: {
      title: 'Unsere Mädchen - Verifizierte Profile | LovelyGirls Prag',
      description: 'Durchsuchen Sie verifizierte Begleiterprofile in Prag. Professionelle Escort-Services, erotische Massage, VIP-Begleitung.',
      keywords: 'escort prag, verifizierte escorts, luxus-begleitung'
    },
    uk: {
      title: 'Наші Дівчата - Перевірені Профілі | LovelyGirls Прага',
      description: 'Перегляньте профілі наших перевірених супутниць у Празі. Професійні ескорт-послуги, еротичний масаж.',
      keywords: 'ескорт прага, перевірені ескорт'
    }
  };

  const fallback = defaults[locale as keyof typeof defaults] || defaults.cs;

  // Load SEO from database, fallback to defaults
  const metadata = await generatePageMetadata(pagePath, fallback);

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
