import { SERVER_LANGUAGE_MAP, LANGUAGE_NAMES, VIDEO_SOURCE_BASE } from './config';

export interface VideoServer {
  id: string;
  name: string;
  language: string;
  languageCode: string;
  embedUrl: string;
  streamUrl?: string;
}

export interface VideoSourceResult {
  servers: VideoServer[];
  originalLanguage: string;
  originalLanguageName: string;
  hasHindi: boolean;
  hindiServer?: VideoServer;
  originalServer?: VideoServer;
  embedUrl: string;
}

// Map a server name to a language using our config
function mapServerToLanguage(serverName: string): { language: string; languageCode: string } {
  for (const mapping of SERVER_LANGUAGE_MAP) {
    if (mapping.serverPattern.test(serverName)) {
      return { language: mapping.language, languageCode: mapping.languageCode };
    }
  }
  return { language: 'English', languageCode: 'en' };
}

// Fetch available servers for a movie/TV show from the video source
export async function fetchVideoServers(
  mediaType: 'movie' | 'tv',
  tmdbId: string | number,
  season?: number,
  episode?: number
): Promise<VideoServer[]> {
  try {
    // Fetch servers from our API proxy
    const params = new URLSearchParams({
      media_type: mediaType,
      tmdb_id: String(tmdbId),
    });

    if (mediaType === 'tv' && season !== undefined && episode !== undefined) {
      params.set('season', String(season));
      params.set('episode', String(episode));
    }

    const res = await fetch(`/api/video/servers?${params}`);
    if (!res.ok) throw new Error('Failed to fetch servers');

    const data = await res.json();
    const rawServers: Array<{ id: string; name: string }> = data.servers || [];

    return rawServers.map((server) => {
      const langInfo = mapServerToLanguage(server.name);
      let embedUrl = `${VIDEO_SOURCE_BASE}/embed/${mediaType}/${tmdbId}`;
      if (mediaType === 'tv' && season !== undefined && episode !== undefined) {
        embedUrl += `/${season}/${episode}`;
      }
      embedUrl += `?server=${server.id}`;

      return {
        id: server.id,
        name: server.name,
        language: langInfo.language,
        languageCode: langInfo.languageCode,
        embedUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching video servers:', error);
    return [];
  }
}

// Determine which language buttons to show based on the smart selection logic
export function determineLanguageOptions(
  servers: VideoServer[],
  originalLanguage: string
): { showOriginal: boolean; showHindi: boolean; originalLabel: string; originalServer?: VideoServer; hindiServer?: VideoServer } {
  const originalLanguageName = LANGUAGE_NAMES[originalLanguage] || originalLanguage;

  // Find Hindi server
  const hindiServer = servers.find(s => s.languageCode === 'hi');
  // Find original language server (or default to first English server)
  const originalServer = servers.find(s => s.languageCode === originalLanguage)
    || servers.find(s => s.languageCode === 'en')
    || servers[0];

  if (originalLanguage === 'hi') {
    // Hindi original movie - show only Hindi
    return {
      showOriginal: true,
      showHindi: false,
      originalLabel: 'Hindi',
      originalServer: hindiServer || originalServer,
      hindiServer: undefined,
    };
  }

  // Non-Hindi original
  const hasHindi = !!hindiServer;
  return {
    showOriginal: true,
    showHindi: hasHindi,
    originalLabel: originalLanguageName,
    originalServer,
    hindiServer: hasHindi ? hindiServer : undefined,
  };
}

// Build the full embed URL for a given media item
export function getEmbedUrl(
  mediaType: 'movie' | 'tv',
  tmdbId: string | number,
  season?: number,
  episode?: number
): string {
  let url = `${VIDEO_SOURCE_BASE}/embed/${mediaType}/${tmdbId}`;
  if (mediaType === 'tv' && season !== undefined && episode !== undefined) {
    url += `/${season}/${episode}`;
  }
  return url;
}

// Try to extract a direct stream URL from the video source
// This is used by the custom player to bypass ads
export async function extractStreamUrl(embedUrl: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/video/extract?url=${encodeURIComponent(embedUrl)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.streamUrl || null;
  } catch {
    return null;
  }
}
