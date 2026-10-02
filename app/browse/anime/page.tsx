'use client';

import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
}

export default function BrowseAnime() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchAnime();
  }, [page]);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
      });

      const res = await fetch(`/api/discover?${params}`);
      const data = await res.json();
      
      if (page === 1) {
        setShows(data.results || []);
      } else {
        setShows(prev => [...prev, ...(data.results || [])]);
      }
      
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Anime</h1>

        {/* Anime Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="skeleton aspect-[2/3]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {shows.map(show => (
                <MovieCard
                  key={show.id}
                  id={show.id}
                  title={show.name}
                  posterPath={show.poster_path}
                  voteAverage={show.vote_average}
                  releaseDate={show.first_air_date}
                  mediaType="tv"
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-[#e50914] text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}

            {!hasMore && shows.length > 0 && (
              <p className="text-center text-gray-400 mt-12">No more anime to load</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
