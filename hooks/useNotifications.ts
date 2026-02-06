'use client';

import { useEffect, useRef, useState } from 'react';
import { getTelegramUser } from '@/lib/telegram-utils';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface Notification {
  id: string;
  type: 'match' | 'message' | 'like';
  title: string;
  message: string;
  data?: any;
  createdAt: string;
}

export function useNotifications() {
  const { t, dir } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const notificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id);
      // Poll for notifications every 5 seconds
      const interval = setInterval(() => {
        checkNotifications(user.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const checkNotifications = async (currentUserId: string) => {
    try {
      console.log('🔔 Checking notifications for:', currentUserId);
      const response = await fetch(`/api/notifications/${currentUserId}`);
      const data = await response.json();
      console.log('🔔 Notifications fetched:', data);
      
      // Show toast for new notifications
      data.forEach((notification: Notification) => {
        if (!notificationsRef.current.find(n => n.id === notification.id)) {
          console.log('🔔 New notification toast:', notification.id);
          showNotificationToast(notification);
        }
      });
      
      setNotifications(data);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const showNotificationToast = (notification: Notification) => {
    let title = '';
    let message = '';
    let emoji = '';

    switch (notification.type) {
      case 'match':
        emoji = '💕';
        title = t('notifications.toast.matchTitle');
        message = t('notifications.toast.matchBody', {
          name: notification.data?.userName || t('notifications.toast.someone'),
        });
        break;
      case 'message':
        emoji = '💬';
        title = t('notifications.toast.messageTitle');
        message = t('notifications.toast.messageBody', {
          name: notification.data?.senderName || t('notifications.toast.someone'),
          preview: notification.data?.messagePreview || t('notifications.toast.newMessage'),
        });
        break;
      case 'like':
        emoji = '❤️';
        title = t('notifications.toast.likeTitle');
        message = t('notifications.toast.likeBody', {
          name: notification.data?.likerName || t('notifications.toast.someone'),
        });
        break;
    }

    // Create toast element
    const toast = document.createElement('div');
    const sideClass = dir === 'rtl' ? 'left-4' : 'right-4';
    const slideClass = dir === 'rtl' ? 'slide-in-from-left' : 'slide-in-from-right';
    toast.className = `fixed top-4 ${sideClass} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 animate-in fade-in ${slideClass} max-w-sm`;
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-2xl">${emoji}</div>
        <div class="flex-1">
          <h4 class="font-bold text-gray-900 dark:text-white">${title}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${message}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);

    // Add click to remove
    toast.addEventListener('click', () => {
      toast.remove();
    });
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const markAllAsRead = async () => {
    const ids = notificationsRef.current.map(n => n.id);
    try {
      await Promise.all(ids.map(id => fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setNotifications([]);
    }
  };

  return { notifications, unreadCount: notifications.length, markAsRead, markAllAsRead };
}
