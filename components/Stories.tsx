"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface Story {
  id: number;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url?: string;
  duration: number;
  views_count: number;
  created_at: string;
}

interface GirlStories {
  girl_id: number;
  girl_name: string;
  girl_slug: string;
  girl_photo?: string;
  stories: Story[];
}

interface StoriesProps {
  initialStories?: GirlStories[];
}

export default function Stories({ initialStories = [] }: StoriesProps) {
  const [storiesData, setStoriesData] = useState<GirlStories[]>(initialStories);
  const locale = useLocale();
  const t = useTranslations('home');

  useEffect(() => {
    // Only fetch if no initial data provided
    if (initialStories.length === 0) {
      async function fetchStories() {
        try {
          const response = await fetch('/api/stories');
          const data = await response.json();
          if (data.success) {
            setStoriesData(data.stories);
          }
        } catch (error) {
          console.error('Error fetching stories:', error);
        }
      }
      fetchStories();
    }

    // Auto-refresh every 10 minutes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        if (data.success) {
          setStoriesData(data.stories);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [initialStories.length]);

  if (storiesData.length === 0) {
    return null;
  }

  return (
    <section style={{
      padding: '1.5rem 0 2.5rem',
      background: 'rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle ambient effect */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(139, 41, 66, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(80px)'
      }} />

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="stories-header" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '0 20px' }}>
          <h2 className="stories-title" style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            {t('stories_title')}
          </h2>
          <p className="stories-subtitle" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{t('stories_subtitle')}</p>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '16px 20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="stories-container">
          {storiesData.map((girlStories, index) => (
            <Link
              key={girlStories.girl_id}
              href={`/${locale}/profily/${girlStories.girl_slug}#stories`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="story-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '100px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Story Ring with Animation */}
                <div className="story-ring" style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(139, 41, 66, 0.4) 50%, rgba(255, 255, 255, 0.3) 100%)',
                  backgroundSize: '200% 200%',
                  position: 'relative',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  animation: 'gradientShift 3s ease infinite'
                }}>
                  {/* Inner circle */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#1a1a1a'
                  }}>
                    <img
                      src={girlStories.stories[0]?.thumbnail_url || girlStories.girl_photo}
                      alt={girlStories.girl_name}
                      style={{
                        width: '84px',
                        height: '84px',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '50%'
                      }}
                    />
                  </div>

                  {/* Story count badge */}
                  {girlStories.stories.length > 1 && (
                    <div className="story-badge" style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: 'rgba(139, 41, 66, 0.95)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: '2px solid #1f1f23',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}>
                      {girlStories.stories.length}
                    </div>
                  )}
                </div>

                {/* Name with glow effect */}
                <div className="story-name" style={{
                  marginTop: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                  maxWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                }}>
                  {girlStories.girl_name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .stories-container::-webkit-scrollbar {
          display: none;
        }

        .story-circle {
          width: 84px;
          height: 84px;
          background: #1a1a1a;
          border-radius: 50%;
        }

        .story-video {
          width: 84px;
          height: 84px;
          object-fit: cover;
          clip-path: circle(50%);
          -webkit-clip-path: circle(50%);
        }

        @media (max-width: 768px) {
          section {
            padding: 1.5rem 0 2rem !important;
          }

          .stories-header {
            margin-bottom: 1rem !important;
            padding: 0 16px !important;
          }

          .stories-title {
            font-size: 1.5rem !important;
          }

          .stories-subtitle {
            font-size: 0.85rem !important;
          }

          .stories-container {
            gap: 16px !important;
            padding: 12px 16px !important;
          }

          .story-item {
            min-width: 80px !important;
          }

          .story-ring {
            width: 75px !important;
            height: 75px !important;
          }

          .story-badge {
            width: 22px !important;
            height: 22px !important;
            font-size: 10px !important;
          }

          .story-name {
            margin-top: 10px !important;
            font-size: 13px !important;
            max-width: 80px !important;
          }
        }

        @media (max-width: 480px) {
          section {
            padding: 1.25rem 0 1.75rem !important;
          }

          .stories-header {
            margin-bottom: 0.875rem !important;
            padding: 0 12px !important;
          }

          .stories-title {
            font-size: 1.375rem !important;
          }

          .stories-subtitle {
            font-size: 0.8rem !important;
          }

          .stories-container {
            gap: 12px !important;
            padding: 10px 12px !important;
          }

          .story-item {
            min-width: 70px !important;
          }

          .story-ring {
            width: 65px !important;
            height: 65px !important;
            padding: 2px !important;
          }

          .story-badge {
            width: 20px !important;
            height: 20px !important;
            font-size: 9px !important;
            border: 1.5px solid #1f1f23 !important;
          }

          .story-name {
            margin-top: 8px !important;
            font-size: 12px !important;
            max-width: 70px !important;
          }
        }
      `}</style>
    </section>
  );
}
