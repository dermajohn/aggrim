import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate?: string;
  mediaType?: string;
}

export default function MovieCard({
  id,
  title,
  posterPath,
  voteAverage,
  releaseDate,
  mediaType = 'movie',
}: MovieCardProps) {
  const year = releaseDate ? releaseDate.split('-')[0] : '';
  const href = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`;

  return (
    <Link href={href} className="card-hover block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a]">
        {posterPath ? (
          <img
            src={getImageUrl(posterPath, 'w500')}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        
        {/* Rating Badge */}
        {voteAverage > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-xs font-semibold">{voteAverage.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="text-white text-sm font-semibold line-clamp-2">{title}</h3>
          {year && <p className="text-gray-300 text-xs mt-1">{year}</p>}
        </div>
      </div>
    </Link>
  );
}
