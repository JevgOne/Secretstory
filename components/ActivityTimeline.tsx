"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { translateReviewText } from '@/lib/review-translation';

interface Activity {
  id: number;
  girl_id: number;
  girl_name: string;
  girl_slug: string;
  activity_type: 'photo_added' | 'video_added' | 'story_added' | 'service_changed';
  title: string;
  description: string;
  media_url?: string;
  created_at: string;
}

const activityIcons = {
  photo_added: '📷',
  video_added: '🎥',
  story_added: '✨',
  service_changed: '🔄'
};

const activityColors = {
  photo_added: '#d4af37',
  video_added: '#c41e3a',
  story_added: '#f4d03f',
  service_changed: '#10b981'
};

interface ActivityTimelineProps {
  initialActivities?: Activity[];
}

export default function ActivityTimeline({ initialActivities = [] }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [showAll, setShowAll] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const locale = useLocale();
  const t = useTranslations('home');

  useEffect(() => {
    // Only fetch if no initial data provided
    if (initialActivities.length === 0) {
      async function fetchActivities() {
        try {
          const response = await fetch('/api/activity-log?limit=50');
          const data = await response.json();
          if (data.success) {
            setActivities(data.activities);
          }
        } catch (error) {
          console.error('Error fetching activities:', error);
        }
      }
      fetchActivities();
    }

    // Auto-refresh every 5 minutes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/activity-log?limit=50');
        const data = await response.json();
        if (data.success) {
          setActivities(data.activities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [initialActivities.length]);

  // Auto-translate activity descriptions when locale changes or activities are loaded
  useEffect(() => {
    console.log('[ActivityTimeline] useEffect triggered', {
      locale,
      activitiesCount: activities.length,
      isTranslating,
      firstDescription: activities[0]?.description
    });

    if (locale === 'cs') {
      console.log('[ActivityTimeline] Skipping translation: locale is CS');
      return;
    }

    if (activities.length === 0) {
      console.log('[ActivityTimeline] Skipping translation: no activities');
      return;
    }

    if (isTranslating) {
      console.log('[ActivityTimeline] Skipping translation: already translating');
      return;
    }

    // Check if activities are already translated (avoid re-translating)
    const firstActivity = activities[0];
    const isCzech = firstActivity.description.includes('Přidala') ||
                    firstActivity.description.includes('Sdílela') ||
                    firstActivity.description.includes('Upravila');

    if (!isCzech) {
      console.log('[ActivityTimeline] Skipping translation: already translated', firstActivity.description);
      return;
    }

    console.log('[ActivityTimeline] Starting translation to', locale);

    async function translateActivities() {
      setIsTranslating(true);
      try {
        console.log('[ActivityTimeline] Translating', activities.length, 'activities');
        const translated = await Promise.all(
          activities.map(async (activity) => {
            const translatedDescription = await translateReviewText(
              activity.description,
              locale,
              'cs'
            );
            console.log('[ActivityTimeline] Translated:', activity.description, '→', translatedDescription);
            return {
              ...activity,
              description: translatedDescription
            };
          })
        );
        setActivities(translated);
        console.log('[ActivityTimeline] Translation complete');
      } catch (error) {
        console.error('[ActivityTimeline] Translation error:', error);
      } finally {
        setIsTranslating(false);
      }
    }

    translateActivities();
  }, [locale, activities]);

  if (activities.length === 0) {
    return null;
  }

  // Show only first 8 activities by default
  const displayedActivities = showAll ? activities : activities.slice(0, 8);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return t(diffDays === 1 ? 'activity_time_days_1' : 'activity_time_days_other', { count: diffDays });
    }
    if (diffHours > 0) {
      return t(diffHours === 1 ? 'activity_time_hours_1' : 'activity_time_hours_other', { count: diffHours });
    }
    if (diffMins > 0) {
      return t(diffMins === 1 ? 'activity_time_mins_1' : 'activity_time_mins_other', { count: diffMins });
    }
    return t('activity_time_now');
  };

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(139, 41, 66, 0.03)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">{t('activity_title')}</h2>
          <p className="section-subtitle">{t('activity_subtitle')}</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: activities.length > 8 ? '2rem' : '0'
        }}>
          {displayedActivities.map((activity) => (
            <Link
              key={activity.id}
              href={`/${locale}/profily/${activity.girl_slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = activityColors[activity.activity_type];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `${activityColors[activity.activity_type]}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {activityIcons[activity.activity_type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '15px',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {activity.girl_name}
                    </div>
                    <div style={{
                      color: '#9ca3af',
                      fontSize: '14px',
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {activity.description}
                    </div>
                    <div style={{
                      color: activityColors[activity.activity_type],
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getTimeAgo(activity.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        {activities.length > 8 && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '12px 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = '#d4af37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              {showAll ? `${t('activity_show_less')} ↑` : `${t('activity_show_more', { count: activities.length })} ↓`}
            </button>
          </div>
        )}
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
