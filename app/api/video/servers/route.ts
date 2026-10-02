import { NextResponse } from 'next/server';
import { VIDEO_SOURCE_API } from '@/lib/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('media_type');
  const tmdbId = searchParams.get('tmdb_id');
  const season = searchParams.get('season');
  const episode = searchParams.get('episode');

  if (!mediaType || !tmdbId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    // Build the API URL for fetching servers
    let apiUrl = `${VIDEO_SOURCE_API}/servers/${mediaType}/${tmdbId}`;
    if (mediaType === 'tv' && season && episode) {
      apiUrl += `/${season}/${episode}`;
    }

    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Video source API error: ${res.status}`);
    }

    const data = await res.json();

    // Transform the response to our format
    const servers = (data.result || []).map((server: any) => ({
      id: server.id,
      name: server.name,
    }));

    return NextResponse.json({ servers });
  } catch (error) {
    console.error('Error fetching video servers:', error);
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}
