'use client';

import { useEffect, useRef } from 'react';
import { getTelegramUser } from '@/lib/telegram-utils';
import { authAPI } from '@/lib/api-services';

export function AuthBootstrap() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const existingToken = localStorage.getItem('token');
    if (existingToken) return;

    const user = getTelegramUser();
    if (!user) return;

    authAPI
      .loginWithTelegram({
        telegramId: user.id,
        firstName: user.first_name,
        lastName: user.last_name || '',
        username: user.username || '',
      })
      .then((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
      })
      .catch(() => {
        // ignore bootstrap errors; UI will continue
      });
  }, []);

  return null;
}
