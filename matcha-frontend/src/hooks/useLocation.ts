// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  accuracy?: number;
  source: 'gps' | 'ip' | 'network' | 'manual' | 'browser_geolocation';
  neighborhood?: string;
  timezone?: string;
  postalCode?: string;
}

interface LocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasGPSPermission: boolean;
  hasTriedGPS: boolean;
  locationMethods: string[];
}

interface IPLocationService {
  name: string;
  url: string;
  apiKey?: string;
  parser: (data: any) => Partial<LocationData>;
  backup?: boolean;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null,
    hasGPSPermission: false,
    hasTriedGPS: false,
    locationMethods: []
  });

  const ipLocationServices: IPLocationService[] = [
    {
      name: 'ipapi.co',
      url: 'https://ipapi.co/json/',
      parser: (data: any) => ({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name,
        neighborhood: data.region,
        timezone: data.timezone,
        postalCode: data.postal
      })
    },
    {
      name: 'ip-api.com',
      url: 'http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,query',
      parser: (data: any) => ({
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        country: data.country,
        neighborhood: data.regionName,
        timezone: data.timezone,
        postalCode: data.zip
      })
    },
    {
      name: 'ipgeolocation.io',
      url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
      parser: (data: any) => ({
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        city: data.city,
        country: data.country_name,
        neighborhood: data.district,
        timezone: data.time_zone?.name,
        postalCode: data.zipcode
      })
    },
    {
      name: 'geoplugin.net',
      url: 'http://www.geoplugin.net/json.gp',
      backup: true,
      parser: (data: any) => ({
        latitude: parseFloat(data.geoplugin_latitude),
        longitude: parseFloat(data.geoplugin_longitude),
        city: data.geoplugin_city,
        country: data.geoplugin_countryName,
        neighborhood: data.geoplugin_region,
        timezone: data.geoplugin_timezone
      })
    }
  ];

  const getHighAccuracyGPS = useCallback((): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        resolve(null);
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000, 
        maximumAge: 300000 
      };

      let resolved = false;

      const successCallback = async (position: GeolocationPosition) => {
        if (resolved) return;
        resolved = true;
        
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          const addressInfo = await reverseGeocode(latitude, longitude);
          
          resolve({
            latitude,
            longitude,
            accuracy,
            source: 'gps',
            ...addressInfo
          });
        } catch (error) {
          resolve({
            latitude,
            longitude,
            accuracy,
            source: 'gps'
          });
        }
      };

      const errorCallback = (error: GeolocationPositionError) => {
        if (resolved) return;
        resolved = true;
        
        console.error('High accuracy GPS error:', error);
        setState(prev => ({
          ...prev,
          hasGPSPermission: error.code !== error.PERMISSION_DENIED,
          hasTriedGPS: true,
          locationMethods: [...prev.locationMethods, `GPS failed: ${error.message}`]
        }));
        
        resolve(null);
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }, 16000);
    });
  }, []);

  const getNetworkLocation = useCallback((): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: false, 
        timeout: 10000,
        maximumAge: 600000 
      };

      let resolved = false;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (resolved) return;
          resolved = true;
          
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            const addressInfo = await reverseGeocode(latitude, longitude);
            resolve({
              latitude,
              longitude,
              accuracy,
              source: 'network',
              ...addressInfo
            });
          } catch (error) {
            resolve({
              latitude,
              longitude,
              accuracy,
              source: 'network'
            });
          }
        },
        (error) => {
          if (resolved) return;
          resolved = true;
          console.error('Network location error:', error);
          setState(prev => ({
            ...prev,
            locationMethods: [...prev.locationMethods, `Network failed: ${error.message}`]
          }));
          resolve(null);
        },
        options
      );

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }, 11000);
    });
  }, []);

  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WebMatcha/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const data = await response.json();
      
      return {
        city: data.address?.city || data.address?.town || data.address?.village,
        country: data.address?.country,
        neighborhood: data.address?.neighbourhood || data.address?.suburb || data.address?.quarter,
        postalCode: data.address?.postcode
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {};
    }
  };

  const getLocationFromIP = async (): Promise<LocationData | null> => {
    console.log('Attempting comprehensive IP-based location determination...');
    
    const primaryServices = ipLocationServices.filter(service => !service.backup);
    
    for (const service of primaryServices) {
      try {
        console.log(`Trying ${service.name}...`);
        
        const response = await fetch(service.url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000) 
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const locationData = service.parser(data);
        
        if (locationData.latitude && locationData.longitude) {
          console.log(`✅ IP location obtained from ${service.name}`);
          setState(prev => ({
            ...prev,
            locationMethods: [...prev.locationMethods, `IP success: ${service.name}`]
          }));
          
          return {
            ...locationData,
            source: 'ip'
          } as LocationData;
        }
      } catch (error) {
        console.warn(`IP service ${service.name} failed:`, error);
        setState(prev => ({
          ...prev,
          locationMethods: [...prev.locationMethods, `IP failed: ${service.name}`]
        }));
        continue;
      }
    }
    
    const backupServices = ipLocationServices.filter(service => service.backup);
    
    for (const service of backupServices) {
      try {
        console.log(`Trying backup service ${service.name}...`);
        
        const response = await fetch(service.url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const locationData = service.parser(data);
        
        if (locationData.latitude && locationData.longitude) {
          console.log(`✅ Backup IP location obtained from ${service.name}`);
          setState(prev => ({
            ...prev,
            locationMethods: [...prev.locationMethods, `IP backup success: ${service.name}`]
          }));
          
          return {
            ...locationData,
            source: 'ip'
          } as LocationData;
        }
      } catch (error) {
        console.warn(`Backup IP service ${service.name} failed:`, error);
        continue;
      }
    }
    
    console.warn('All location services failed, using default Singapore location');
    setState(prev => ({
      ...prev,
      locationMethods: [...prev.locationMethods, 'Fallback: Default Singapore']
    }));
    
    return {
      latitude: 1.3521,
      longitude: 103.8198,
      city: 'Singapore',
      country: 'Singapore',
      source: 'ip'
    };
  };

  const getCurrentLocation = useCallback(async (forceRefresh = false) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      locationMethods: forceRefresh ? [] : prev.locationMethods
    }));

    try {
      let location: LocationData | null = null;

      if (!state.hasTriedGPS || forceRefresh) {
        console.log('🛰️ Attempting high-accuracy GPS location...');
        try {
          location = await getHighAccuracyGPS();
          if (location) {
            console.log('✅ High-accuracy GPS successful');
          }
        } catch (error) {
          console.error('High-accuracy GPS failed:', error);
        }
      }

      if (!location) {
        console.log('📶 Attempting network-based location...');
        try {
          location = await getNetworkLocation();
          if (location) {
            console.log('✅ Network-based location successful');
          }
        } catch (error) {
          console.error('Network-based location failed:', error);
        }
      }

      if (!location) {
        console.log('🌐 Using IP-based location (mandatory fallback)...');
        location = await getLocationFromIP();
      }

      if (location) {
        setState(prev => ({
          ...prev,
          location,
          isLoading: false,
          error: null
        }));

        try {
          await api.updateLocation(location.latitude, location.longitude);
          console.log('✅ Server location updated');
        } catch (error) {
          console.error('Failed to update server location:', error);
        }
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Unable to determine location using any method'
        }));
      }
    } catch (error) {
      console.error('Location detection completely failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Location detection failed'
      }));
    }
  }, [state.hasTriedGPS, getHighAccuracyGPS, getNetworkLocation]);

  const updateLocationManually = useCallback(async (latitude: number, longitude: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const addressInfo = await reverseGeocode(latitude, longitude);
      
      const location: LocationData = {
        latitude,
        longitude,
        source: 'manual',
        ...addressInfo
      };
      
      setState(prev => ({
        ...prev,
        location,
        isLoading: false,
        locationMethods: [...prev.locationMethods, 'Manual location set']
      }));
      
      await api.updateLocation(latitude, longitude);
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update manual location'
      }));
    }
  }, []);

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    } else if (distance < 10) {
      return `${distance.toFixed(1)}km away`;
    } else {
      return `${Math.round(distance)}km away`;
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location: state.location,
    isLoading: state.isLoading,
    error: state.error,
    hasGPSPermission: state.hasGPSPermission,
    hasTriedGPS: state.hasTriedGPS,
    locationMethods: state.locationMethods,
    getCurrentLocation,
    updateLocationManually,
    calculateDistance,
    formatDistance,
    reverseGeocode
  };
};
