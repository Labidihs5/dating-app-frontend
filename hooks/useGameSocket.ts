'use client';

import { useEffect, useRef } from 'react';

const WS_URL = (process.env.NEXT_PUBLIC_PY_API_URL || 'http://localhost:8001').replace('http', 'ws');

export function useGameSocket(gameId: string | null, onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!gameId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const ws = new WebSocket(`${WS_URL}/games/ws/${gameId}?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch {
        // ignore
      }
    };
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [gameId, onMessage]);

  const send = (payload: any) => {
    wsRef.current?.send(JSON.stringify(payload));
  };

  return { send };
}
