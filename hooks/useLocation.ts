'use client';

import { useState, useCallback, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  accuracy?: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  distanceTo: (lat: number, lon: number) => number;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load location from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userLocation');
    if (stored) {
      try {
        setLocation(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored location:', e);
      }
    }
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;

          // Try to get address from OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const locationData: LocationData = {
            latitude,
            longitude,
            accuracy,
            address: data.address?.road || data.address?.suburb || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city: data.address?.city || data.address?.town || '',
            country: data.address?.country || '',
          };

          setLocation(locationData);
          localStorage.setItem('userLocation', JSON.stringify(locationData));
        } catch (err) {
          console.error('Error getting address:', err);
          const fallbackData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          };
          setLocation(fallbackData);
          localStorage.setItem('userLocation', JSON.stringify(fallbackData));
        }
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to get location';
        switch (err.code) {
          case 1:
            errorMessage = 'Location permission denied';
            break;
          case 2:
            errorMessage = 'Location information unavailable';
            break;
          case 3:
            errorMessage = 'Location request timeout';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    localStorage.removeItem('userLocation');
  }, []);

  const distanceTo = useCallback(
    (lat: number, lon: number): number => {
      if (!location) return 0;
      return calculateDistance(location.latitude, location.longitude, lat, lon);
    },
    [location, calculateDistance]
  );

  return {
    location,
    isLoading,
    error,
    requestLocation,
    clearLocation,
    distanceTo,
  };
}
