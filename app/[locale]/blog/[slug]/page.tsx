import Link from "next/link";
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import BlogArticleContent from './BlogArticleContent';
import { ArticleSchema, BreadcrumbListSchema } from '@/components/JsonLd';

// ISR: Revalidate every 6 hours (21600 seconds)
export const revalidate = 21600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getBlogPost(slug: string, locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = new URL(`${baseUrl}/api/blog/${slug}`);
  url.searchParams.set('locale', locale);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 21600 } // ISR: Revalidate every 6 hours
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch blog post');
    }

    const data = await res.json();
    return data.post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(locale: string, currentSlug: string, limit = 3) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = new URL(`${baseUrl}/api/blog`);
  url.searchParams.set('locale', locale);
  url.searchParams.set('limit', String(limit + 1)); // Get one extra to exclude current

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 21600 } // ISR: Revalidate every 6 hours
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    // Filter out current post and limit results
    return (data.posts || [])
      .filter((post: any) => post.slug !== currentSlug)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, relatedPosts] = await Promise.all([
    getBlogPost(slug, locale),
    getRelatedPosts(locale, slug)
  ]);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lovelygirls.cz';

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.meta_description || post.excerpt || ''}
        author={post.author || 'LovelyGirls'}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        image={post.og_image}
        url={`${baseUrl}/${locale}/blog/${slug}`}
      />
      <BreadcrumbListSchema items={[
        { name: 'Home', url: `${baseUrl}/${locale}` },
        { name: 'Blog', url: `${baseUrl}/${locale}/blog` },
        { name: post.title, url: `${baseUrl}/${locale}/blog/${slug}` }
      ]} />
      <BlogArticleContent
        locale={locale}
        post={post}
        relatedPosts={relatedPosts}
      />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = 'https://www.lovelygirls.cz';

  return {
    title: post.meta_title || `${post.title} | LovelyGirls Blog`,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      siteName: 'LovelyGirls Prague',
      images: post.og_image ? [
        {
          url: post.og_image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      url: `${baseUrl}/${locale}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.og_image ? [post.og_image] : [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        'cs': `${baseUrl}/cs/blog/${slug}`,
        'en': `${baseUrl}/en/blog/${slug}`,
        'de': `${baseUrl}/de/blog/${slug}`,
        'uk': `${baseUrl}/uk/blog/${slug}`
      }
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
