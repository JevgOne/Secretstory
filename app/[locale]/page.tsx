import { headers } from 'next/headers';
import HomeClient from '@/components/HomeClient';

// ISR - Revalidate every 60 seconds for SEO
export const revalidate = 60;

// Server-side data fetching for SEO
async function getHomepageData() {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
    const url = `${protocol}://${host.replace('https://', '').replace('http://', '')}/api/homepage`;

    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR cache
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch homepage data');
    }

    const data = await response.json();

    if (data.success) {
      return {
        girls: data.girls || [],
        featuredGirl: data.featuredGirl || null,
        newGirls: data.newGirls || [],
        locations: data.locations || [],
        stories: data.stories || [],
        activities: data.activities || [],
        reviews: data.reviews || [],
      };
    }

    return {
      girls: [],
      featuredGirl: null,
      newGirls: [],
      locations: [],
      stories: [],
      activities: [],
      reviews: [],
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      girls: [],
      featuredGirl: null,
      newGirls: [],
      locations: [],
      stories: [],
      activities: [],
      reviews: [],
    };
  }
}

export default async function HomePage() {
  // Fetch data on server for SEO
  const initialData = await getHomepageData();

  // Pass to client component
  return <HomeClient initialData={initialData} />;
}
