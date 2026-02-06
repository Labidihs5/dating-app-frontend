'use client';

import { useEffect, useRef } from 'react';

const WS_URL = (process.env.NEXT_PUBLIC_PY_API_URL || 'http://localhost:8001').replace('http', 'ws');

export function useEventSocket(onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}/ws/events?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        // ignore
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [onMessage]);

  return wsRef;
}
