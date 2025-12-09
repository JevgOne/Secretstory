"use client";

interface ReviewStarsProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function ReviewStars({
  rating,
  size = 'medium',
  showNumber = false,
  interactive = false,
  onChange
}: ReviewStarsProps) {
  const sizes = {
    small: 14,
    medium: 18,
    large: 24
  };

  const iconSize = sizes[size];

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="review-stars">
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => handleClick(star)}
            disabled={!interactive}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill={star <= rating ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {showNumber && (
        <span className="rating-number">{rating.toFixed(1)}</span>
      )}

      <style jsx>{`
        .review-stars {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars-container {
          display: flex;
          gap: 4px;
        }

        .star {
          background: none;
          border: none;
          padding: 0;
          cursor: default;
          color: #4a4a4a;
          transition: all 0.2s;
        }

        .star.filled {
          color: var(--accent);
        }

        .star.interactive {
          cursor: pointer;
        }

        .star.interactive:hover {
          transform: scale(1.1);
        }

        .rating-number {
          font-size: 0.9rem;
          color: var(--gray);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
