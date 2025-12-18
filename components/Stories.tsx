"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

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
  stories: Story[];
}

export default function Stories() {
  const [storiesData, setStoriesData] = useState<GirlStories[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        if (data.success) {
          setStoriesData(data.stories);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchStories, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '4rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>Načítání stories...</div>
        </div>
      </section>
    );
  }

  if (storiesData.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Stories</h2>
          <p className="section-subtitle">Nové příběhy našich modelek</p>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          padding: '8px 0',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d4af37 rgba(255, 255, 255, 0.1)'
        }}>
          {storiesData.map((girlStories) => (
            <Link
              key={girlStories.girl_id}
              href={`/${locale}/profily/${girlStories.girl_slug}#stories`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '80px',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(45deg, #d4af37, #f4d03f)',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#1f1f23',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={girlStories.stories[0]?.thumbnail_url || girlStories.stories[0]?.media_url}
                      alt={girlStories.girl_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  {girlStories.stories.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: '#d4af37',
                      color: '#1f1f23',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: '2px solid #1f1f23'
                    }}>
                      {girlStories.stories.length}
                    </div>
                  )}
                </div>
                <div style={{
                  marginTop: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  textAlign: 'center',
                  maxWidth: '80px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {girlStories.girl_name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 2rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
