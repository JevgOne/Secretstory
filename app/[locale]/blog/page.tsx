import Link from "next/link";
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BlogContent from './BlogContent';
import { CollectionPageSchema, BreadcrumbListSchema } from '@/components/JsonLd';

// Force dynamic rendering to avoid build timeout
export const dynamic = 'force-dynamic';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

async function getBlogPosts(locale: string, category?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = new URL(`${baseUrl}/api/blog`);
  url.searchParams.set('locale', locale);
  if (category && category !== 'all') {
    url.searchParams.set('category', category);
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 } // ISR: Revalidate every 5 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch blog posts:', res.statusText);
      return [];
    }

    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function getFeaturedPost(locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = new URL(`${baseUrl}/api/blog`);
  url.searchParams.set('locale', locale);
  url.searchParams.set('featured', 'true');
  url.searchParams.set('limit', '1');

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 } // ISR: Revalidate every 5 minutes
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.posts?.[0] || null;
  } catch (error) {
    console.error('Error fetching featured post:', error);
    return null;
  }
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all posts and featured post in parallel
  const [allPosts, featuredPost] = await Promise.all([
    getBlogPosts(locale),
    getFeaturedPost(locale)
  ]);

  // Separate posts by category
  const stories = allPosts.filter((post: any) =>
    post.category === 'pribehy-spolecnic' || post.category === 'pribehy-z-bordelu' || post.category === 'erotic_story' || post.category === 'girl_spotlight'
  );

  const guides = allPosts.filter((post: any) =>
    post.category === 'rady-a-tipy' || post.category === 'novinky' || post.category === 'guide' || post.category === 'etiquette' || post.category === 'ostatni'
  );

  return (
    <>
      <CollectionPageSchema
        name="Blog - LovelyGirls Prague"
        description="Erotic stories, guides, and tips for escort experiences in Prague."
        url={`https://www.lovelygirls.cz/${locale}/blog`}
        numberOfItems={allPosts.length}
      />
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `https://www.lovelygirls.cz/${locale}` },
        { name: 'Blog', url: `https://www.lovelygirls.cz/${locale}/blog` }
      ]} />
      <BlogContent
        locale={locale}
        initialStories={stories}
        initialGuides={guides}
        featuredPost={featuredPost}
      />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const canonicalUrl = `https://www.lovelygirls.cz/${locale}/blog`;

  return {
    title: 'Blog | LovelyGirls Prague',
    description: 'Erotic stories, guides, and tips for escort experiences in Prague.',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'cs': 'https://www.lovelygirls.cz/cs/blog',
        'en': 'https://www.lovelygirls.cz/en/blog',
        'de': 'https://www.lovelygirls.cz/de/blog',
        'uk': 'https://www.lovelygirls.cz/uk/blog',
      }
    },
    openGraph: {
      title: 'Blog | LovelyGirls Prague',
      description: 'Erotic stories, guides, and tips for escort experiences in Prague.',
      url: canonicalUrl,
      siteName: 'LovelyGirls Prague',
      type: 'website',
      images: [{ url: 'https://www.lovelygirls.cz/og-image.jpg', width: 1200, height: 630, alt: 'LovelyGirls Blog' }]
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: 'Blog | LovelyGirls Prague',
      description: 'Erotic stories, guides, and tips for escort experiences in Prague.',
      images: ['https://www.lovelygirls.cz/og-image.jpg']
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
