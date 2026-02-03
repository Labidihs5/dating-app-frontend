'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Eye, EyeOff } from 'lucide-react';

interface DistanceBadgeProps {
  distance: number;
  isPremium?: boolean;
  isExact?: boolean;
  hideExactLocation?: boolean;
  isTopMatch?: boolean;
}

export function DistanceBadge({
  distance,
  isPremium = false,
  isExact = false,
  hideExactLocation = false,
  isTopMatch = false,
}: DistanceBadgeProps) {
  const displayDistance = hideExactLocation && !isPremium
    ? Math.round(distance / 10) * 10
    : Math.round(distance * 10) / 10;

  return (
    <div className="flex items-center gap-2">
      {isTopMatch && (
        <Badge
          variant="secondary"
          className="bg-accent/20 border-accent/50 text-accent"
        >
          <Star className="w-3 h-3 mr-1" />
          Top Match
        </Badge>
      )}

      <Badge
        variant="secondary"
        className={`flex items-center gap-1 ${
          distance < 5
            ? 'bg-success/20 border-success/50 text-success'
            : distance < 25
            ? 'bg-primary/20 border-primary/50 text-primary'
            : 'bg-secondary/20 border-secondary/50 text-secondary'
        }`}
      >
        <MapPin className="w-3 h-3" />
        {distance < 1 ? 'Your city' : `~${displayDistance}km`}
      </Badge>

      {hideExactLocation && !isPremium && (
        <Badge variant="outline" className="bg-muted/50">
          <EyeOff className="w-3 h-3 mr-1" />
          Approximate
        </Badge>
      )}

      {isPremium && isExact && (
        <Badge variant="outline" className="bg-primary/10 border-primary/30">
          <Eye className="w-3 h-3 mr-1" />
          Exact
        </Badge>
      )}
    </div>
  );
}
