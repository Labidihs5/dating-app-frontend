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
      <div className={`fixed top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} z-50 flex items-center gap-3`}>
        <div className="glass-panel rounded-full px-3 py-2 flex items-center gap-2 border-white/70 shadow-[0_14px_40px_rgba(139,92,246,0.22)] backdrop-blur-xl">
          <button
            onClick={() => router.push('/settings')}
            className="w-11 h-11 rounded-full overflow-hidden border border-white/70 bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center transition-transform hover:-translate-y-0.5"
          >
            {userPhoto ? (
              <img
                src={`/api/photos?path=${encodeURIComponent(userPhoto)}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-semibold text-primary">{userId?.[0]?.toUpperCase()}</span>
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
      </div>

      <nav className="fixed inset-x-0 bottom-4 z-40 md:bottom-auto md:top-8 md:left-6 md:right-auto md:w-20">
        <div className="flex justify-center md:justify-start">
          <div className="neon-pill flex justify-between gap-2 px-4 py-3 w-[92%] max-w-xl md:w-20 md:flex-col md:items-center md:gap-4 md:px-3 md:py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center rounded-full transition-all duration-200 md:w-12 md:h-12 w-12 h-12',
                isActive
                  ? 'bg-white/90 text-primary shadow-[0_10px_25px_rgba(139,92,246,0.35)] border border-white/80'
                  : 'bg-white/45 text-foreground/60 border border-white/60 hover:text-foreground hover:-translate-y-0.5'
              )}
              title={label}
            >
              <Icon className="w-5 h-5" />
              <span className="sr-only md:not-sr-only md:text-[11px] md:font-semibold">{label}</span>
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
    </>
  );
}
