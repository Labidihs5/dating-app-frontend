'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { aiAPI } from '@/lib/py-api';
import { useI18n } from '@/components/i18n/LanguageProvider';
import { getTelegramUser } from '@/lib/telegram-utils';

export default function AIChatProfilePage() {
  const router = useRouter();
  const { t } = useI18n();
  const [context, setContext] = useState('');
  const [intent, setIntent] = useState('icebreaker');
  const [lastMessage, setLastMessage] = useState('');
  const [tone, setTone] = useState('');
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [generated, setGenerated] = useState('');
  const [suggested, setSuggested] = useState('');
  const [toneResult, setToneResult] = useState('');
  const [generating, setGenerating] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const getUserId = () => {
    const user = getTelegramUser();
    return user?.id || crypto.randomUUID();
  };

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setGenerating(true);
    try {
      const data = await aiAPI.generateMessage({ user_id: getUserId(), context, intent });
      setGenerated(data.message || '');
    } catch (e: any) {
      setGenerated(e.message || 'Error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSuggest = async () => {
    if (!lastMessage.trim()) return;
    setSuggesting(true);
    try {
      const data = await aiAPI.suggestReply({
        user_id: getUserId(),
        last_message: lastMessage,
        tone: tone.trim() || undefined,
      });
      setSuggested(data.suggestion || '');
    } catch (e: any) {
      setSuggested(e.message || 'Error');
    } finally {
      setSuggesting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!analysisMessage.trim()) return;
    setAnalyzing(true);
    try {
      const data = await aiAPI.analyzeTone({ user_id: getUserId(), message: analysisMessage });
      setToneResult(data.tone || '');
    } catch (e: any) {
      setToneResult(e.message || 'Error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col min-h-screen pb-20 md:pl-20">
          <div className="bg-card border-b border-border sticky top-0 z-10 px-4 py-4">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/chat')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h1 className="font-bold text-lg">{t('chat.aiProfileTitle')}</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 bg-background">
            <div className="max-w-4xl mx-auto space-y-4">
              <Card className="p-4 space-y-3">
                <h2 className="text-base font-semibold">{t('ai.title')}</h2>
                <Textarea
                  placeholder={t('ai.contextPlaceholder')}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
                <Input
                  placeholder={t('ai.intentPlaceholder')}
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                />
                <Button onClick={handleGenerate} disabled={generating || !context.trim()}>
                  {generating ? t('ai.generating') : t('ai.generate')}
                </Button>
                {generated && (
                  <Card className="p-4 bg-muted/40">
                    <pre className="whitespace-pre-wrap text-sm">{generated}</pre>
                  </Card>
                )}
              </Card>

              <Card className="p-4 space-y-3">
                <h2 className="text-base font-semibold">{t('ai.suggest')}</h2>
                <Textarea
                  placeholder={t('ai.lastMessagePlaceholder')}
                  value={lastMessage}
                  onChange={(e) => setLastMessage(e.target.value)}
                />
                <Input
                  placeholder={t('ai.tonePlaceholder')}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
                <Button onClick={handleSuggest} disabled={suggesting || !lastMessage.trim()}>
                  {suggesting ? t('ai.suggesting') : t('ai.suggest')}
                </Button>
                {suggested && (
                  <Card className="p-4 bg-muted/40">
                    <pre className="whitespace-pre-wrap text-sm">{suggested}</pre>
                  </Card>
                )}
              </Card>

              <Card className="p-4 space-y-3">
                <h2 className="text-base font-semibold">{t('ai.analyze')}</h2>
                <Textarea
                  placeholder={t('ai.messagePlaceholder')}
                  value={analysisMessage}
                  onChange={(e) => setAnalysisMessage(e.target.value)}
                />
                <Button onClick={handleAnalyze} disabled={analyzing || !analysisMessage.trim()}>
                  {analyzing ? t('ai.analyzing') : t('ai.analyze')}
                </Button>
                {toneResult && (
                  <Card className="p-4 bg-muted/40">
                    <pre className="whitespace-pre-wrap text-sm">{toneResult}</pre>
                  </Card>
                )}
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
