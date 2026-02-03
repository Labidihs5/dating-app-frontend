'use client';

import React from "react"

import { useRef, useState, useCallback } from 'react';

export interface SwipeGestureConfig {
  threshold?: number; // pixels to move before triggering swipe
  velocityThreshold?: number; // minimum velocity to trigger swipe
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface SwipeState {
  isDragging: boolean;
  dragX: number;
  dragY: number;
  rotation: number;
  scale: number;
  opacity: number;
}

export function useSwipeGesture({
  threshold = 50,
  velocityThreshold = 0.5,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: SwipeGestureConfig) {
  const [state, setState] = useState<SwipeState>({
    isDragging: false,
    dragX: 0,
    dragY: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
  });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
  };

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent, rect: DOMRect) => {
    const pos = getPosition(e);
    touchStartRef.current = { x: pos.x, y: pos.y, time: Date.now() };
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent, rect: DOMRect) => {
      if (!touchStartRef.current) return;

      const pos = getPosition(e);
      const dx = pos.x - rect.left - rect.width / 2;
      const dy = pos.y - rect.top - rect.height / 2;
      const absX = Math.abs(dx);
      const maxX = rect.width / 2;

      // Calculate opacity based on drag distance (fade out as you swipe)
      const opacity = Math.max(0.5, 1 - absX / maxX / 2);

      // Calculate rotation (max ±15 degrees)
      const rotation = Math.max(-15, Math.min(15, (dx / maxX) * 20));

      // Calculate scale
      const scale = Math.max(0.9, 1 - absX / maxX / 5);

      setState(prev => ({
        ...prev,
        dragX: dx,
        dragY: dy,
        rotation,
        scale,
        opacity,
      }));
    },
    []
  );

  const handleEnd = useCallback((e: React.TouchEvent | React.MouseEvent | null, rect: DOMRect) => {
    if (!touchStartRef.current) return;

    const pos = e ? getPosition(e) : null;
    if (!pos) {
      setState(prev => ({ ...prev, isDragging: false, dragX: 0, dragY: 0, rotation: 0, scale: 1, opacity: 1 }));
      touchStartRef.current = null;
      return;
    }

    const dx = pos.x - touchStartRef.current.x;
    const dy = pos.y - touchStartRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeDiff = Date.now() - touchStartRef.current.time;
    const velocity = distance / timeDiff;

    console.log('[v0] Swipe end - Distance:', distance, 'Velocity:', velocity, 'DX:', dx, 'DY:', dy);

    // Check for swipe gestures
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (distance > threshold || velocity > velocityThreshold) {
        if (dx > 0) {
          console.log('[v0] Swipe right triggered');
          onSwipeRight?.();
        } else if (dx < 0) {
          console.log('[v0] Swipe left triggered');
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (distance > threshold || velocity > velocityThreshold) {
        if (dy > 0) {
          console.log('[v0] Swipe down triggered');
          onSwipeDown?.();
        } else if (dy < 0) {
          console.log('[v0] Swipe up triggered');
          onSwipeUp?.();
        }
      }
    }

    // Reset state
    setState(prev => ({
      ...prev,
      isDragging: false,
      dragX: 0,
      dragY: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
    }));

    touchStartRef.current = null;
  }, [threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    state,
    handlers: {
      handleStart,
      handleMove,
      handleEnd,
    },
  };
}
