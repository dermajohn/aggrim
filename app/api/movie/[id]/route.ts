import { NextResponse } from 'next/server';
import { getMovieDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getMovieDetails(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}
