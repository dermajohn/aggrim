import { getImageUrl } from '@/lib/tmdb';

interface CastCardProps {
  name: string;
  character?: string;
  profilePath: string | null;
}

export default function CastCard({ name, character, profilePath }: CastCardProps) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-[#1a1a1a] mb-2">
        {profilePath ? (
          <img
            src={getImageUrl(profilePath, 'w185')}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
      </div>
      <p className="text-white text-sm font-semibold line-clamp-1">{name}</p>
      {character && (
        <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{character}</p>
      )}
    </div>
  );
}
