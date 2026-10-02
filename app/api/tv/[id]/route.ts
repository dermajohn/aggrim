import { NextResponse } from 'next/server';
import { getTVDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getTVDetails(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch TV details' }, { status: 500 });
  }
}
