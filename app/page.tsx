import { getTrending, getPopular, getTopRated, getUpcoming, getNowPlaying, GENRES } from '@/lib/tmdb';
import HeroBanner from '@/components/HeroBanner';
import ContentRow from '@/components/ContentRow';
import Top10Row from '@/components/Top10Row';
import Link from 'next/link';

export default async function Home() {
  try {
    const [trending, popularMovies, popularTV, topRated, upcoming, nowPlaying] = await Promise.all([
      getTrending('all', 'week'),
      getPopular('movie'),
      getPopular('tv'),
      getTopRated('movie'),
      getUpcoming(),
      getNowPlaying(),
    ]);

    const heroItems = trending.results?.slice(0, 5) || [];

    return (
      <div className="pb-20">
        {/* Hero Section */}
        <HeroBanner items={heroItems} />

        {/* Top 10 Section */}
        <Top10Row title="Top 10 Movies" items={popularMovies.results?.slice(0, 10) || []} />

        {/* Popular Genres */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 px-4 sm:px-6 lg:px-8">Popular Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 sm:px-6 lg:px-8">
            {GENRES.movie.slice(0, 12).map(genre => (
              <Link
                key={genre.id}
                href={`/browse/movie?genre=${genre.id}`}
                className="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg p-4 text-center transition-colors"
              >
                <span className="text-white font-medium">{genre.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending This Week */}
        <ContentRow title="Trending This Week" items={trending.results || []} />

        {/* Popular Movies */}
        <ContentRow title="Popular Movies" items={popularMovies.results || []} />

        {/* Popular TV Shows */}
        <ContentRow title="Popular TV Shows" items={popularTV.results || []} defaultMediaType="tv" />

        {/* Upcoming Movies */}
        <ContentRow title="Upcoming Movies" items={upcoming.results || []} />

        {/* Now Playing */}
        <ContentRow title="Now Playing" items={nowPlaying.results || []} />

        {/* Top Rated */}
        <ContentRow title="Top Rated" items={topRated.results || []} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching home data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Unable to load content</h1>
          <p className="text-gray-400">Please check your API key configuration and try again.</p>
        </div>
      </div>
    );
  }
}
