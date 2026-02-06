'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trash2, Sparkles, Grid3x3, List } from 'lucide-react';
import { matchesAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';
import { OnlineIndicator } from '@/components/status/OnlineIndicator';
import confetti from 'canvas-confetti';
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
    senderId: string;
  };
  createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

export default function MatchesPage() {
  const router = useRouter();
  const { t, language } = useI18n();
  const formatNumber = (value: number) => value.toLocaleString(language);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [unmatchConfirm, setUnmatchConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const user = getTelegramUser();
      if (user) {
        setUserId(user.id.toString());
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadMatches();
    }
  }, [userId]);

  const loadMatches = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await matchesAPI.getMatches(userId);
      
      // Check for new matches (created in last 10 seconds)
      const now = new Date().getTime();
      const newMatches = data.filter((m: Match) => {
        const matchTime = new Date(m.createdAt).getTime();
        return now - matchTime < 10000;
      });
      
      if (newMatches.length > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!userId) return;
    loadMatches();
    const interval = setInterval(loadMatches, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleUnmatch = async (matchId: string) => {
    if (unmatchConfirm !== matchId) {
      setUnmatchConfirm(matchId);
      return;
    }
    
    try {
      await matchesAPI.unmatch(matchId);
      setMatches(matches.filter(match => match.id !== matchId));
      setUnmatchConfirm(null);
    } catch (error) {
      console.error('Error unmatching:', error);
    }
  };

  const handleOpenChat = (matchId: string, name: string) => {
    router.push(`/chat?matchId=${matchId}&name=${name}`);
  };

  const getLastMessage = (match: Match) => {
    return match.lastMessage || null;
  };
  
  const isNewMatch = (createdAt: string) => {
    const matchTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    return now - matchTime < 86400000; // 24 hours
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">{t('matches.loading')}</p>
              </Card>
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-accent fill-accent" />
                  <div>
                    <h1 className="text-3xl font-bold">{t('matches.title')}</h1>
                    <p className="text-muted-foreground">{t('matches.connections', { count: formatNumber(matches.length) })}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Matches Grid */}
            {loading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">{t('matches.loading')}</p>
              </Card>
            ) : matches.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                {matches.map(match => {
                  const matchedUser = match.user;
                  const lastMessage = getLastMessage(match);
                  if (!matchedUser) return null;
                  
                  return (
                    <Card
                      key={match.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group relative animate-in fade-in slide-in-from-bottom-4"
                    >
                      {isNewMatch(match.createdAt) && (
                        <Badge className="absolute top-2 left-2 z-10 bg-accent text-white animate-pulse">
                          {t('matches.newMatch')}
                        </Badge>
                      )}
                      
                      {/* Image Section */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={matchedUser.photos && Array.isArray(matchedUser.photos) && matchedUser.photos[matchedUser.profilePhotoIndex || 0] ? `/api/photos?path=${encodeURIComponent(matchedUser.photos[matchedUser.profilePhotoIndex || 0])}` : "/placeholder.svg"}
                          alt={matchedUser.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {unmatchConfirm === match.id ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-white text-sm font-bold">{t('matches.confirmUnmatch')}</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => { e.stopPropagation(); handleUnmatch(match.id); }}
                                  className="bg-destructive/90 text-white hover:bg-destructive border-0"
                                >
                                  {t('common.yes')}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => { e.stopPropagation(); setUnmatchConfirm(null); }}
                                  className="bg-white/90 text-black hover:bg-white border-0"
                                >
                                  {t('common.no')}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); handleUnmatch(match.id); }}
                              className="bg-destructive/90 text-destructive-foreground hover:bg-destructive border-0"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t('matches.unmatch')}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{matchedUser.name}, {matchedUser.age}</h3>
                            <OnlineIndicator isOnline={matchedUser.isOnline || false} lastSeen={matchedUser.lastSeen} size="sm" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(match.createdAt).toLocaleDateString(language)}
                          </span>
                        </div>

                        {lastMessage && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm text-foreground line-clamp-2 font-medium">
                              {lastMessage.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(lastMessage.timestamp).toLocaleString(language)}
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={() => handleOpenChat(match.id, matchedUser.name)}
                          className="w-full bg-primary hover:bg-primary/90 hover:scale-105 transition-transform"
                        >
                          {t('matches.message')}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-xl font-bold mb-2">{t('matches.emptyTitle')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('matches.emptyBody')}
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-primary hover:bg-primary/90"
                >
                  {t('matches.startSwiping')}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  );
}
