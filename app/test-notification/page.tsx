'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTelegramUser } from '@/lib/telegram-utils';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function TestNotificationPage() {
  const { t } = useI18n();
  const [result, setResult] = useState('');

  const createTestNotification = async () => {
    const user = getTelegramUser();
    if (!user) {
      setResult(t('testNotifications.noUser'));
      return;
    }

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: 'like',
          title: t('testNotifications.title'),
          message: t('testNotifications.message'),
          data: { likerName: t('testNotifications.user') }
        })
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`${t('testNotifications.error')}: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <Card className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">{t('testNotifications.heading')}</h1>
        <Button onClick={createTestNotification} className="w-full mb-4">
          {t('testNotifications.create')}
        </Button>
        {result && (
          <pre className="text-xs bg-muted p-2 rounded overflow-auto">
            {result}
          </pre>
        )}
      </Card>
    </div>
  );
}
