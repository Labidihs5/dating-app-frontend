'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileGuard } from '@/components/auth/ProfileGuard';
import { SwipeCard } from '@/components/cards/SwipeCard';
import { DistanceSlider } from '@/components/location/DistanceSlider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Sliders } from 'lucide-react';
import { discoveryAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface Profile {
  id: string;
  name: string;
  age: number;
  distance?: number;
  photos: string[];
  bio?: string;
  gender: string;
  preferences?: any;
  profilePhotoIndex?: number;
}

export default function Home() {
  const { t, language } = useI18n();
  const formatNumber = (value: number) => value.toLocaleString(language);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipesLeft, setSwipesLeft] = useState(20);
  const [isPremium, setIsPremium] = useState(false);
  const [showSwipeLimitModal, setShowSwipeLimitModal] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id.toString());
      loadProfiles(user.id.toString());
    }
  }, []);

  const loadProfiles = async (currentUserId: string) => {
    try {
      setLoading(true);
      const data = await discoveryAPI.getProfiles({ userId: currentUserId });
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleSwipeLeft = async () => {
    if (!isPremium && swipesLeft <= 0) {
      setShowSwipeLimitModal(true);
      return;
    }

    if (!isPremium) {
      setSwipesLeft(swipesLeft - 1);
    }

    try {
      await discoveryAPI.pass(currentProfile.id);
    } catch (error) {
      console.error('Error passing profile:', error);
    }

    setProfiles(profiles.filter((_, idx) => idx !== currentIndex));
  };

  const handleSwipeRight = async () => {
    if (!isPremium && swipesLeft <= 0) {
      setShowSwipeLimitModal(true);
      return;
    }

    if (!isPremium) {
      setSwipesLeft(swipesLeft - 1);
    }

    try {
      if (userId) {
        const result = await discoveryAPI.like(currentProfile.id, userId);
        if (result.isMatch) {
          alert(t('discover.matchAlert', { name: currentProfile.name }));
        }
      }
    } catch (error) {
      console.error('Error liking profile:', error);
    }

    setProfiles(profiles.filter((_, idx) => idx !== currentIndex));
  };

  const handleSuperLike = async () => {
    if (!isPremium && swipesLeft <= 2) {
      setShowSwipeLimitModal(true);
      return;
    }

    if (!isPremium) {
      setSwipesLeft(swipesLeft - 2);
    }

    try {
      await discoveryAPI.superLike(currentProfile.id);
    } catch (error) {
      console.error('Error super liking profile:', error);
    }

    setProfiles(profiles.filter((_, idx) => idx !== currentIndex));
  };

  return (
    <ProfileGuard requireProfile={true}>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden pb-28 pt-8">
        <div className="pointer-events-none absolute -left-10 top-4 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-primary">Swipe</p>
                <h1 className="text-4xl font-semibold leading-tight text-foreground">{t('discover.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('discover.subtitle')}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDistanceFilter(!showDistanceFilter)}
                  className="neon-pill px-4 py-2 text-sm"
                >
                  <Sliders className="h-4 w-4" />
                  {t('discover.filter')}
                </Button>
                {!isPremium && (
                  <Badge variant="outline" className="gradient-chip px-3 py-2 text-xs">
                    {t('discover.swipesLeft', { count: formatNumber(swipesLeft) })}
                  </Badge>
                )}
                {isPremium && (
                  <Badge className="gradient-chip px-3 py-2 text-xs">
                    ⭐ {t('common.unlimited')}
                  </Badge>
                )}
              </div>
            </div>

            {showDistanceFilter && (
              <Card className="glass-panel rounded-[22px] border-white/70 p-5">
                <DistanceSlider
                  initialDistance={maxDistance}
                  isPremium={isPremium}
                  onChange={setMaxDistance}
                  showLabel={true}
                />
              </Card>
            )}

            <div className="glass-strong relative overflow-hidden rounded-[30px] border border-white/75 p-4 md:p-6">
              <div className="absolute -left-10 top-4 h-40 w-40 bg-primary/20 blur-3xl" />
              <div className="absolute right-0 bottom-0 h-48 w-48 bg-accent/25 blur-[90px]" />

              <div className="relative flex h-[560px] items-center justify-center">
                {loading ? (
                  <Card className="glass-panel w-full h-full flex items-center justify-center text-center border-none shadow-none">
                    <p className="text-muted-foreground">{t('discover.loadingProfiles')}</p>
                  </Card>
                ) : currentProfile ? (
                  <SwipeCard
                    profile={currentProfile}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSuperLike={handleSuperLike}
                  />
                ) : (
                  <Card className="glass-panel w-full h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-white/50 to-white/20 border-white/70">
                    <AlertCircle className="mb-4 h-12 w-12 text-primary" />
                    <h2 className="mb-2 text-xl font-semibold">{t('discover.noProfilesTitle')}</h2>
                    <p className="mb-6 max-w-sm text-muted-foreground">{t('discover.noProfilesBody')}</p>
                    <Button
                      onClick={() => userId && loadProfiles(userId)}
                      className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                    >
                      {t('common.refreshProfiles')}
                    </Button>
                  </Card>
                )}
              </div>

              {!loading && currentProfile && (
                <div className="mt-6">
                  <DistanceSlider
                    initialDistance={maxDistance}
                    isPremium={isPremium}
                    onChange={setMaxDistance}
                    showLabel={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {showSwipeLimitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <Card className="glass-strong w-full max-w-sm rounded-3xl border-white/70 p-8">
              <h2 className="mb-4 text-2xl font-semibold">{t('discover.limitReachedTitle')}</h2>
              <p className="mb-6 text-muted-foreground">{t('discover.limitReachedBody')}</p>
              <div className="space-y-3">
                <Button
                  className="w-full rounded-full bg-accent hover:bg-accent/90"
                  onClick={() => {
                    setSwipesLeft(20);
                    setShowSwipeLimitModal(false);
                  }}
                >
                  {t('discover.watchAd')}
                </Button>
                <Button
                  className="w-full rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setIsPremium(true);
                    setShowSwipeLimitModal(false);
                  }}
                >
                  {t('common.upgradeToGold')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-transparent"
                  onClick={() => setShowSwipeLimitModal(false)}
                >
                  {t('common.close')}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ProfileGuard>
  );
}
