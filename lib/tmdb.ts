const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return undefined;
  return `${IMAGE_BASE}${size}${path}`;
};

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

// Types
export interface Movie {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  number_of_seasons?: number;
  tagline?: string;
  status?: string;
  production_companies?: ProductionCompany[];
  media_type?: string;
}

export interface TVShow {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  seasons?: Season[];
  media_type?: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date?: string;
  poster_path: string | null;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date?: string;
  still_path: string | null;
  vote_average: number;
  runtime?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
  known_for_department?: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Credits {
  cast: Person[];
  crew: Person[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  credits?: Credits;
  similar?: { results: Movie[] };
  recommendations?: { results: Movie[] };
}

export interface TVDetails extends TVShow {
  genres: Genre[];
  seasons: Season[];
  credits?: Credits;
  similar?: { results: TVShow[] };
  recommendations?: { results: TVShow[] };
}

// API Functions
export async function getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week') {
  return fetchTMDB(`/trending/${mediaType}/${timeWindow}`);
}

export async function getTopRated(mediaType: 'movie' | 'tv' = 'movie') {
  return fetchTMDB(`/${mediaType}/top_rated`);
}

export async function getPopular(mediaType: 'movie' | 'tv' = 'movie') {
  return fetchTMDB(`/${mediaType}/popular`);
}

export async function getMovieDetails(id: number | string) {
  return fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,similar,recommendations' });
}

export async function getTVDetails(id: number | string) {
  return fetchTMDB(`/tv/${id}`, { append_to_response: 'credits,similar,recommendations' });
}

export async function getMovieCredits(id: number | string) {
  return fetchTMDB(`/movie/${id}/credits`);
}

export async function getTVCredits(id: number | string) {
  return fetchTMDB(`/tv/${id}/credits`);
}

export async function searchMulti(query: string) {
  return fetchTMDB('/search/multi', { query, include_adult: 'false' });
}

export async function getByGenre(mediaType: 'movie' | 'tv', genreId: number, page: number = 1) {
  return fetchTMDB(`/discover/${mediaType}`, {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page),
  });
}

export async function getUpcoming() {
  return fetchTMDB('/movie/upcoming');
}

export async function getNowPlaying() {
  return fetchTMDB('/movie/now_playing');
}

export async function getTVSeasonDetails(tvId: number | string, seasonNumber: number) {
  return fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function discoverAnime(page: number = 1) {
  return fetchTMDB('/discover/tv', {
    with_genres: '16',
    sort_by: 'popularity.desc',
    page: String(page),
    with_original_language: 'ja',
  });
}

export async function discoverByProvider(mediaType: 'movie' | 'tv', providerId: number, page: number = 1) {
  return fetchTMDB(`/discover/${mediaType}`, {
    with_watch_providers: String(providerId),
    watch_region: 'US',
    sort_by: 'popularity.desc',
    page: String(page),
  });
}

export const GENRES = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
  ],
};

export const WATCH_PROVIDERS = [
  { id: 8, name: 'Netflix', logo: '/t/p/original/wwemzKWzjKYJEfVcltQnRk4Fa1Y.png' },
  { id: 337, name: 'Disney+', logo: '/t/p/original/7rwgEs15tAFMYR2PkJAb2Fn3mkV.png' },
  { id: 9, name: 'Amazon Prime', logo: '/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.png' },
  { id: 531, name: 'Paramount+', logo: '/t/p/original/xbhHHa1YgtpwhC8lb1NQ3ACVcQl.png' },
  { id: 1899, name: 'Max', logo: '/t/p/original/Ajqyt5oSxNBGji89VUbb4eQ8YzE.png' },
];
