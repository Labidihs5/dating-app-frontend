'use client';

interface OnlineIndicatorProps {
  isOnline: boolean;
  lastSeen?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function OnlineIndicator({ isOnline, lastSeen, size = 'md' }: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const getLastSeenText = () => {
    if (!lastSeen) return '';
    const now = new Date().getTime();
    const lastSeenTime = new Date(lastSeen).getTime();
    const diff = now - lastSeenTime;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className={`${sizeClasses[size]} rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      {!isOnline && lastSeen && (
        <span className="text-xs text-muted-foreground">{getLastSeenText()}</span>
      )}
    </div>
  );
}
