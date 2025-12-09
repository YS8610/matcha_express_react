import { NextRequest, NextResponse } from 'next/server';

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

const geocodeCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing latitude or longitude' },
      { status: 400 }
    );
  }

  const cacheKey = `${parseFloat(lat).toFixed(8)},${parseFloat(lon).toFixed(8)}`;
  const cached = geocodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  try {
    lastRequestTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'Matcha-Dating-App/1.0 (Educational Project)',
          'Accept': 'application/json'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Geocoding service unavailable', fallback: true },
        { status: 200 }
      );
    }

    const data = await response.json();

    geocodeCache.set(cacheKey, { data, timestamp: Date.now() });

    if (geocodeCache.size > 1000) {
      const entries = Array.from(geocodeCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      entries.slice(0, 500).forEach(([key]) => geocodeCache.delete(key));
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Geocoding request timed out', fallback: true },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch location data', fallback: true },
      { status: 200 }
    );
  }
}
