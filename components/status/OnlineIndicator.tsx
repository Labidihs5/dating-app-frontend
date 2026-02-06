'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface OnlineIndicatorProps {
  isOnline: boolean;
  lastSeen?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function OnlineIndicator({ isOnline, lastSeen, size = 'md' }: OnlineIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="w-2 h-2 rounded-full bg-gray-400"></span>;
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const getLastSeenText = () => {
    if (!lastSeen) return '';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return t('status.justNow');
    if (diffMins < 60) return t('status.minutesAgo', { count: diffMins });
    if (diffMins < 1440) return t('status.hoursAgo', { count: Math.floor(diffMins / 60) });
    return t('status.daysAgo', { count: Math.floor(diffMins / 1440) });
  };

  return (
    <div className="flex items-center gap-1">
      <span 
        className={`${sizeClasses[size]} rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
        title={isOnline ? t('status.online') : t('status.lastSeen', { time: getLastSeenText() })}
      ></span>
      {isOnline ? (
        <span className="text-xs text-green-600 font-medium">{t('status.online')}</span>
      ) : lastSeen ? (
        <span className="text-xs text-muted-foreground">
          {getLastSeenText()}
        </span>
      ) : null}
    </div>
  );
}
