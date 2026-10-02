import { NextResponse } from 'next/server';
import { getTVSeasonDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: { id: string; season: string } }
) {
  try {
    const data = await getTVSeasonDetails(params.id, parseInt(params.season));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch season details' }, { status: 500 });
  }
}
