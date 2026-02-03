'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getTelegramUser } from '@/lib/telegram-utils';
import { userAPI } from '@/lib/api-services';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio?: string;
  photos: string[];
}

export function useProfileAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        setIsLoading(true);
        const user = getTelegramUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const userProfile = await userAPI.getProfile(user.id.toString());
        
        if (userProfile) {
          setProfile(userProfile);
        } else if (pathname !== '/profile') {
          router.push('/profile');
        }
      } catch (err) {
        if (pathname !== '/profile') {
          router.push('/profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [pathname, router]);

  return {
    profile,
    isLoading,
    isProfileComplete: profile !== null,
  };
}
