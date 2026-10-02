import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('media_type') || 'all';
  const timeWindow = searchParams.get('time_window') || 'week';

  try {
    const data = await getTrending(mediaType as any, timeWindow as any);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 });
  }
}
