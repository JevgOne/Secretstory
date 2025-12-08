"use client";

import { useState, useRef, useEffect } from "react";

interface SwipeableGalleryProps {
  images: string[];
  alt: string;
}

export default function SwipeableGallery({ images, alt }: SwipeableGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  if (images.length === 0) {
    return (
      <div className="swipeable-gallery">
        <div className="gallery-placeholder">No images available</div>
        <style jsx>{`
          .swipeable-gallery {
            position: relative;
            width: 100%;
            aspect-ratio: 3 / 4;
            background: linear-gradient(135deg, #2a1f23 0%, #1a1216 100%);
            border-radius: 12px;
            overflow: hidden;
          }
          .gallery-placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.3);
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="swipeable-gallery"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="gallery-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="gallery-slide">
            <div className="gallery-image-placeholder">
              FOTO {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Desktop */}
      {images.length > 1 && (
        <>
          <button
            className="gallery-arrow prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            className="gallery-arrow next"
            onClick={goToNext}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="gallery-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="gallery-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      <style jsx>{`
        .swipeable-gallery {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          background: linear-gradient(135deg, #2a1f23 0%, #1a1216 100%);
          border-radius: 12px;
          overflow: hidden;
          touch-action: pan-y pinch-zoom;
        }

        .gallery-track {
          display: flex;
          height: 100%;
          transition: transform 0.3s ease;
        }

        .gallery-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .gallery-image-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.1);
          font-weight: 500;
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s;
          z-index: 2;
        }

        .gallery-arrow:hover {
          background: rgba(0, 0, 0, 0.7);
          transform: translateY(-50%) scale(1.1);
        }

        .gallery-arrow.prev {
          left: 12px;
        }

        .gallery-arrow.next {
          right: 12px;
        }

        .gallery-arrow svg {
          width: 24px;
          height: 24px;
        }

        .gallery-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .gallery-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }

        .gallery-dot:active {
          transform: scale(1.2);
        }

        .gallery-dot.active {
          background: white;
          width: 24px;
          border-radius: 4px;
        }

        .gallery-counter {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          z-index: 2;
        }

        /* Show arrows on desktop */
        @media (min-width: 769px) {
          .gallery-arrow {
            display: flex;
          }
        }

        /* Mobile optimization */
        @media (max-width: 768px) {
          .gallery-dots {
            bottom: 12px;
            gap: 6px;
          }

          .gallery-dot {
            width: 6px;
            height: 6px;
          }

          .gallery-dot.active {
            width: 20px;
          }
        }
      `}</style>
    </div>
  );
}
