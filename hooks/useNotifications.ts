'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const lastCheckRef = useRef<Date>(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0;
      
      audioRef.current = {
        play: () => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = 800;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          osc.start(audioContext.currentTime);
          osc.stop(audioContext.currentTime + 0.3);
          return Promise.resolve();
        }
      } as any;
    }
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const vibrate = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/notifications/${userId}`);
      const data = await response.json();
      
      const newNotifications = data.filter((n: Notification) => 
        new Date(n.createdAt) > lastCheckRef.current && !n.isRead && !seenIdsRef.current.has(n.id)
      );

      if (newNotifications.length > 0) {
        playSound();
        vibrate();
        newNotifications.forEach((n: Notification) => seenIdsRef.current.add(n.id));
        setToasts(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const uniqueNew = newNotifications.filter((n: Notification) => !existingIds.has(n.id));
          return [...prev, ...uniqueNew];
        });
      }

      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, [userId, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await fetch(`/api/notifications/user/${userId}/read-all`, { method: 'PUT' });
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    notifications,
    unreadCount,
    toasts,
    markAsRead,
    markAllAsRead,
    removeToast
  };
}
