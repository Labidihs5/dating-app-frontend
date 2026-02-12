'use client';

import React from "react"

import { useState, useRef, useCallback } from 'react';
import { ProfileCard } from './ProfileCard';
import { DistanceBadge } from '@/components/location/DistanceBadge';
import { Button } from '@/components/ui/button';
import { Heart, X, Zap } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface Profile {
  id: string;
  name: string;
  age: number;
  distance?: number;
  photos: string[];
  bio?: string;
  gender: string;
  preferences?: any;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  isLoading?: boolean;
}

export function SwipeCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  isLoading = false,
}: SwipeCardProps) {
  const { t } = useI18n();
  // Use refs to avoid excessive re-renders
  const dragStateRef = useRef({ x: 0, y: 0, rotation: 0 });
  const startPosRef = useRef({ x: 0, y: 0, time: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotation: 0 });
  const [isAnimatingSwipe, setIsAnimatingSwipe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeDetectedRef = useRef(false);
  const swipeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get position from mouse or touch event
  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isLoading || swipeDetectedRef.current) return;
    
    // Prevent text selection on drag
    if ('touches' in e) {
      e.preventDefault();
    }

    setIsDragging(true);
    const pos = getPosition(e);
    startPosRef.current = { x: pos.x, y: pos.y, time: Date.now() };
  }, [isLoading]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current || isAnimatingSwipe) return;

    const pos = getPosition(e);
    const rect = containerRef.current.getBoundingClientRect();

    // Calculate position relative to card center
    const rawX = pos.x - rect.left - rect.width / 2;
    const rawY = pos.y - rect.top - rect.height / 2;

    // Dampen movement so the card follows the finger more softly
    const x = rawX * 0.7;
    const y = rawY * 0.6;

    // Clamp values to prevent extreme movements
    const clampedX = Math.max(-rect.width * 0.6, Math.min(rect.width * 0.6, x));
    const clampedY = Math.max(-rect.height * 0.3, Math.min(rect.height * 0.3, y));

    // Calculate rotation (max ±15 degrees)
    const rotation = Math.max(-15, Math.min(15, (clampedX / rect.width) * 20));

    // Update ref to avoid excessive re-renders
    dragStateRef.current = { x: clampedX, y: clampedY, rotation };

    // Only update state every 16ms (~60fps) for smooth performance
    setTransform({ x: clampedX, y: clampedY, rotation });
  }, [isDragging]);

  const triggerSwipe = useCallback((direction: 'left' | 'right') => {
    if (!containerRef.current || swipeDetectedRef.current) return;

    swipeDetectedRef.current = true;
    setIsDragging(false);
    setIsAnimatingSwipe(true);

    const rect = containerRef.current.getBoundingClientRect();
    const offscreenX = direction === 'left' ? -rect.width * 1.4 : rect.width * 1.4;
    const rotation = direction === 'left' ? -20 : 20;

    setTransform({ x: offscreenX, y: dragStateRef.current.y, rotation });

    const onSwipe = direction === 'left' ? onSwipeLeft : onSwipeRight;
    if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    swipeTimeoutRef.current = setTimeout(() => {
      onSwipe();
    }, 260);

    resetTimeoutRef.current = setTimeout(() => {
      setTransform({ x: 0, y: 0, rotation: 0 });
      dragStateRef.current = { x: 0, y: 0, rotation: 0 };
      swipeDetectedRef.current = false;
      setIsAnimatingSwipe(false);
    }, 420);
  }, [onSwipeLeft, onSwipeRight]);

  React.useEffect(() => {
    return () => {
      if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleEnd = useCallback(() => {
    setIsDragging(false);

    if (!containerRef.current || swipeDetectedRef.current || isAnimatingSwipe) {
      setTransform({ x: 0, y: 0, rotation: 0 });
      dragStateRef.current = { x: 0, y: 0, rotation: 0 };
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const dragDistance = dragStateRef.current.x;
    const timeDelta = Date.now() - startPosRef.current.time;

    // Calculate velocity for better swipe detection
    const velocity = Math.abs(dragDistance) / (timeDelta / 1000);
    const minDistance = rect.width * 0.2; // 20% for quick swipe
    const threshold = rect.width * 0.3; // 30% threshold

    // Detect swipe: either crosses threshold or has velocity + distance
    const isQuickSwipeRight = dragDistance > minDistance && velocity > 300;
    const isQuickSwipeLeft = dragDistance < -minDistance && velocity > 300;
    const isSlowSwipeRight = dragDistance > threshold;
    const isSlowSwipeLeft = dragDistance < -threshold;

    if (isQuickSwipeRight || isSlowSwipeRight) {
      triggerSwipe('right');
    } else if (isQuickSwipeLeft || isSlowSwipeLeft) {
      triggerSwipe('left');
    } else {
      setTransform({ x: 0, y: 0, rotation: 0 });
      dragStateRef.current = { x: 0, y: 0, rotation: 0 };
    }
  }, [isAnimatingSwipe, triggerSwipe]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 p-4">
      <div className="pointer-events-none absolute -left-6 top-8 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-6 -bottom-6 h-28 w-28 rounded-full bg-accent/25 blur-3xl" />
      <div
        ref={containerRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        className="relative w-full max-w-sm aspect-[3/4] cursor-grab select-none overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_25px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl active:cursor-grabbing"
        style={{
          transform: `translateX(${transform.x}px) translateY(${transform.y}px) rotate(${transform.rotation}deg) scale(${isDragging ? 0.98 : 1})`,
          transition: isDragging
            ? 'none'
            : isAnimatingSwipe
            ? 'transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1)'
            : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: isDragging ? 'transform' : 'auto',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div className="absolute inset-0">
          <ProfileCard {...profile} />
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="gradient-chip px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {t('nav.discover')}
          </span>
          {profile.distance && (
            <div className="glass-panel rounded-full px-3 py-1 text-xs font-semibold text-foreground">
              <DistanceBadge distance={profile.distance} />
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <div className="glass-panel rounded-full px-3 py-1 text-xs font-semibold text-primary">
            Live
          </div>
          <div className="glass-panel rounded-full px-3 py-1 text-xs font-semibold text-foreground/80">
            HD
          </div>
        </div>
      </div>

      {/* Swipe Indicators */}
      {isDragging && (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-6 pointer-events-none">
          {transform.x < 0 && (
            <div className="text-5xl font-bold text-destructive opacity-50 animate-pulse">
              ✕
            </div>
          )}
          {transform.x > 0 && (
            <div className="text-5xl font-bold text-accent opacity-50 animate-pulse ml-auto">
              ❤️
            </div>
          )}
        </div>
      )}

      <div className="mt-2 flex w-full max-w-md flex-wrap justify-center gap-5">
        <Button
          onClick={() => triggerSwipe('left')}
          disabled={isLoading}
          size="lg"
          variant="ghost"
          className="h-16 w-16 rounded-full border border-white/70 bg-white/90 p-0 text-foreground shadow-[0_16px_32px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
          title={t('swipe.pass')}
        >
          <X className="w-6 h-6" />
        </Button>

        <Button
          onClick={onSuperLike}
          disabled={isLoading}
          size="lg"
          variant="ghost"
          className="h-16 w-16 rounded-full border border-white/70 bg-gradient-to-br from-white/90 via-primary/20 to-primary/40 p-0 text-primary shadow-[0_16px_40px_rgba(111,72,220,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-105"
          title={t('swipe.superLike')}
        >
          <Zap className="w-6 h-6" />
        </Button>

        <Button
          onClick={() => triggerSwipe('right')}
          disabled={isLoading}
          size="lg"
          variant="ghost"
          className="h-16 w-16 rounded-full border border-white/70 bg-gradient-to-br from-[#f472b6] via-[#f58fd2] to-[#9d6bff] p-0 text-white shadow-[0_18px_42px_rgba(236,72,153,0.4)] transition-all hover:-translate-y-0.5"
          title={t('swipe.like')}
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
