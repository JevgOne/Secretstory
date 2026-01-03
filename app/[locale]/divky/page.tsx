import DivkyClient from './DivkyClient';

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  height: number;
  weight: number;
  bust: string;
  online: boolean;
  status: string;
  color: string;
  languages?: string;
  is_new?: boolean;
  is_top?: boolean;
  is_featured?: boolean;
  badge_type?: string;
  created_at?: string;
  featured_section?: string;
  primary_photo?: string | null;
  thumbnail?: string | null;
  secondary_photo?: string | null;
  schedule_status?: 'working' | 'later' | null;
  schedule_from?: string | null;
  schedule_to?: string | null;
}

// Server-side data fetching for SEO
async function getGirlsData() {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
    const url = `${protocol}://${host.replace('https://', '').replace('http://', '')}/api/girls?status=active`;

    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR cache
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch girls data');
    }

    const data = await response.json();

    if (data.success) {
      return data.girls || [];
    }

    return [];
  } catch (error) {
    console.error('Error fetching girls data:', error);
    return [];
  }
}

export default async function DivkyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch ALL active girls from API
  const allGirls = await getGirlsData();

  // Filter: Show ONLY girls working today (have schedule today)
  // schedule_status = 'working' (currently working) or 'later' (working later today)
  const girlsWorkingToday = allGirls.filter((girl: Girl) =>
    girl.schedule_status === 'working' || girl.schedule_status === 'later'
  );

  console.log('[DIVKY SERVER] All girls:', allGirls.length, 'Working today:', girlsWorkingToday.length);

  // Pass filtered girls to client component
  return <DivkyClient initialGirls={girlsWorkingToday} locale={locale} />;
}
