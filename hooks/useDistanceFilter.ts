'use client';

import { useState, useCallback, useMemo } from 'react';

export interface ProfileWithDistance {
  id: string;
  name: string;
  age: number;
  distance: number;
  image: string;
  bio: string;
  relationshipType: string;
  compatibility?: number;
  isPremium?: boolean;
}

interface UseDistanceFilterReturn {
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  filteredProfiles: ProfileWithDistance[];
  totalProfiles: number;
  filterProfiles: (profiles: ProfileWithDistance[], distance: number) => ProfileWithDistance[];
}

export function useDistanceFilter(
  initialDistance: number = 50
): UseDistanceFilterReturn {
  const [maxDistance, setMaxDistance] = useState(initialDistance);

  // Filter profiles by distance
  const filterProfiles = useCallback(
    (profiles: ProfileWithDistance[], distance: number): ProfileWithDistance[] => {
      return profiles
        .filter((profile) => profile.distance <= distance)
        .sort((a, b) => a.distance - b.distance);
    },
    []
  );

  const filteredProfiles = useMemo(() => {
    // This will be populated from parent component
    return [];
  }, []);

  return {
    maxDistance,
    setMaxDistance,
    filteredProfiles,
    totalProfiles: filteredProfiles.length,
    filterProfiles,
  };
}

// Utility function to calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
}

// Utility to add distance info to profiles
export function enrichProfilesWithDistance(
  profiles: any[],
  userLat: number,
  userLon: number
): ProfileWithDistance[] {
  return profiles.map((profile) => ({
    ...profile,
    distance: calculateDistance(
      userLat,
      userLon,
      profile.location?.latitude || 0,
      profile.location?.longitude || 0
    ),
  }));
}
