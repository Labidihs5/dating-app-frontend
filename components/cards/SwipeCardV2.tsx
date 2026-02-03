'use client';

import React, { useRef } from 'react';
import { ProfileCard } from './ProfileCard';
import { DistanceBadge } from '@/components/location/DistanceBadge';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Button } from '@/components/ui/button';
import { Heart, X, Zap } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  age: number;
  distance: number;
  image: string;
  bio: string;
  relationshipType: string;
  compatibility?: number;
  isPremium?: boolean;
}

interface SwipeCardV2Props {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  isLoading?: boolean;
}

export function SwipeCardV2({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  isLoading = false,
}: SwipeCardV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { state, handlers } = useSwipeGesture({
    threshold: 50,
    velocityThreshold: 0.3,
    onSwipeLeft: () => !isLoading && onSwipeLeft(),
    onSwipeRight: () => !isLoading && onSwipeRight(),
  });

  const handlePointerDown = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    handlers.handleStart(e as React.MouseEvent & React.TouchEvent, containerRef.current.getBoundingClientRect());
  };

  const handlePointerMove = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    handlers.handleMove(e as React.MouseEvent & React.TouchEvent, containerRef.current.getBoundingClientRect());
  };

  const handlePointerEnd = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    handlers.handleEnd(e as React.MouseEvent & React.TouchEvent, containerRef.current.getBoundingClientRect());
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* Swipe Indicators */}
      {state.isDragging && (
        <>
          {/* Like indicator (right) */}
          {state.dragX > 30 && (
            <div className="absolute top-8 right-8 z-50 animate-pulse">
              <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-semibold">Like!</span>
              </div>
            </div>
          )}

          {/* Dislike indicator (left) */}
          {state.dragX < -30 && (
            <div className="absolute top-8 left-8 z-50 animate-pulse">
              <div className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full">
                <X className="w-5 h-5" />
                <span className="font-semibold">Nope!</span>
              </div>
            </div>
          )}
        </>
      )}

      <div
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerEnd}
        onMouseLeave={handlePointerEnd}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerEnd}
        onTouchCancel={handlePointerEnd}
        className="w-full max-w-sm aspect-[3/4] rounded-2xl cursor-grab active:cursor-grabbing select-none touch-none"
        style={{
          transform: state.isDragging
            ? `translateX(${state.dragX}px) translateY(${state.dragY}px) rotate(${state.rotation}deg) scale(${state.scale})`
            : 'translateX(0) translateY(0) rotate(0deg) scale(1)',
          transition: state.isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: state.opacity,
        }}
      >
        <ProfileCard {...profile} />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-center w-full max-w-sm flex-wrap">
        <Button
          onClick={onSwipeLeft}
          disabled={isLoading}
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 p-0 hover:bg-destructive hover:text-destructive-foreground transition-all bg-transparent"
          title="Pass (Left Swipe)"
        >
          <X className="w-6 h-6" />
        </Button>

        <Button
          onClick={onSuperLike}
          disabled={isLoading}
          size="lg"
          className="rounded-full w-16 h-16 p-0 bg-primary hover:bg-primary/90 transition-all"
          title="Super Like"
        >
          <Zap className="w-6 h-6" />
        </Button>

        <Button
          onClick={onSwipeRight}
          disabled={isLoading}
          size="lg"
          className="rounded-full w-16 h-16 p-0 bg-accent hover:bg-accent/90 transition-all"
          title="Like (Right Swipe)"
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Instructions */}
      <div className="mt-6 text-center text-sm text-muted-foreground md:hidden">
        <p>Swipe left to pass or right to like</p>
      </div>
    </div>
  );
}
