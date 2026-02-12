import { ReactNode } from 'react';
import { gradients } from '@/src/ui/tokens';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export function AppShellBackground({ children }: { children: ReactNode }) {
  return (
    <div
      className={`min-h-screen w-full ${inter.className}`}
      style={{
        background: gradients.bg,
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        paddingBottom: 'calc(96px + env(safe-area-inset-bottom))',
      }}
    >
      {children}
    </div>
  );
}
