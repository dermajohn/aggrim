import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';

interface Top10RowProps {
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
}

export default function Top10Row({ title, items }: Top10RowProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-4 px-4 sm:px-6 lg:px-8">{title}</h2>
      <div className="hide-scrollbar overflow-x-auto">
        <div className="flex space-x-6 px-4 sm:px-6 lg:px-8 pb-4">
          {items.map((item, index) => {
            const itemTitle = item.title || item.name || 'Unknown';
            const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

            return (
              <Link
                key={item.id}
                href={href}
                className="flex-shrink-0 flex items-end group"
              >
                {/* Rank Number */}
                <div className="top-10-number mr-[-20px] z-10 select-none">
                  {index + 1}
                </div>

                {/* Poster */}
                <div className="relative w-32 sm:w-40 aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] card-hover">
                  {item.poster_path ? (
                    <img
                      src={getImageUrl(item.poster_path, 'w500')}
                      alt={itemTitle}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
