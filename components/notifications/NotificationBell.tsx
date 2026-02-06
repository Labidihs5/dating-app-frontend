'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  data?: any;
}

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationBell({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead }: NotificationBellProps) {
  const [showPanel, setShowPanel] = useState(false);
  const router = useRouter();
  const { t, language, dir } = useI18n();

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead) {
      onMarkAsRead(notif.id);
    }
    
    if (notif.type === 'message' && notif.data?.matchId) {
      // Fetch match details to get the sender's name
      try {
        const response = await fetch(`/api/matches/${notif.data.matchId}`);
        const match = await response.json();
        const senderName = match.user1?.name || match.user2?.name || t('common.user');
        router.push(`/chat/${notif.data.matchId}?name=${encodeURIComponent(senderName)}`);
      } catch (error) {
        router.push(`/chat/${notif.data.matchId}`);
      }
    } else if (notif.type === 'match') {
      router.push('/matches');
    } else if (notif.type === 'like') {
      router.push('/likes');
    }
    
    setShowPanel(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-muted rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPanel(false)} />
          <Card className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} top-12 w-80 max-h-96 overflow-y-auto z-50 p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{t('notifications.title')}</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                  {t('notifications.markAllRead')}
                </Button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('notifications.empty')}</p>
            ) : (
              <div className="space-y-2">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notif.isRead ? 'bg-muted/50' : 'bg-primary/10 hover:bg-primary/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{notif.title}</h4>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notif.createdAt).toLocaleString(language)}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
