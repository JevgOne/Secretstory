"use client";

import { VIBE_OPTIONS, TAG_OPTIONS, type VibeId, type TagId, type ReviewSummary } from '@/lib/review-constants';

interface VibeSummaryProps {
  summary: ReviewSummary;
  locale?: 'cs' | 'en' | 'de' | 'uk';
}

export default function VibeSummary({ summary, locale = 'cs' }: VibeSummaryProps) {
  if (!summary || summary.totalReviews === 0) {
    return null;
  }

  const { dominantVibe, vibeDistribution, topTags, totalReviews } = summary;

  // Get dominant vibe details
  const dominantVibeDetails = dominantVibe ? VIBE_OPTIONS[dominantVibe.vibe] : null;
  const dominantLabel = dominantVibeDetails
    ? dominantVibeDetails[`label_${locale}`] || dominantVibeDetails.label_cs
    : '';

  return (
    <div className="vibe-summary">
      <h3 className="summary-title">
        {locale === 'cs' && 'Celkový vibe'}
        {locale === 'en' && 'Overall Vibe'}
        {locale === 'de' && 'Gesamtstimmung'}
        {locale === 'uk' && 'Загальна атмосфера'}
      </h3>

      {/* DOMINANT VIBE */}
      {dominantVibe && dominantVibeDetails && (
        <div className="dominant-vibe">
          <div className="dominant-vibe-content">
            <span className="dominant-emoji">{dominantVibeDetails.emoji}</span>
            <div className="dominant-info">
              <div className="dominant-label">{dominantLabel}</div>
              <div className="dominant-percentage">{dominantVibe.percentage}% recenzí</div>
            </div>
          </div>
        </div>
      )}

      {/* VIBE DISTRIBUTION BAR */}
      <div className="distribution-section">
        <div className="distribution-label">
          {locale === 'cs' && 'Rozložení hodnocení'}
          {locale === 'en' && 'Rating Distribution'}
          {locale === 'de' && 'Bewertungsverteilung'}
          {locale === 'uk' && 'Розподіл оцінок'}
        </div>
        <div className="distribution-bar">
          {Object.entries(vibeDistribution).map(([key, count]) => {
            const vibeId = key as VibeId;
            const vibe = VIBE_OPTIONS[vibeId];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            if (percentage === 0) return null;

            return (
              <div
                key={vibeId}
                className="distribution-segment"
                style={{
                  width: `${percentage}%`,
                  background: vibe.color
                }}
                title={`${vibe.emoji} ${vibe[`label_${locale}`] || vibe.label_cs}: ${count} (${Math.round(percentage)}%)`}
              >
                {percentage > 8 && (
                  <span className="segment-emoji">{vibe.emoji}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* DISTRIBUTION LEGEND */}
        <div className="distribution-legend">
          {Object.entries(vibeDistribution)
            .filter(([, count]) => count > 0)
            .map(([key, count]) => {
              const vibeId = key as VibeId;
              const vibe = VIBE_OPTIONS[vibeId];
              const label = vibe[`label_${locale}`] || vibe.label_cs;

              return (
                <div key={vibeId} className="legend-item">
                  <span className="legend-emoji">{vibe.emoji}</span>
                  <span className="legend-label">{label}</span>
                  <span className="legend-count">{count}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* TOP TAGS */}
      {topTags.length > 0 && (
        <div className="top-tags-section">
          <div className="top-tags-label">
            {locale === 'cs' && 'Nejčastější tagy'}
            {locale === 'en' && 'Most Common Tags'}
            {locale === 'de' && 'Häufigste Tags'}
            {locale === 'uk' && 'Найпоширеніші теги'}
          </div>
          <div className="top-tags-list">
            {topTags.map(({ tag, count }) => {
              const tagDetails = TAG_OPTIONS[tag as TagId];
              if (!tagDetails) return null;

              const label = tagDetails[`label_${locale}`] || tagDetails.label_cs;

              return (
                <div key={tag} className="top-tag">
                  <span className="top-tag-emoji">{tagDetails.emoji}</span>
                  <span className="top-tag-label">{label}</span>
                  <span className="top-tag-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .vibe-summary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem 0;
        }

        .summary-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 1.5rem;
          font-family: 'Playfair Display', serif;
        }

        /* DOMINANT VIBE */
        .dominant-vibe {
          background: linear-gradient(135deg, rgba(139, 21, 56, 0.15), rgba(139, 21, 56, 0.05));
          border: 1px solid rgba(139, 21, 56, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .dominant-vibe-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .dominant-emoji {
          font-size: 3rem;
          line-height: 1;
        }

        .dominant-info {
          flex: 1;
        }

        .dominant-label {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 0.25rem;
        }

        .dominant-percentage {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
        }

        /* DISTRIBUTION BAR */
        .distribution-section {
          margin-bottom: 2rem;
        }

        .distribution-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .distribution-bar {
          display: flex;
          width: 100%;
          height: 48px;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 1rem;
        }

        .distribution-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          cursor: pointer;
          position: relative;
        }

        .distribution-segment:hover {
          filter: brightness(1.2);
        }

        .distribution-segment:first-child {
          border-radius: 24px 0 0 24px;
        }

        .distribution-segment:last-child {
          border-radius: 0 24px 24px 0;
        }

        .distribution-segment:only-child {
          border-radius: 24px;
        }

        .segment-emoji {
          font-size: 1.25rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        /* DISTRIBUTION LEGEND */
        .distribution-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .legend-emoji {
          font-size: 1.125rem;
        }

        .legend-label {
          color: rgba(255, 255, 255, 0.8);
        }

        .legend-count {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
        }

        /* TOP TAGS */
        .top-tags-section {
          margin-top: 2rem;
        }

        .top-tags-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .top-tags-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .top-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .top-tag:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .top-tag-emoji {
          font-size: 1.25rem;
        }

        .top-tag-label {
          flex: 1;
          font-size: 0.875rem;
          color: var(--white);
          font-weight: 500;
        }

        .top-tag-count {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .vibe-summary {
            padding: 1.5rem;
          }

          .summary-title {
            font-size: 1.25rem;
          }

          .dominant-vibe {
            padding: 1.25rem;
          }

          .dominant-emoji {
            font-size: 2.5rem;
          }

          .dominant-label {
            font-size: 1.25rem;
          }

          .dominant-percentage {
            font-size: 0.9rem;
          }

          .distribution-bar {
            height: 40px;
          }

          .distribution-legend {
            gap: 0.75rem;
          }

          .legend-item {
            font-size: 0.8rem;
          }

          .top-tags-list {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }

          .top-tag {
            padding: 0.625rem 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .vibe-summary {
            padding: 1rem;
            margin: 1.5rem 0;
          }

          .summary-title {
            font-size: 1.125rem;
            margin-bottom: 1rem;
          }

          .dominant-vibe {
            padding: 1rem;
          }

          .dominant-vibe-content {
            gap: 0.75rem;
          }

          .dominant-emoji {
            font-size: 2rem;
          }

          .dominant-label {
            font-size: 1.125rem;
          }

          .dominant-percentage {
            font-size: 0.85rem;
          }

          .distribution-bar {
            height: 36px;
            border-radius: 18px;
          }

          .distribution-segment:first-child {
            border-radius: 18px 0 0 18px;
          }

          .distribution-segment:last-child {
            border-radius: 0 18px 18px 0;
          }

          .distribution-segment:only-child {
            border-radius: 18px;
          }

          .segment-emoji {
            font-size: 1.125rem;
          }

          .distribution-legend {
            gap: 0.5rem;
          }

          .legend-item {
            font-size: 0.75rem;
            flex: 1 1 calc(50% - 0.25rem);
          }

          .legend-emoji {
            font-size: 1rem;
          }

          .distribution-label,
          .top-tags-label {
            font-size: 0.85rem;
          }

          .top-tags-list {
            grid-template-columns: 1fr;
          }

          .top-tag {
            padding: 0.5rem 0.75rem;
          }

          .top-tag-emoji {
            font-size: 1.125rem;
          }

          .top-tag-label {
            font-size: 0.8rem;
          }

          .top-tag-count {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
