'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import CastCard from '@/components/CastCard';
import MovieCard from '@/components/MovieCard';
import VideoPlayer from '@/components/VideoPlayer';
import LanguageSelector from '@/components/LanguageSelector';
import { fetchVideoServers, determineLanguageOptions, getEmbedUrl, VideoServer } from '@/lib/videoSource';
import { LANGUAGE_NAMES } from '@/lib/config';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  original_language: string;
  genres: Array<{ id: number; name: string }>;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  similar: {
    results: Array<{
      id: number;
      title: string;
      poster_path: string | null;
      vote_average: number;
      release_date: string;
    }>;
  };
}

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [servers, setServers] = useState<VideoServer[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'original' | 'hindi'>('original');
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState('');

  useEffect(() => {
    fetchMovieDetails();
  }, [params.id]);

  const fetchMovieDetails = async () => {
    try {
      const res = await fetch(`/api/movie/${params.id}`);
      const data = await res.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchNow = async () => {
    if (!movie) return;

    setShowPlayer(true);
    const embedUrl = getEmbedUrl('movie', movie.id);
    setCurrentEmbedUrl(embedUrl);

    // Fetch available servers
    const videoServers = await fetchVideoServers('movie', movie.id);
    setServers(videoServers);
  };

  const handleLanguageChange = (lang: 'original' | 'hindi') => {
    setSelectedLanguage(lang);
    if (!movie) return;

    const langOptions = determineLanguageOptions(servers, movie.original_language);
    const server = lang === 'hindi' ? langOptions.hindiServer : langOptions.originalServer;
    
    if (server) {
      setCurrentEmbedUrl(server.embedUrl);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="skeleton aspect-[2/3]" />
            <div className="md:col-span-2 space-y-4">
              <div className="skeleton h-12 w-3/4" />
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Movie not found</h1>
          <Link href="/" className="text-[#e50914] hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const year = movie.release_date ? movie.release_date.split('-')[0] : '';

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full">
        {movie.backdrop_path && (
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 gradient-bottom" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="flex justify-center md:justify-start">
            {movie.poster_path && (
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-64 md:w-full rounded-lg shadow-2xl"
              />
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">{year}</span>
              <span className="text-gray-300">{movie.runtime} min</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Language Selector and Watch Button */}
            {showPlayer && servers.length > 0 && movie && (
              <LanguageSelector
                servers={servers}
                originalLanguage={movie.original_language}
                originalLanguageName={LANGUAGE_NAMES[movie.original_language] || movie.original_language}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            )}

            {!showPlayer && (
              <button
                onClick={handleWatchNow}
                className="bg-[#e50914] text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors mb-12"
              >
                Watch Now
              </button>
            )}

            {/* Video Player */}
            {showPlayer && currentEmbedUrl && (
              <div className="mb-12">
                <VideoPlayer embedUrl={currentEmbedUrl} title={movie?.title} />
              </div>
            )}

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {movie.credits.cast.slice(0, 12).map(person => (
                    <CastCard
                      key={person.id}
                      name={person.name}
                      character={person.character}
                      profilePath={person.profile_path}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {movie.similar?.results && movie.similar.results.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.similar.results.slice(0, 10).map(similar => (
                    <MovieCard
                      key={similar.id}
                      id={similar.id}
                      title={similar.title}
                      posterPath={similar.poster_path}
                      voteAverage={similar.vote_average}
                      releaseDate={similar.release_date}
                      mediaType="movie"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
