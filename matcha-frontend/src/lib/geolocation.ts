interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  error?: string;
}

const locationCache = new Map<string, string>();

export const clearLocationCache = () => {
  locationCache.clear();
};

export const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
  const lat4 = Math.floor(Math.round(latitude * 100000) / 10);
  const lon4 = Math.floor(Math.round(longitude * 100000) / 10);
  const cacheKey = `${lat4},${lon4}`;

  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'Matcha-App'
        }
      }
    );

    if (!response.ok) {
      console.warn(`Geolocation API error: ${response.status}`);
      return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
    }

    const data: NominatimResponse = await response.json();

    if (data.error) {
      console.warn('Geolocation API error:', data.error);
      return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
    }

    const address = data.address || {};
    const city = address.city || address.town || address.village;
    const state = address.state;
    const country = address.country;

    let locationName = '';
    if (city) locationName += city;
    if (state && state !== country) {
      if (locationName) locationName += ', ';
      locationName += state;
    }
    if (country && locationName !== country) {
      if (locationName) locationName += ', ';
      locationName += country;
    }

    const result = locationName || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

    locationCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Failed to fetch location name:', error);
    return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
  }
};
