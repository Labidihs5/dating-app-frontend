'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';

interface DistanceSliderProps {
  initialDistance?: number;
  isPremium?: boolean;
  onChange: (distance: number) => void;
  showLabel?: boolean;
}

export function DistanceSlider({
  initialDistance = 50,
  isPremium = false,
  onChange,
  showLabel = true,
}: DistanceSliderProps) {
  const [distance, setDistance] = useState(initialDistance);
  const MIN_DISTANCE = 5;
  const MAX_DISTANCE = isPremium ? 200 : 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setDistance(value);
      onChange(value);
    },
    [onChange]
  );

  const getDistanceLabel = () => {
    if (distance < 1) return 'Exact location';
    if (distance < 5) return 'Very close';
    if (distance < 10) return 'Close by';
    if (distance < 25) return 'Nearby';
    if (distance < 50) return 'Around town';
    if (distance < 100) return 'Across city';
    return 'Across region';
  };

  const getNearbyCount = () => {
    // Simulate number of nearby profiles
    const counts = [12, 25, 38, 52, 67, 85, 120, 160, 195];
    const index = Math.floor((distance / MAX_DISTANCE) * (counts.length - 1));
    return counts[index];
  };

  return (
    <div className="space-y-4">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Search Distance</h3>
          </div>
          {isPremium && (
            <Badge variant="secondary" className="bg-accent/10 border-accent/30">
              <Star className="w-3 h-3 mr-1" />
              GOLD
            </Badge>
          )}
        </div>
      )}

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="space-y-4">
          {/* Current Distance Display */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-primary">{distance}</span>
              <span className="text-lg text-muted-foreground">km</span>
            </div>
            <p className="text-sm text-muted-foreground">{getDistanceLabel()}</p>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={MIN_DISTANCE}
              max={MAX_DISTANCE}
              value={distance}
              onChange={handleChange}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-primary-foreground
                [&::-moz-range-thumb]:w-6
                [&::-moz-range-thumb]:h-6
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-primary
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:shadow-lg
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-primary-foreground
              "
              aria-label="Search distance"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{MIN_DISTANCE} km</span>
              <span>{MAX_DISTANCE} km</span>
            </div>
          </div>

          {/* Profile Count */}
          <div className="bg-background/50 border border-border rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{getNearbyCount()}</span>{' '}
              profiles nearby
            </p>
          </div>

          {/* FREE vs GOLD Info */}
          {!isPremium && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
              <p className="text-xs text-destructive">
                <strong>FREE:</strong> Approximate distance. GOLD shows exact distance!
              </p>
            </div>
          )}

          {isPremium && (
            <div className="bg-success/5 border border-success/20 rounded-lg p-3">
              <p className="text-xs text-success">
                <strong>GOLD:</strong> Exact distance precision! Premium matching.
              </p>
            </div>
          )}

          {/* Distance Presets */}
          <div className="grid grid-cols-3 gap-2">
            {[5, 25, 50, 100].map((preset) => (
              preset <= MAX_DISTANCE && (
                <button
                  key={preset}
                  onClick={() => {
                    setDistance(preset);
                    onChange(preset);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      distance === preset
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {preset}km
                </button>
              )
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
