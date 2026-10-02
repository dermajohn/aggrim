import { NextResponse } from 'next/server';
import { getUpcoming } from '@/lib/tmdb';

export async function GET() {
  try {
    const data = await getUpcoming();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch upcoming movies' }, { status: 500 });
  }
}
