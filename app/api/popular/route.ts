import { NextResponse } from 'next/server';
import { getPopular } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('media_type') || 'movie';

  try {
    const data = await getPopular(mediaType as any);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch popular' }, { status: 500 });
  }
}
