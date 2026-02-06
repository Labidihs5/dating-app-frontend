'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileGuard } from '@/components/auth/ProfileGuard';
import { SwipeCard } from '@/components/cards/SwipeCard';
import { DistanceSlider } from '@/components/location/DistanceSlider';
import { DistanceBadge } from '@/components/location/DistanceBadge';
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

    // Remove profile from list
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

    // Remove profile from list
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

    // Remove profile from list
    setProfiles(profiles.filter((_, idx) => idx !== currentIndex));
  };

  return (
    <ProfileGuard requireProfile={true}>
      <Navbar />
      <div className="min-h-screen pt-6 pb-20 md:pl-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('discover.title')}</h1>
            <p className="text-muted-foreground">{t('discover.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDistanceFilter(!showDistanceFilter)}
              className="flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              {t('discover.filter')}
            </Button>
            {!isPremium && (
              <Badge variant="outline" className="text-base px-3 py-1">
                {t('discover.swipesLeft', { count: formatNumber(swipesLeft) })}
              </Badge>
            )}
            {isPremium && (
              <Badge className="bg-primary text-primary-foreground text-base px-3 py-1">
                ⭐ {t('common.unlimited')}
              </Badge>
            )}
          </div>
        </div>

        {/* Distance Filter Panel */}
        {showDistanceFilter && (
          <Card className="p-6 mb-6 animate-in fade-in slide-in-from-top-2">
            <DistanceSlider
              initialDistance={maxDistance}
              isPremium={isPremium}
              onChange={setMaxDistance}
              showLabel={true}
            />
          </Card>
        )}

        {/* Swipe Container */}
        <div className="max-w-4xl mx-auto px-4 h-[600px] flex items-center justify-center">
          {loading ? (
            <Card className="w-full p-12 text-center">
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
            <Card className="w-full p-12 text-center bg-gradient-to-br from-muted to-muted/50">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-bold mb-2">{t('discover.noProfilesTitle')}</h2>
              <p className="text-muted-foreground mb-6">{t('discover.noProfilesBody')}</p>
              <Button onClick={() => userId && loadProfiles(userId)}>
                {t('common.refreshProfiles')}
              </Button>
            </Card>
          )}
        </div>

        {/* Swipe Limit Modal */}
          {showSwipeLimitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-sm p-8 animate-in fade-in zoom-in-95">
                <h2 className="text-2xl font-bold mb-4">{t('discover.limitReachedTitle')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('discover.limitReachedBody')}
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={() => {
                      setSwipesLeft(20);
                      setShowSwipeLimitModal(false);
                    }}
                  >
                    {t('discover.watchAd')}
                  </Button>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setIsPremium(true);
                      setShowSwipeLimitModal(false);
                    }}
                  >
                    {t('common.upgradeToGold')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
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
