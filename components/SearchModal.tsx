'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';

interface SearchModalProps {
  onClose: () => void;
}

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 pt-20">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, anime..."
            className="w-full bg-[#1a1a1a] text-white text-xl px-6 py-4 pr-12 rounded-lg border border-gray-700 focus:border-white focus:outline-none transition-colors"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-8 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3]" />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.map((result) => {
                const title = result.title || result.name || 'Unknown';
                const year = (result.release_date || result.first_air_date || '').split('-')[0];
                const href = result.media_type === 'tv' ? `/tv/${result.id}` : `/movie/${result.id}`;

                return (
                  <Link
                    key={result.id}
                    href={href}
                    onClick={onClose}
                    className="card-hover"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a]">
                      {result.poster_path ? (
                        <img
                          src={getImageUrl(result.poster_path, 'w500')}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                        <p className="text-white text-sm font-semibold line-clamp-2">{title}</p>
                        {year && <p className="text-gray-400 text-xs mt-1">{year}</p>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center text-gray-400 mt-12">
              <p className="text-lg">No results found for "{query}"</p>
            </div>
          )}

          {!loading && !query && (
            <div className="text-center text-gray-500 mt-12">
              <p className="text-lg">Start typing to search...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
