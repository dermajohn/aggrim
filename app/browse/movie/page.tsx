'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import GenrePill from '@/components/GenrePill';
import { GENRES } from '@/lib/tmdb';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

function BrowseMoviesContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    initialGenre ? parseInt(initialGenre) : null
  );
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, sortBy, page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        media_type: 'movie',
        page: page.toString(),
        sort_by: sortBy,
      });
      
      if (selectedGenre) {
        params.set('genre_id', selectedGenre.toString());
      }

      const res = await fetch(`/api/discover?${params}`);
      const data = await res.json();
      
      if (page === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Browse Movies</h1>

        {/* Sort Options */}
        <div className="mb-6">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-white focus:outline-none"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Newest First</option>
            <option value="release_date.asc">Oldest First</option>
          </select>
        </div>

        {/* Genre Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <GenrePill
            name="All"
            isActive={selectedGenre === null}
            onClick={() => handleGenreChange(null)}
          />
          {GENRES.movie.map(genre => (
            <GenrePill
              key={genre.id}
              name={genre.name}
              isActive={selectedGenre === genre.id}
              onClick={() => handleGenreChange(genre.id)}
            />
          ))}
        </div>

        {/* Movies Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="skeleton aspect-[2/3]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  voteAverage={movie.vote_average}
                  releaseDate={movie.release_date}
                  mediaType="movie"
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

            {!hasMore && movies.length > 0 && (
              <p className="text-center text-gray-400 mt-12">No more movies to load</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BrowseMovies() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20"><div className="max-w-7xl mx-auto px-4"><div className="skeleton h-12 w-64 mb-8" /></div></div>}>
      <BrowseMoviesContent />
    </Suspense>
  );
}
