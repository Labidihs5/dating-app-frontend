'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, MessageCircle, Users, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { NotificationToast } from '@/components/notifications/NotificationToast';
import { useNotifications } from '@/hooks/useNotifications';
import { getTelegramUser } from '@/lib/telegram-utils';
import { userAPI } from '@/lib/api-services';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const { notifications, unreadCount, toasts, markAsRead, markAllAsRead, removeToast } = useNotifications(userId);
  
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
    { href: '/', label: 'Discover', icon: Zap },
    { href: '/likes', label: 'Likes', icon: Heart },
    { href: '/matches', label: 'Matches', icon: Users },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
    { href: '/gold', label: 'Gold', icon: Star },
  ];

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-start gap-4">
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
        <div className="space-y-2">
          {toasts.map(toast => (
            <NotificationToast
              key={toast.id}
              id={toast.id}
              title={toast.title}
              message={toast.message}
              type={toast.type as 'match' | 'message' | 'like'}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:left-0 md:right-auto md:top-0 md:bottom-auto md:w-20 md:border-r md:border-t-0">
        <div className="flex justify-around md:flex-col md:h-screen md:items-center md:justify-start md:pt-8 md:gap-4">
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
