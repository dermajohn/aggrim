import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  try {
    // Fetch the embed page
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch embed page: ${res.status}`);
    }

    const html = await res.text();

    // Try to extract stream URL from the page
    // Look for common patterns in video embed pages
    const streamPatterns = [
      /file:\s*["']([^"']+\.m3u8[^"']*)["']/i,
      /source:\s*["']([^"']+\.m3u8[^"']*)["']/i,
      /src:\s*["']([^"']+\.m3u8[^"']*)["']/i,
      /url:\s*["']([^"']+\.m3u8[^"']*)["']/i,
      /["']([^"']+\.m3u8[^"']*)["']/i,
      /file:\s*["']([^"']+\.mp4[^"']*)["']/i,
      /source:\s*["']([^"']+\.mp4[^"']*)["']/i,
      /src:\s*["']([^"']+\.mp4[^"']*)["']/i,
      /url:\s*["']([^"']+\.mp4[^"']*)["']/i,
      /["']([^"']+\.mp4[^"']*)["']/i,
    ];

    for (const pattern of streamPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return NextResponse.json({ streamUrl: match[1] });
      }
    }

    // If no stream URL found, return null
    return NextResponse.json({ streamUrl: null });
  } catch (error) {
    console.error('Error extracting stream URL:', error);
    return NextResponse.json({ streamUrl: null });
  }
}
