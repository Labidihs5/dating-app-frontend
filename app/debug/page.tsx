'use client';

import { useEffect, useState } from 'react';
import { getTelegramUser } from '@/lib/telegram-utils';
import { userAPI } from '@/lib/api-services';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function DebugPage() {
  const { t } = useI18n();
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    const user = getTelegramUser();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    setInfo({
      telegramUser: user,
      apiUrl: apiUrl,
      hasTelegram: !!(window as any).Telegram?.WebApp,
      telegramData: (window as any).Telegram?.WebApp?.initDataUnsafe
    });

    if (user) {
      userAPI.getProfile(user.id).then(profile => {
        setInfo((prev: any) => ({ ...prev, profile }));
      }).catch(err => {
        setInfo((prev: any) => ({ ...prev, error: err.message }));
      });
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('debug.title')}</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  );
}
