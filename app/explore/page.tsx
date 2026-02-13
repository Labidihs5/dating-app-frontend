'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileGuard } from '@/components/auth/ProfileGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function ExplorePage() {
  const { t } = useI18n();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id.toString());
      loadProfiles(user.id.toString());
    } else {
      setLoading(false);
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

  const previewProfiles = profiles.slice(0, 9);

  return (
    <ProfileGuard requireProfile={true}>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden pb-28 pt-8">
        <div className="pointer-events-none absolute -left-10 top-4 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Explore</p>
              <h1 className="text-4xl font-semibold leading-tight text-foreground">Pick your partner</h1>
              <p className="text-sm text-muted-foreground">Discover stories, trips, and new vibes near you.</p>
            </div>
            <Button asChild className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
              <Link href="/">Start Swiping</Link>
            </Button>
          </div>

          <div className="mt-6 glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[22px] px-4 py-4">
            <div className="flex items-center -space-x-3">
              {previewProfiles.slice(0, 4).map((profile, idx) => {
                const avatar = profile.photos?.[profile.profilePhotoIndex || 0] || profile.photos?.[0];
                return (
                  <div
                    key={profile.id ?? idx}
                    className="size-12 overflow-hidden rounded-full border-2 border-white bg-white/90 shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                  >
                    <img
                      src={avatar ? `/api/photos?path=${encodeURIComponent(avatar)}` : '/placeholder-user.jpg'}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                );
              })}
              {previewProfiles.length > 4 && (
                <div className="flex size-12 items-center justify-center rounded-full border border-white/80 bg-white/70 text-xs font-semibold text-primary shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
                  +{previewProfiles.length - 4}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['Your friends', 'Trips', 'Luv', 'Nearby'].map((chip) => (
                <span
                  key={chip}
                  className="gradient-chip px-3 py-2 text-xs font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <Card className="glass-panel w-full p-10 text-center">
                <p className="text-muted-foreground">{t('discover.loadingProfiles')}</p>
              </Card>
            ) : previewProfiles.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {previewProfiles.map((profile) => {
                  const mainPhoto = profile.photos?.[profile.profilePhotoIndex || 0] || profile.photos?.[0];
                  return (
                    <Card
                      key={profile.id}
                      className="glass-panel group overflow-hidden rounded-[26px] border-white/70 p-3 transition-transform hover:-translate-y-1"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
                        <img
                          src={mainPhoto ? `/api/photos?path=${encodeURIComponent(mainPhoto)}` : '/placeholder-user.jpg'}
                          alt={profile.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-base font-semibold">{profile.name}, {profile.age}</p>
                          {profile.distance !== undefined && (
                            <p className="text-xs text-white/80">~{Math.round(profile.distance)}km</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="gradient-chip px-3 py-1 text-xs">
                          {profile.gender}
                        </Badge>
                        <Badge variant="outline" className="border-white/60 bg-white/60 px-3 py-1 text-xs text-foreground">
                          New
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="glass-panel w-full p-10 text-center">
                <p className="text-muted-foreground">{t('discover.noProfilesBody')}</p>
                <div className="mt-4">
                  <Button
                    onClick={() => userId && loadProfiles(userId)}
                    className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                  >
                    {t('common.refreshProfiles')}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProfileGuard>
  );
}
