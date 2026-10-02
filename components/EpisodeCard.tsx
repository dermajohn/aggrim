import { getImageUrl } from '@/lib/tmdb';

interface EpisodeCardProps {
  name: string;
  overview: string;
  episodeNumber: number;
  airDate?: string;
  stillPath: string | null;
  voteAverage: number;
  runtime?: number;
  onWatch?: () => void;
}

export default function EpisodeCard({
  name,
  overview,
  episodeNumber,
  airDate,
  stillPath,
  voteAverage,
  runtime,
  onWatch,
}: EpisodeCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
      <div className="relative w-full sm:w-64 aspect-video rounded-lg overflow-hidden bg-[#0a0a0a] flex-shrink-0">
        {stillPath ? (
          <img
            src={getImageUrl(stillPath, 'w500')}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {onWatch && (
          <button
            onClick={onWatch}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-gray-400 text-sm">Episode {episodeNumber}</p>
            <h3 className="text-white font-semibold text-lg">{name}</h3>
          </div>
          {voteAverage > 0 && (
            <div className="flex items-center space-x-1 bg-black/60 px-2 py-1 rounded">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-xs font-semibold">{voteAverage.toFixed(1)}</span>
            </div>
          )}
        </div>

        {overview && (
          <p className="text-gray-300 text-sm line-clamp-3 mb-2">{overview}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-400 text-xs">
            {airDate && <span>{new Date(airDate).toLocaleDateString()}</span>}
            {runtime && <span>{runtime} min</span>}
          </div>
          {onWatch && (
            <button
              onClick={onWatch}
              className="text-[#e50914] hover:text-red-400 text-sm font-medium transition-colors"
            >
              Watch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
