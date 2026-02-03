'use client';

import { useEffect } from 'react';

export function useOnlineStatus(userId: string | null) {
  useEffect(() => {
    if (!userId) return;

    // Set online on mount
    const setOnline = async () => {
      try {
        await fetch('/api/status/online', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
      } catch (error) {
        console.error('Error setting online status:', error);
      }
    };

    // Set offline on unmount
    const setOffline = async () => {
      try {
        await fetch('/api/status/offline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
      } catch (error) {
        console.error('Error setting offline status:', error);
      }
    };

    setOnline();

    // Set offline on page unload
    const handleBeforeUnload = () => {
      fetch('/api/status/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        keepalive: true
      }).catch(() => {});
    };

    // Set offline on visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };

    // Heartbeat every 30 seconds
    const interval = setInterval(setOnline, 30000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOffline();
    };
  }, [userId]);
}
