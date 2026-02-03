'use client';

import { useState, useCallback } from 'react';

export interface UserPreferences {
  ageMin: number;
  ageMax: number;
  genderPreference: 'male' | 'female' | 'all';
  maxDistance: number;
  interests: string[];
}

const defaultPreferences: UserPreferences = {
  ageMin: 18,
  ageMax: 65,
  genderPreference: 'all',
  maxDistance: 50,
  interests: [],
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const updatePreference = useCallback((key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateInterests = useCallback((interests: string[]) => {
    setPreferences(prev => ({
      ...prev,
      interests,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  return {
    preferences,
    updatePreference,
    updateInterests,
    resetPreferences,
  };
}
