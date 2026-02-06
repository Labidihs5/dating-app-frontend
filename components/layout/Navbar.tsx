'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, MessageCircle, Users, Zap, Star, Gamepad2, MessagesSquare, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useNotifications } from '@/hooks/useNotifications';
import { getTelegramUser } from '@/lib/telegram-utils';
import { userAPI } from '@/lib/api-services';
import { useI18n } from '@/components/i18n/LanguageProvider';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, dir } = useI18n();
  const [userId, setUserId] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  useOnlineStatus(userId);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id);
      loadUserPhoto(user.id);
    }
  }, []);
  
  const loadUserPhoto = async (id: string) => {
    try {
      const data = await userAPI.getProfile(id);
      if (data?.photos?.[data.profilePhotoIndex || 0]) {
        setUserPhoto(data.photos[data.profilePhotoIndex || 0]);
      }
    } catch (error) {
      console.error('Error loading user photo:', error);
    }
  };

  const navItems = [
    { href: '/', label: t('nav.discover'), icon: Zap },
    { href: '/likes', label: t('nav.likes'), icon: Heart },
    { href: '/matches', label: t('nav.matches'), icon: Users },
    { href: '/chat', label: t('nav.chat'), icon: MessageCircle },
    { href: '/gold', label: t('nav.gold'), icon: Star },
    { href: '/games', label: t('nav.games'), icon: Gamepad2 },
    { href: '/rooms', label: t('nav.rooms'), icon: MessagesSquare },
    { href: '/challenges', label: t('nav.challenges'), icon: Flag },
  ];

  return (
    <>
      <div className={`fixed top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} z-50 flex items-start gap-4`}>
        <button
          onClick={() => router.push('/settings')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary hover:border-accent transition-colors bg-muted flex items-center justify-center"
        >
          {userPhoto ? (
            <img
              src={`/api/photos?path=${encodeURIComponent(userPhoto)}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold">{userId?.[0]?.toUpperCase()}</span>
          )}
        </button>
        <div className="block">
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:left-0 md:right-auto md:top-0 md:bottom-auto md:w-20 md:border-r md:border-t-0">
        <div className="flex justify-around gap-2 overflow-x-auto px-2 py-2 md:flex-col md:h-screen md:items-center md:justify-start md:pt-8 md:gap-4 md:overflow-visible md:px-0 md:py-0">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-200 md:w-16 md:h-16',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              title={label}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
    </nav>
    </>
  );
}
