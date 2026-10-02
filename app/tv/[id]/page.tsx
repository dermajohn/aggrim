'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import CastCard from '@/components/CastCard';
import MovieCard from '@/components/MovieCard';
import SeasonSelector from '@/components/SeasonSelector';
import EpisodeCard from '@/components/EpisodeCard';
import VideoPlayer from '@/components/VideoPlayer';
import LanguageSelector from '@/components/LanguageSelector';
import { fetchVideoServers, determineLanguageOptions, getEmbedUrl, VideoServer } from '@/lib/videoSource';
import { LANGUAGE_NAMES } from '@/lib/config';

interface TVDetails {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  number_of_seasons: number;
  original_language: string;
  genres: Array<{ id: number; name: string }>;
  seasons: Array<{
    season_number: number;
    name: string;
    episode_count: number;
  }>;
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
      name: string;
      poster_path: string | null;
      vote_average: number;
      first_air_date: string;
    }>;
  };
}

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  runtime: number;
}

export default function TVDetailPage() {
  const params = useParams();
  const [show, setShow] = useState<TVDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<{ season: number; episode: number } | null>(null);
  const [servers, setServers] = useState<VideoServer[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'original' | 'hindi'>('original');
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState('');

  useEffect(() => {
    fetchTVDetails();
  }, [params.id]);

  useEffect(() => {
    if (show) {
      fetchEpisodes();
    }
  }, [show, selectedSeason]);

  const fetchTVDetails = async () => {
    try {
      const res = await fetch(`/api/tv/${params.id}`);
      const data = await res.json();
      setShow(data);
      
      // Set initial season to first non-special season
      const firstSeason = data.seasons?.find((s: any) => s.season_number > 0);
      if (firstSeason) {
        setSelectedSeason(firstSeason.season_number);
      }
    } catch (error) {
      console.error('Error fetching TV details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    setEpisodesLoading(true);
    try {
      const res = await fetch(`/api/tv/${params.id}/season/${selectedSeason}`);
      const data = await res.json();
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setEpisodesLoading(false);
    }
  };

  const handleWatchEpisode = async (seasonNum: number, episodeNum: number) => {
    if (!show) return;

    setPlayingEpisode({ season: seasonNum, episode: episodeNum });
    setShowPlayer(true);
    const embedUrl = getEmbedUrl('tv', show.id, seasonNum, episodeNum);
    setCurrentEmbedUrl(embedUrl);

    // Fetch available servers
    const videoServers = await fetchVideoServers('tv', show.id, seasonNum, episodeNum);
    setServers(videoServers);
  };

  const handleLanguageChange = (lang: 'original' | 'hindi') => {
    setSelectedLanguage(lang);
    if (!show || !playingEpisode) return;

    const langOptions = determineLanguageOptions(servers, show.original_language);
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

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">TV show not found</h1>
          <Link href="/" className="text-[#e50914] hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const year = show.first_air_date.split('-')[0];
  const validSeasons = show.seasons?.filter(s => s.season_number > 0) || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full">
        {show.backdrop_path && (
          <img
            src={getImageUrl(show.backdrop_path, 'original')}
            alt={show.name}
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
            {show.poster_path && (
              <img
                src={getImageUrl(show.poster_path, 'w500')}
                alt={show.name}
                className="w-64 md:w-full rounded-lg shadow-2xl"
              />
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{show.name}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">{year}</span>
              <span className="text-gray-300">{show.number_of_seasons} Seasons</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres.map(genre => (
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
              <p className="text-gray-300 leading-relaxed">{show.overview}</p>
            </div>

            {/* Video Player */}
            {showPlayer && currentEmbedUrl && (
              <div className="mb-12">
                <VideoPlayer embedUrl={currentEmbedUrl} title={show?.name} />
                {servers.length > 0 && show && (
                  <LanguageSelector
                    servers={servers}
                    originalLanguage={show.original_language}
                    originalLanguageName={LANGUAGE_NAMES[show.original_language] || show.original_language}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                )}
              </div>
            )}

            {/* Cast */}
            {show.credits?.cast && show.credits.cast.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {show.credits.cast.slice(0, 12).map(person => (
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

            {/* Seasons & Episodes */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Episodes</h2>
                <SeasonSelector
                  seasons={validSeasons}
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSelectedSeason}
                />
              </div>

              {episodesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-32" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {episodes.map(episode => (
                    <EpisodeCard
                      key={episode.id}
                      name={episode.name}
                      overview={episode.overview}
                      episodeNumber={episode.episode_number}
                      airDate={episode.air_date}
                      stillPath={episode.still_path}
                      voteAverage={episode.vote_average}
                      runtime={episode.runtime}
                      onWatch={() => handleWatchEpisode(selectedSeason, episode.episode_number)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Similar Shows */}
            {show.similar?.results && show.similar.results.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Similar TV Shows</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {show.similar.results.slice(0, 10).map(similar => (
                    <MovieCard
                      key={similar.id}
                      id={similar.id}
                      title={similar.name}
                      posterPath={similar.poster_path}
                      voteAverage={similar.vote_average}
                      releaseDate={similar.first_air_date}
                      mediaType="tv"
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
