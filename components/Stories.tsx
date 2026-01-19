"use client";

import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { createPortal } from 'react-dom';

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

// Video Modal - Telegram style circle popup
function VideoModal({
  story,
  girlName,
  onClose
}: {
  story: Story;
  girlName: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play video when modal opens
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleEnded = () => {
    // Auto close after video ends
    setTimeout(onClose, 300);
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        animation: 'fadeIn 0.2s ease'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: '#fff',
          fontSize: 24,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000
        }}
      >
        ×
      </button>

      {/* Girl name */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff',
        fontSize: 18,
        fontWeight: 600,
        textShadow: '0 2px 8px rgba(0,0,0,0.5)'
      }}>
        {girlName}
      </div>

      {/* Video circle container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(80vw, 80vh, 400px)',
          height: 'min(80vw, 80vh, 400px)',
          animation: 'scaleIn 0.3s ease'
        }}
      >
        {/* Progress ring */}
        <svg
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            width: 'calc(100% + 8px)',
            height: 'calc(100% + 8px)',
            transform: 'rotate(-90deg)'
          }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="calc(50% - 2px)"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
          />
          <circle
            cx="50%"
            cy="50%"
            r="calc(50% - 2px)"
            fill="none"
            stroke="#8b2942"
            strokeWidth="4"
            strokeDasharray={`${progress * 3.14159} 314.159`}
            strokeLinecap="round"
          />
        </svg>

        {/* Video */}
        <video
          ref={videoRef}
          src={story.media_url}
          playsInline
          muted
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={(e) => console.error('Video error:', e)}
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current?.paused) {
              videoRef.current.play();
            } else {
              videoRef.current?.pause();
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            cursor: 'pointer',
            backgroundColor: '#1a1a1a'
          }}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}

export default function Stories({ initialStories = [] }: StoriesProps) {
  const [storiesData, setStoriesData] = useState<GirlStories[]>(initialStories);
  const [activeStory, setActiveStory] = useState<{ story: Story; girlName: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations('home');

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleStoryClick = (e: React.MouseEvent, girlStories: GirlStories) => {
    e.preventDefault();
    if (girlStories.stories[0]) {
      setActiveStory({
        story: girlStories.stories[0],
        girlName: girlStories.girl_name
      });
    }
  };

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
            <div
              key={girlStories.girl_id}
              onClick={(e) => handleStoryClick(e, girlStories)}
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
              {/* Story Ring - Instagram style gradient */}
              <div className="story-ring" style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Inner circle with photo */}
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#1a1a1a',
                  border: '3px solid #1f1f23',
                  backgroundImage: `url(${girlStories.girl_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(girlStories.girl_name)}&background=8b2942&color=fff&size=168`})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />

                {/* Play indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#8b2942',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #1f1f23',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                }}>
                  <span style={{
                    marginLeft: 2,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid white',
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent'
                  }} />
                </div>

                {/* Story count badge */}
                {girlStories.stories.length > 1 && (
                  <div className="story-badge" style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#fff',
                    color: '#8b2942',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                  }}>
                    {girlStories.stories.length}
                  </div>
                )}
              </div>

              {/* Name */}
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
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {mounted && activeStory && (
        <VideoModal
          story={activeStory.story}
          girlName={activeStory.girlName}
          onClose={() => setActiveStory(null)}
        />
      )}

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

        .stories-container::-webkit-scrollbar {
          display: none;
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
            width: 20px !important;
            height: 20px !important;
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
            width: 18px !important;
            height: 18px !important;
            font-size: 9px !important;
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
