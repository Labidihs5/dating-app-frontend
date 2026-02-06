'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { MessageCircle, Sparkles } from 'lucide-react';
import { matchesAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';
import { OnlineIndicator } from '@/components/status/OnlineIndicator';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface Match {
  id: string;
  user: {
    id: string;
    name: string;
    age: number;
    photos: string[];
    profilePhotoIndex?: number;
    isOnline?: boolean;
    lastSeen?: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

export default function ChatPage() {
  const router = useRouter();
  const { t, language } = useI18n();
  const formatNumber = (value: number) => value.toLocaleString(language);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id);
      loadMatches(user.id);
    } else {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => loadMatches(userId), 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadMatches = async (currentUserId: string) => {
    try {
      setLoading(true);
      const data = await matchesAPI.getMatches(currentUserId);
      setMatches(data || []);
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (matchId: string, userName: string) => {
    router.push(`/chat/${matchId}?name=${userName}`);
  };

  const aiProfileCard = (
    <Card
      className="p-4 hover:bg-muted cursor-pointer transition-colors"
      onClick={() => router.push('/chat/ai')}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg">{t('chat.aiProfileTitle')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('chat.aiProfileBody')}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{t('chat.aiProfileCta')}</p>
      </div>
    </Card>
  );

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8 pb-20 md:pl-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('chat.title')}</h1>
              <p className="text-muted-foreground">{t('chat.conversations', { count: formatNumber(matches?.length || 0) })}</p>
            </div>

            {loading ? (
              <div className="space-y-2">
                {aiProfileCard}
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">{t('chat.loading')}</p>
                </Card>
              </div>
            ) : matches && matches.length > 0 ? (
              <div className="space-y-2">
                {aiProfileCard}
                {matches.map(match => (
                  <Card
                    key={match.id}
                    className="p-4 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleOpenChat(match.id, match.user.name)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {match.user.photos?.[match.user.profilePhotoIndex || 0] ? (
                          <img
                            src={`/api/photos?path=${encodeURIComponent(match.user.photos[match.user.profilePhotoIndex || 0])}`}
                            alt={match.user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold">${match.user.name[0]}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-2xl font-bold">{match.user.name[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{match.user.name}, {match.user.age}</h3>
                          <OnlineIndicator isOnline={match.user.isOnline || false} lastSeen={match.user.lastSeen} size="sm" />
                        </div>
                        {match.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {match.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {match.lastMessage && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(match.lastMessage.timestamp).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {aiProfileCard}
                <Card className="p-12 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h2 className="text-xl font-bold mb-2">{t('chat.emptyTitle')}</h2>
                  <p className="text-muted-foreground">{t('chat.emptyBody')}</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  );
}
