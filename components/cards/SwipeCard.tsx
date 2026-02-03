'use client';

import React from "react"

import { useState, useRef, useCallback } from 'react';
import { ProfileCard } from './ProfileCard';
import { DistanceBadge } from '@/components/location/DistanceBadge';
import { Button } from '@/components/ui/button';
import { Heart, X, Zap } from 'lucide-react';

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
  // Use refs to avoid excessive re-renders
  const dragStateRef = useRef({ x: 0, y: 0, rotation: 0 });
  const startPosRef = useRef({ x: 0, y: 0, time: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotation: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeDetectedRef = useRef(false);

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
    if (!isDragging || !containerRef.current) return;

    const pos = getPosition(e);
    const rect = containerRef.current.getBoundingClientRect();

    // Calculate position relative to card center
    const x = pos.x - rect.left - rect.width / 2;
    const y = pos.y - rect.top - rect.height / 2;

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

  const handleEnd = useCallback(() => {
    setIsDragging(false);

    if (!containerRef.current || swipeDetectedRef.current) {
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

    swipeDetectedRef.current = true;

    if (isQuickSwipeRight || isSlowSwipeRight) {
      onSwipeRight();
    } else if (isQuickSwipeLeft || isSlowSwipeLeft) {
      onSwipeLeft();
    }

    // Reset after animation completes
    setTimeout(() => {
      setTransform({ x: 0, y: 0, rotation: 0 });
      dragStateRef.current = { x: 0, y: 0, rotation: 0 };
      swipeDetectedRef.current = false;
    }, 100);
  }, [onSwipeLeft, onSwipeRight]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
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
        className="w-full max-w-sm aspect-[3/4] rounded-2xl cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `translateX(${transform.x}px) translateY(${transform.y}px) rotate(${transform.rotation}deg) scale(${isDragging ? 0.98 : 1})`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: isDragging ? 'transform' : 'auto',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <ProfileCard {...profile} />
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

      <div className="mt-8 flex gap-4 justify-center w-full max-w-sm flex-wrap">
        <Button
          onClick={onSwipeLeft}
          disabled={isLoading}
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 p-0 hover:bg-destructive hover:text-destructive-foreground transition-all bg-transparent"
          title="Pass"
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
          title="Like"
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
