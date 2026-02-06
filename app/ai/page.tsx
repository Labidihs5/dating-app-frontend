'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aiAPI } from '@/lib/py-api';
import { useI18n } from '@/components/i18n/LanguageProvider';
import { getTelegramUser } from '@/lib/telegram-utils';

export default function AIPage() {
  const { t } = useI18n();
  const [context, setContext] = useState('');
  const [intent, setIntent] = useState('icebreaker');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const user = getTelegramUser();
      const data = await aiAPI.generateMessage({ user_id: user?.id || crypto.randomUUID(), context, intent });
      setResult(data.message);
    } catch (e: any) {
      setResult(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <Card className="p-6 space-y-4">
              <h1 className="text-2xl font-bold">{t('ai.title')}</h1>
              <Input
                placeholder={t('ai.contextPlaceholder')}
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              <Input
                placeholder={t('ai.intentPlaceholder')}
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
              />
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? t('ai.generating') : t('ai.generate')}
              </Button>
              {result && (
                <Card className="p-4 bg-muted/40">
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </Card>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
