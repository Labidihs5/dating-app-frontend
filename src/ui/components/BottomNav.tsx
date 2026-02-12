import Link from 'next/link';
import { Home, Compass, Users, MessageCircle, User } from 'lucide-react';
import { colors } from '@/src/ui/tokens';

const tabs = [
  { href: '/', label: 'Swipe', icon: Home },
  { href: '/likes', label: 'Explore', icon: Compass },
  { href: '/matches', label: 'Matches', icon: Users },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 h-[76px] px-20 pb-[calc(env(safe-area-inset-bottom))]"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(14px)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        boxShadow: '0 -8px 24px rgba(59,20,92,0.12)',
      }}
    >
      <div className="h-full flex items-center justify-between">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-col items-center gap-2 text-[11px] font-medium"
            style={{ color: colors.violet }}
          >
            <tab.icon size={18} />
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
