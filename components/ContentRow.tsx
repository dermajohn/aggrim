import MovieCard from './MovieCard';

interface ContentRowProps {
  title: string;
  items: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
  }>;
  defaultMediaType?: string;
}

export default function ContentRow({ title, items, defaultMediaType = 'movie' }: ContentRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-4 px-4 sm:px-6 lg:px-8">{title}</h2>
      <div className="hide-scrollbar overflow-x-auto">
        <div className="flex space-x-4 px-4 sm:px-6 lg:px-8 pb-4">
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-36 sm:w-44">
              <MovieCard
                id={item.id}
                title={item.title || item.name || 'Unknown'}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
                mediaType={item.media_type || defaultMediaType}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
