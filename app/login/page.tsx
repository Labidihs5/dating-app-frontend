'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';

const orbitSlots = [
  { top: '6%', left: '50%' },
  { top: '24%', left: '85%' },
  { top: '64%', left: '85%' },
  { top: '82%', left: '50%' },
  { top: '64%', left: '15%' },
  { top: '24%', left: '15%' },
];

const orbitAvatars = [
  '/placeholder-user.jpg',
  '/placeholder.jpg',
  '/placeholder-logo.png',
  '/placeholder-logo.svg',
  '/placeholder.svg',
  '/placeholder-user.jpg',
];

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-10">
      <div className="pointer-events-none absolute -left-10 top-4 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4">
        <div className="glass-panel rounded-[28px] p-8 md:p-10 shadow-[0_20px_60px_rgba(139,92,246,0.18)]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-4 w-4" />
            <span>{t('discover.title')}</span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground">
            Let&apos;s meet now people around you
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Build real connections with meaningful, elegant discovery.
          </p>

          <div className="relative mt-8 flex items-center justify-center">
            <div className="relative h-72 w-72 rounded-full bg-white/70 ring-8 ring-white/60 ring-offset-[14px] ring-offset-transparent shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-6 rounded-full border border-white/70 bg-gradient-to-br from-white/80 via-white/30 to-white/5 backdrop-blur-xl" />
              <div className="absolute inset-14 rounded-full bg-gradient-to-br from-primary/15 via-accent/12 to-transparent" />
              <div className="absolute inset-10 overflow-hidden rounded-full ring-4 ring-white/70 shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
                <img
                  src="/placeholder-user.jpg"
                  alt="Primary"
                  className="h-full w-full object-cover"
                />
              </div>
              {orbitAvatars.map((avatar, idx) => {
                const slot = orbitSlots[idx % orbitSlots.length];
                return (
                  <div
                    key={`${avatar}-${idx}`}
                    className="absolute size-12 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white bg-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                    style={{ top: slot.top, left: slot.left }}
                  >
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 rounded-full bg-white/90 text-foreground shadow-[0_12px_30px_rgba(111,72,220,0.18)] hover:bg-white"
            >
              <span className="text-lg font-bold text-primary">G</span>
              <span className="font-semibold text-foreground">Continue with Google</span>
            </Button>
            <Button className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-[0_12px_30px_rgba(236,72,153,0.3)] hover:brightness-105">
              <span className="text-lg font-bold">f</span>
              <span className="font-semibold">Continue with Facebook</span>
            </Button>
            <p className="text-center text-sm text-muted-foreground">Don&apos;t have an account? sign up</p>
          </div>
        </div>
      </div>
    </div>
  );
}
