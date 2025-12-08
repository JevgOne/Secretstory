export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-name"></div>
          <div className="skeleton-time"></div>
        </div>
        <div className="skeleton-stats">
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
        </div>
        <div className="skeleton-location"></div>
      </div>

      <style jsx>{`
        .skeleton-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .skeleton-image {
          aspect-ratio: 3 / 4;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-content {
          padding: 1rem;
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .skeleton-name {
          width: 40%;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 200% 100%;
        }

        .skeleton-time {
          width: 25%;
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 200% 100%;
        }

        .skeleton-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .skeleton-stat {
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 200% 100%;
        }

        .skeleton-location {
          width: 50%;
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 200% 100%;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Add slight delay to each skeleton for staggered effect */
        .skeleton-stat:nth-child(2) {
          animation-delay: 0.1s;
        }
        .skeleton-stat:nth-child(3) {
          animation-delay: 0.2s;
        }
        .skeleton-stat:nth-child(4) {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
