'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';

interface HeroBannerProps {
  items: Array<{
    id: number;
    title?: string;
    name?: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
  }>;
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [items.length]);

  if (!items || items.length === 0) {
    return <div className="h-[80vh] bg-[#0a0a0a]" />;
  }

  const item = items[currentIndex];
  const title = item.title || item.name || 'Unknown';
  const year = (item.release_date || item.first_air_date || '').split('-')[0];
  const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      {item.backdrop_path && (
        <img
          src={getImageUrl(item.backdrop_path, 'original')}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4">
              {title}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              {item.vote_average > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-semibold">{item.vote_average.toFixed(1)}</span>
                </div>
              )}
              {year && <span className="text-gray-300">{year}</span>}
            </div>

            <p className="text-gray-200 text-lg mb-8 line-clamp-3">
              {item.overview}
            </p>

            <div className="flex items-center space-x-4">
              <Link
                href={href}
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Watch Now
              </Link>
              <Link
                href={href}
                className="bg-gray-600/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
