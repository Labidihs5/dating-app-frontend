'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { challengesAPI } from '@/lib/py-api';
import { useI18n } from '@/components/i18n/LanguageProvider';
import { getTelegramUser } from '@/lib/telegram-utils';

export default function ChallengesPage() {
  const { t } = useI18n();
  const [challenge, setChallenge] = useState<any>(null);

  const generate = async () => {
    const user = getTelegramUser();
    const data = await challengesAPI.generate({
      game_type: 'chess',
      trigger: 'post_game',
      user_id: user?.id || crypto.randomUUID(),
      target_id: null,
    });
    setChallenge(data.challenge);
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-2xl mx-auto px-4 space-y-6">
            <Card className="p-6 space-y-4">
              <h1 className="text-2xl font-bold">{t('challenges.title')}</h1>
              <Button onClick={generate}>{t('challenges.generate')}</Button>
              {challenge && (
                <Card className="p-4 bg-muted/50">
                  <p className="font-semibold">{t('challenges.label')}</p>
                  <p className="text-sm text-muted-foreground">{challenge.challenge_text}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline">{t('challenges.doMyself')}</Button>
                    <Button>{t('challenges.aiHelp')}</Button>
                    <Button variant="ghost">{t('challenges.pass')}</Button>
                  </div>
                </Card>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
