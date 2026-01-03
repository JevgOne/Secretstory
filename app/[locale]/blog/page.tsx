import Link from "next/link";
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import BlogContent from './BlogContent';

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
      cache: 'no-store' // Always fetch fresh data
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
      cache: 'no-store'
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
    post.category === 'pribehy-z-bordelu' || post.category === 'erotic_story' || post.category === 'girl_spotlight' || post.category === 'prague_tips'
  );

  const guides = allPosts.filter((post: any) =>
    post.category === 'rady-a-tipy' || post.category === 'novinky' || post.category === 'guide' || post.category === 'etiquette'
  );

  return <BlogContent
    locale={locale}
    initialStories={stories}
    initialGuides={guides}
    featuredPost={featuredPost}
  />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    title: 'Blog',
    description: 'Erotic stories, guides, and tips for escort experiences in Prague.',
  };
}
