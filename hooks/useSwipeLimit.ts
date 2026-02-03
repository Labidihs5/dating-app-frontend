'use client';

import { useState, useCallback } from 'react';

interface SwipeLimitState {
  remaining: number;
  isPremium: boolean;
  adWatchCount: number;
}

export function useSwipeLimit() {
  const [state, setState] = useState<SwipeLimitState>({
    remaining: 20,
    isPremium: false,
    adWatchCount: 0,
  });

  const swipe = useCallback(() => {
    if (state.isPremium) return true;

    if (state.remaining > 0) {
      setState(prev => ({
        ...prev,
        remaining: prev.remaining - 1,
      }));
      return true;
    }

    return false;
  }, [state.isPremium, state.remaining]);

  const upgradeToPremium = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPremium: true,
      remaining: Number.MAX_SAFE_INTEGER,
    }));
  }, []);

  const watchAd = useCallback(() => {
    if (state.adWatchCount >= 4) return false;

    setState(prev => ({
      ...prev,
      remaining: prev.remaining + 5,
      adWatchCount: prev.adWatchCount + 1,
    }));

    return true;
  }, [state.adWatchCount]);

  const resetDaily = useCallback(() => {
    setState(prev => ({
      ...prev,
      remaining: prev.isPremium ? Number.MAX_SAFE_INTEGER : 20,
      adWatchCount: 0,
    }));
  }, []);

  return {
    ...state,
    swipe,
    watchAd,
    upgradeToPremium,
    resetDaily,
  };
}
