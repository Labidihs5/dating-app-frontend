'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationToastProps {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'message' | 'like';
  onClose: (id: string) => void;
}

export function NotificationToast({ id, title, message, type, onClose }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = type === 'match' ? 'bg-accent' : type === 'message' ? 'bg-primary' : 'bg-secondary';

  return (
    <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg flex items-start gap-3 min-w-[300px] animate-in slide-in-from-right`}>
      <div className="flex-1">
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button onClick={() => onClose(id)} className="text-white/80 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
