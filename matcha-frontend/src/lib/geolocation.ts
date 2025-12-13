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
  fallback?: boolean;
}

const locationCache = new Map<string, string>();

export const clearLocationCache = () => {
  locationCache.clear();
};
