import { NextResponse } from 'next/server';
import { getByGenre, discoverAnime } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('media_type') || 'movie';
  const genreId = searchParams.get('genre_id');
  const page = searchParams.get('page') || '1';

  try {
    let data;
    if (genreId) {
      data = await getByGenre(mediaType as any, parseInt(genreId), parseInt(page));
    } else {
      data = await discoverAnime(parseInt(page));
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to discover content' }, { status: 500 });
  }
}
